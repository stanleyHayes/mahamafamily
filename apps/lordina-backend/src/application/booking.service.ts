import { injectable, inject } from "inversify";
import { randomBytes } from "node:crypto";
import { TYPES, ConflictError, NotFoundError, ValidationError, type Logger } from "@mahama/backend-core";
import type {
  AvailabilityProfileDTO,
  BookableDay,
  BookingDTO,
  BookingStatus,
  ListQuery,
  MeetingTypeDTO,
  Paginated,
} from "@mahama/shared-types";
import type { BackendEnv } from "@mahama/config";
import type { AvailabilityRepository, BookingRepository } from "../domain/scheduling-ports.js";
import type { EmailSender, SettingsRepository } from "../domain/ports.js";
import type { GoogleCalendarSyncService } from "./google-calendar-sync.service.js";

@injectable()
export class BookingService {
  constructor(
    @inject(TYPES.AvailabilityRepository) private readonly availability: AvailabilityRepository,
    @inject(TYPES.BookingRepository) private readonly bookings: BookingRepository,
    @inject(TYPES.EmailSender) private readonly mail: EmailSender,
    @inject(TYPES.SettingsRepository) private readonly settings: SettingsRepository,
    @inject(TYPES.GoogleCalendarSyncService) private readonly gcal: GoogleCalendarSyncService,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  // ================= public-facing =================

  listPublicMeetingTypes() {
    return this.availability.listMeetingTypes({ onlyActive: true, onlyPublic: true });
  }

  async getPublicMeetingType(slug: string): Promise<MeetingTypeDTO> {
    const t = await this.availability.findMeetingTypeBySlug(slug);
    if (!t) throw new NotFoundError("Meeting type", slug);
    return t;
  }

  async listAvailableSlots(meetingTypeId: string, fromIso: string, toIso: string): Promise<BookableDay[]> {
    const mt = await this.availability.findMeetingTypeById(meetingTypeId);
    if (!mt || !mt.active) throw new NotFoundError("Meeting type", meetingTypeId);
    const profile = await this.availability.get();
    if (!profile) return [];

    const earliest = new Date(Date.now() + mt.noticeHours * 60 * 60 * 1000);
    const horizonEnd = new Date(Date.now() + mt.horizonDays * 24 * 60 * 60 * 1000);

    const from = max(new Date(fromIso), earliest);
    const to = min(new Date(toIso), horizonEnd);
    if (from >= to) return [];

    const existing = await this.bookings.findActiveBetween(from, to);
    const busy = existing.map((b) => ({ start: new Date(b.startsAt).getTime(), end: new Date(b.endsAt).getTime() }));
    const externalBusy = (profile.externalBusySlots ?? []).map((s) => ({
      start: new Date(s.startsAt).getTime(),
      end: new Date(s.endsAt).getTime(),
    }));

    const days: BookableDay[] = [];
    for (let cur = new Date(from); cur < to; cur = addDays(cur, 1)) {
      const isoDate = cur.toISOString().slice(0, 10);
      if (profile.blackoutDates.includes(isoDate)) {
        days.push({ date: isoDate, slots: [] });
        continue;
      }
      const dayWindows = profile.windows.filter((w) => w.active && w.dayOfWeek === cur.getUTCDay());
      const slots: BookableDay["slots"] = [];
      for (const w of dayWindows) {
        const wStart = makeUtc(cur, w.startTime);
        const wEnd = makeUtc(cur, w.endTime);
        let cursor = wStart.getTime();
        while (cursor + mt.durationMinutes * 60_000 <= wEnd.getTime()) {
          const start = cursor;
          const end = start + mt.durationMinutes * 60_000;
          const overlap = busy.some((b) => start < b.end + mt.bufferMinutes * 60_000 && end + mt.bufferMinutes * 60_000 > b.start)
            || externalBusy.some((b) => start < b.end + mt.bufferMinutes * 60_000 && end + mt.bufferMinutes * 60_000 > b.start);
          if (start >= earliest.getTime() && !overlap) {
            slots.push({
              startsAt: new Date(start).toISOString(),
              endsAt: new Date(end).toISOString(),
            });
          }
          cursor += mt.durationMinutes * 60_000;
        }
      }
      days.push({ date: isoDate, slots });
    }
    return days;
  }

  async createBooking(data: {
    meetingTypeId: string;
    startsAt: string;
    inviteeName: string;
    inviteeEmail: string;
    inviteePhone?: string;
    inviteeOrg?: string;
    notes?: string;
  }): Promise<BookingDTO> {
    const mt = await this.availability.findMeetingTypeById(data.meetingTypeId);
    if (!mt || !mt.active) throw new NotFoundError("Meeting type", data.meetingTypeId);

    const start = new Date(data.startsAt);
    const end = new Date(start.getTime() + mt.durationMinutes * 60_000);
    const earliest = new Date(Date.now() + mt.noticeHours * 60 * 60 * 1000);
    if (start < earliest) {
      throw new ValidationError(`Bookings must be at least ${mt.noticeHours} hours in advance`);
    }

    // Optimistic lock: re-verify the slot is still free immediately before writing.
    await this.assertSlotStillFree(mt.id, start, end);

    const booking = await this.bookings.create({
      meetingTypeId: mt.id,
      meetingTypeName: mt.name,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      durationMinutes: mt.durationMinutes,
      inviteeName: data.inviteeName.trim(),
      inviteeEmail: data.inviteeEmail.toLowerCase().trim(),
      inviteePhone: data.inviteePhone?.trim(),
      inviteeOrg: data.inviteeOrg?.trim(),
      notes: data.notes?.trim(),
      status: "confirmed", // auto-confirm — host can later cancel
      reminderState: { dayBefore: false, hourBefore: false },
      cancelToken: randomBytes(24).toString("base64url"),
      meetingLocation: this.formatLocation(mt),
    });

    await this.syncBookingToGoogleCalendar(booking);
    await this.notifyBookingCreated(booking, mt);
    return booking;
  }

  async rescheduleByInvitee(id: string, token: string, newStart: string): Promise<BookingDTO> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundError("Booking", id);
    if (booking.cancelToken !== token) throw new ValidationError("Invalid token");
    if (booking.status === "cancelled") throw new ValidationError("This booking is already cancelled");

    const mt = await this.availability.findMeetingTypeById(booking.meetingTypeId);
    if (!mt) throw new NotFoundError("Meeting type", booking.meetingTypeId);

    const start = new Date(newStart);
    const end = new Date(start.getTime() + mt.durationMinutes * 60_000);
    await this.assertSlotStillFree(mt.id, start, end);

    const updated = await this.bookings.update(id, {
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      reminderState: { dayBefore: false, hourBefore: false },
    });
    if (!updated) throw new NotFoundError("Booking", id);

    await this.mail.send({
      to: updated.inviteeEmail,
      subject: `Rescheduled: ${updated.meetingTypeName}`,
      html: `<p>Hello ${escape(updated.inviteeName)},</p><p>Your meeting has been rescheduled to <b>${formatPretty(updated.startsAt)}</b>.</p>`,
    });
    if (this.env.CONTACT_INBOX) {
      await this.mail.send({
        to: this.env.CONTACT_INBOX,
        subject: `[Rescheduled] ${updated.meetingTypeName} with ${updated.inviteeName}`,
        html: `<p>${updated.inviteeName} (${updated.inviteeEmail}) moved their booking to ${formatPretty(updated.startsAt)}.</p>`,
      });
    }
    return updated;
  }

  async cancelByInvitee(id: string, token: string, reason?: string): Promise<void> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new NotFoundError("Booking", id);
    if (booking.cancelToken !== token) throw new ValidationError("Invalid cancellation token");
    if (booking.status === "cancelled") return;
    await this.bookings.update(id, {
      status: "cancelled",
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: "invitee",
    });
    if (this.env.CONTACT_INBOX) {
      await this.mail.send({
        to: this.env.CONTACT_INBOX,
        subject: `[Cancelled] ${booking.meetingTypeName} with ${booking.inviteeName}`,
        html: `<p>${booking.inviteeName} (${booking.inviteeEmail}) cancelled their booking on ${formatPretty(booking.startsAt)}.</p>${reason ? `<p>Reason: ${escape(reason)}</p>` : ""}`,
      });
    }
  }

  // ================= admin-facing =================

  listBookings(q: ListQuery & { status?: string }): Promise<Paginated<BookingDTO>> {
    return this.bookings.list(q);
  }

  async getBooking(id: string): Promise<BookingDTO> {
    const b = await this.bookings.findById(id);
    if (!b) throw new NotFoundError("Booking", id);
    return b;
  }

  async confirm(id: string): Promise<BookingDTO> {
    const b = await this.bookings.update(id, { status: "confirmed" });
    if (!b) throw new NotFoundError("Booking", id);
    return b;
  }

  async cancelByHost(id: string, reason?: string): Promise<BookingDTO> {
    const b = await this.bookings.update(id, {
      status: "cancelled",
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
      cancelledBy: "host",
    });
    if (!b) throw new NotFoundError("Booking", id);
    await this.deleteBookingFromGoogleCalendar(b);
    await this.mail.send({
      to: b.inviteeEmail,
      subject: `Cancelled: ${b.meetingTypeName}`,
      html: `<p>Hello ${escape(b.inviteeName)},</p><p>Your meeting on ${formatPretty(b.startsAt)} has been cancelled.</p>${reason ? `<p>${escape(reason)}</p>` : ""}<p>Please book another time when convenient.</p>`,
    });
    return b;
  }

  async complete(id: string): Promise<BookingDTO> {
    const b = await this.bookings.update(id, { status: "completed" });
    if (!b) throw new NotFoundError("Booking", id);
    return b;
  }

  // ================= availability mgmt =================

  getAvailability(): Promise<AvailabilityProfileDTO | null> {
    return this.availability.get();
  }

  updateAvailability(data: Partial<AvailabilityProfileDTO>) {
    return this.availability.upsert(data);
  }

  listMeetingTypes() {
    return this.availability.listMeetingTypes();
  }

  createMeetingType(data: Partial<MeetingTypeDTO>): Promise<MeetingTypeDTO> {
    const slug = (data.slug ?? slugify(data.name ?? "meeting")).toLowerCase();
    const fillIn: Omit<MeetingTypeDTO, "id" | "createdAt" | "updatedAt"> = {
      slug,
      name: data.name ?? "Meeting",
      description: data.description ?? "",
      durationMinutes: data.durationMinutes ?? 30,
      bufferMinutes: data.bufferMinutes ?? 0,
      location: data.location ?? "video",
      locationDetails: data.locationDetails,
      active: data.active ?? true,
      public: data.public ?? true,
      noticeHours: data.noticeHours ?? 24,
      horizonDays: data.horizonDays ?? 30,
      color: data.color,
    };
    return this.availability.createMeetingType(fillIn);
  }

  async updateMeetingType(id: string, data: Partial<MeetingTypeDTO>): Promise<MeetingTypeDTO> {
    const r = await this.availability.updateMeetingType(id, data);
    if (!r) throw new NotFoundError("Meeting type", id);
    return r;
  }

  async deleteMeetingType(id: string): Promise<void> {
    const ok = await this.availability.deleteMeetingType(id);
    if (!ok) throw new NotFoundError("Meeting type", id);
  }

  // ================= reminders =================

  async runRemindersTick(now = new Date()): Promise<{ day: number; hour: number }> {
    let day = 0;
    let hour = 0;
    const dayDue = await this.bookings.findDueForReminder("day", now);
    for (const b of dayDue) {
      try {
        await this.sendReminder(b, "day");
        await this.bookings.markReminderSent(b.id, "day");
        day++;
      } catch (e) {
        this.logger.warn("day reminder failed", { id: b.id, error: (e as Error).message });
      }
    }
    const hourDue = await this.bookings.findDueForReminder("hour", now);
    for (const b of hourDue) {
      try {
        await this.sendReminder(b, "hour");
        await this.bookings.markReminderSent(b.id, "hour");
        hour++;
      } catch (e) {
        this.logger.warn("hour reminder failed", { id: b.id, error: (e as Error).message });
      }
    }
    return { day, hour };
  }

  private async sendReminder(b: BookingDTO, when: "day" | "hour") {
    const subjLabel = when === "day" ? "Tomorrow" : "Coming up shortly";
    await this.mail.send({
      to: b.inviteeEmail,
      subject: `${subjLabel}: ${b.meetingTypeName}`,
      html: `<p>Hello ${escape(b.inviteeName)},</p><p>This is a reminder that your ${escape(b.meetingTypeName)} with the office of ${this.env.SUBJECT} is scheduled for <b>${formatPretty(b.startsAt)}</b>.</p><p><b>Where:</b> ${escape(b.meetingLocation)}</p>${b.notes ? `<p><b>Notes:</b> ${escape(b.notes)}</p>` : ""}<p>Need to change it? <a href="${this.rescheduleUrl(b)}">Reschedule</a> · <a href="${this.cancelUrl(b)}">Cancel</a></p>`,
    });
    if (this.env.CONTACT_INBOX) {
      await this.mail.send({
        to: this.env.CONTACT_INBOX,
        subject: `${subjLabel}: ${b.meetingTypeName} with ${b.inviteeName}`,
        html: `<p>Reminder for the office: <b>${formatPretty(b.startsAt)}</b> — ${escape(b.inviteeName)} (${escape(b.inviteeEmail)}).</p>`,
      });
    }
  }

  private async notifyBookingCreated(b: BookingDTO, _mt: MeetingTypeDTO): Promise<void> {
    const ics = buildIcs(b, this.env.PUBLIC_BASE_URL, this.env.SUBJECT);
    const gcal = buildGcalLink(b);
    await this.mail.send({
      to: b.inviteeEmail,
      subject: `Confirmed: ${b.meetingTypeName} on ${formatPretty(b.startsAt)}`,
      html: `<p>Hello ${escape(b.inviteeName)},</p><p>Your ${escape(b.meetingTypeName)} with the office of ${this.env.SUBJECT} is confirmed for <b>${formatPretty(b.startsAt)}</b>.</p><p><b>Where:</b> ${escape(b.meetingLocation)}</p>${b.notes ? `<p><b>Notes:</b> ${escape(b.notes)}</p>` : ""}<p><a href="${gcal}">Add to Google Calendar</a> · ICS attached.</p><p>You'll receive a reminder the day before and again an hour before.</p><p>Need to change the time? <a href="${this.rescheduleUrl(b)}">Reschedule</a> · Or <a href="${this.cancelUrl(b)}">cancel</a>.</p>`,
      attachments: [{ filename: "meeting.ics", contentBase64: Buffer.from(ics).toString("base64") }],
    });
    if (this.env.CONTACT_INBOX) {
      await this.mail.send({
        to: this.env.CONTACT_INBOX,
        subject: `New booking: ${b.meetingTypeName} with ${b.inviteeName}`,
        replyTo: b.inviteeEmail,
        html: `<p><b>${escape(b.inviteeName)}</b> &lt;${escape(b.inviteeEmail)}&gt;${b.inviteePhone ? ` · ${escape(b.inviteePhone)}` : ""}${b.inviteeOrg ? ` · ${escape(b.inviteeOrg)}` : ""}</p><p><b>${escape(b.meetingTypeName)}</b> — ${formatPretty(b.startsAt)}</p>${b.notes ? `<p>${escape(b.notes)}</p>` : ""}<p><b>Where:</b> ${escape(b.meetingLocation)}</p>`,
      });
    }
  }

  private cancelUrl(b: BookingDTO): string {
    return `${this.env.PUBLIC_BASE_URL}/api/public/booking/${b.id}/cancel?token=${b.cancelToken}`;
  }

  private rescheduleUrl(b: BookingDTO): string {
    const host = this.env.ALLOWED_ORIGINS.split(",")[0]?.trim() ?? this.env.PUBLIC_BASE_URL;
    return `${host.replace(/\/$/, "")}/reschedule/${b.id}?token=${b.cancelToken}`;
  }

  private formatLocation(mt: MeetingTypeDTO): string {
    if (mt.location === "video") return mt.locationDetails ?? "Video call (link to follow)";
    if (mt.location === "phone") return mt.locationDetails ?? "Phone call (we'll dial you)";
    if (mt.location === "in-person") return mt.locationDetails ?? "Office of the Subject, Accra";
    return mt.locationDetails ?? "TBC";
  }

  private async syncBookingToGoogleCalendar(booking: BookingDTO): Promise<void> {
    try {
      const settings = await this.settings.get();
      const gc = settings?.googleCalendar;
      if (!gc?.refreshToken || !gc?.calendarId) return;
      const accessToken = await this.gcal.refreshAccessToken(gc.refreshToken);
      const eventId = await this.gcal.insertEvent(gc.calendarId, accessToken, booking);
      await this.bookings.update(booking.id, { googleCalendarEventId: eventId });
    } catch (e) {
      this.logger.warn("Google Calendar insert failed", { bookingId: booking.id, error: (e as Error).message });
    }
  }

  private async deleteBookingFromGoogleCalendar(booking: BookingDTO): Promise<void> {
    if (!booking.googleCalendarEventId) return;
    try {
      const settings = await this.settings.get();
      const gc = settings?.googleCalendar;
      if (!gc?.refreshToken || !gc?.calendarId) return;
      const accessToken = await this.gcal.refreshAccessToken(gc.refreshToken);
      await this.gcal.deleteEvent(gc.calendarId, accessToken, booking.googleCalendarEventId);
      await this.bookings.update(booking.id, { googleCalendarEventId: undefined });
    } catch (e) {
      this.logger.warn("Google Calendar delete failed", { bookingId: booking.id, error: (e as Error).message });
    }
  }

  private async assertSlotStillFree(meetingTypeId: string, start: Date, end: Date): Promise<void> {
    // Recompute availability in the narrow window between read and write.
    // If another request sniped the slot, this will fail fast with ConflictError.
    const days = await this.listAvailableSlots(meetingTypeId, start.toISOString(), end.toISOString());
    const matching = days.flatMap((d) => d.slots).find((s) => s.startsAt === start.toISOString());
    if (!matching) throw new ConflictError("That slot is no longer available");
  }
}

// helpers
function makeUtc(day: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  const d = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h ?? 0, m ?? 0));
  return d;
}
function addDays(d: Date, n: number): Date { const x = new Date(d); x.setUTCDate(d.getUTCDate() + n); x.setUTCHours(0, 0, 0, 0); return x; }
function max(a: Date, b: Date): Date { return a > b ? a : b; }
function min(a: Date, b: Date): Date { return a < b ? a : b; }
function slugify(s: string): string { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function escape(s: string): string { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)); }
function formatPretty(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Accra" }) + " GMT";
}
function buildGcalLink(b: BookingDTO): string {
  const fmt = (iso: string) => iso.replace(/[-:]|\.\d{3}/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: b.meetingTypeName,
    dates: `${fmt(b.startsAt)}/${fmt(b.endsAt)}`,
    details: `Booking ID ${b.id}`,
    location: b.meetingLocation,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcs(b: BookingDTO, baseUrl: string, subject: string): string {
  const dtFormat = (iso: string) => iso.replace(/[-:]|\.\d{3}/g, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${subject}//mahama-portfolios//EN`,
    "BEGIN:VEVENT",
    `UID:${b.id}@mahama-portfolios`,
    `DTSTAMP:${dtFormat(new Date().toISOString())}`,
    `DTSTART:${dtFormat(b.startsAt)}`,
    `DTEND:${dtFormat(b.endsAt)}`,
    `SUMMARY:${b.meetingTypeName}`,
    `DESCRIPTION:Booked via ${baseUrl}`,
    `LOCATION:${b.meetingLocation}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
