import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { TYPES } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { BookingService } from "../application/booking.service.js";
import type { GoogleCalendarSyncService } from "../application/google-calendar-sync.service.js";
import type { SettingsRepository } from "../domain/ports.js";

const createSchema = z.object({
  meetingTypeId: z.string().min(1),
  startsAt: z.string().datetime(),
  inviteeName: z.string().min(2).max(120),
  inviteeEmail: z.string().email(),
  inviteePhone: z.string().max(40).optional(),
  inviteeOrg: z.string().max(160).optional(),
  notes: z.string().max(2000).optional(),
  // honeypot
  website: z.string().max(0).optional(),
});

@injectable()
export class BookingController {
  constructor(
    @inject(TYPES.BookingService) private readonly svc: BookingService,
    @inject(TYPES.GoogleCalendarSyncService) private readonly gcal: GoogleCalendarSyncService,
    @inject(TYPES.SettingsRepository) private readonly settings: SettingsRepository,
  ) {}

  // public ---
  listMeetingTypes = async (_req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.listPublicMeetingTypes()); } catch (e) { next(e); }
  };
  getMeetingType = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.getPublicMeetingType(req.params.slug!)); } catch (e) { next(e); }
  };
  listSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const meetingTypeId = String(req.query.meetingTypeId ?? "");
      const from = String(req.query.from ?? new Date().toISOString());
      const to = String(req.query.to ?? new Date(Date.now() + 14 * 86400_000).toISOString());
      ok(res, await this.svc.listAvailableSlots(meetingTypeId, from, to));
    } catch (e) { next(e); }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createSchema.parse(req.body);
      const { website: _hp, ...payload } = data;
      ok(res, await this.svc.createBooking(payload), 201);
    } catch (e) { next(e); }
  };
  reschedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = String(req.body?.token ?? "");
      const startsAt = String(req.body?.startsAt ?? "");
      ok(res, await this.svc.rescheduleByInvitee(req.params.id!, token, startsAt));
    } catch (e) { next(e); }
  };
  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = String(req.body?.token ?? req.query.token ?? "");
      const reason = req.body?.reason ?? undefined;
      await this.svc.cancelByInvitee(req.params.id!, token, reason);
      // browser link-friendly response
      if (req.method === "GET") {
        res.send("<h1>Cancelled</h1><p>Your meeting has been cancelled. You can close this window.</p>");
        return;
      }
      ok(res, { ok: true });
    } catch (e) { next(e); }
  };

  // admin ---
  getAvailability = async (_req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.getAvailability()); } catch (e) { next(e); }
  };
  updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.updateAvailability(req.body)); } catch (e) { next(e); }
  };
  listAdminMeetingTypes = async (_req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.listMeetingTypes()); } catch (e) { next(e); }
  };
  createMeetingType = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.createMeetingType(req.body), 201); } catch (e) { next(e); }
  };
  updateMeetingType = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.updateMeetingType(req.params.id!, req.body)); } catch (e) { next(e); }
  };
  deleteMeetingType = async (req: Request, res: Response, next: NextFunction) => {
    try { await this.svc.deleteMeetingType(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
  };
  listBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, await this.svc.listBookings({
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        search: (req.query.search as string) || undefined,
        status: (req.query.status as string) || undefined,
      }));
    } catch (e) { next(e); }
  };
  getBooking = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.getBooking(req.params.id!)); } catch (e) { next(e); }
  };
  confirm = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.confirm(req.params.id!)); } catch (e) { next(e); }
  };
  cancelHost = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.cancelByHost(req.params.id!, req.body?.reason)); } catch (e) { next(e); }
  };
  complete = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.complete(req.params.id!)); } catch (e) { next(e); }
  };

  // Google Calendar ---
  gcalConnect = async (_req: Request, res: Response, next: NextFunction) => {
    try { ok(res, { authUrl: this.gcal.buildAuthUrl() }); } catch (e) { next(e); }
  };
  gcalCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = String(req.body?.code ?? "");
      const { refreshToken, accessToken } = await this.gcal.exchangeCode(code);
      // Fetch primary calendar id by calling calendar list or using "primary"
      const calendarId = "primary";
      const gcSettings = { refreshToken, calendarId, connectedAt: new Date().toISOString() };
      await this.settings.upsert({ googleCalendar: gcSettings });
      ok(res, gcSettings);
    } catch (e) { next(e); }
  };
  gcalSync = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.settings.get();
      const gc = settings?.googleCalendar;
      if (!gc?.refreshToken || !gc?.calendarId) {
        return res.status(400).json({ ok: false, error: { code: "NOT_CONNECTED", message: "Google Calendar not connected" } });
      }
      const accessToken = await this.gcal.refreshAccessToken(gc.refreshToken);
      const from = new Date();
      const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      const [pushed, pulled] = await Promise.all([
        this.gcal.syncAvailabilityToGoogleCalendar(gc.calendarId, accessToken),
        this.gcal.fetchFreeBusyFromGoogleCalendar(gc.calendarId, accessToken, from, to),
      ]);
      ok(res, { pushed, pulled });
    } catch (e) { next(e); }
  };
  gcalDisconnect = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await this.settings.upsert({ googleCalendar: undefined });
      ok(res, { ok: true });
    } catch (e) { next(e); }
  };
}
