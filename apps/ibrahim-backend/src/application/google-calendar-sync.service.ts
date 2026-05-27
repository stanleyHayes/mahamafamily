import { injectable, inject } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { BookingDTO, ExternalBusySlot } from "@mahama/shared-types";
import type { BookingRepository, AvailabilityRepository } from "../domain/scheduling-ports.js";
import type { SettingsRepository } from "../domain/ports.js";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

@injectable()
export class GoogleCalendarSyncService {
  constructor(
    @inject(TYPES.BookingRepository) private readonly bookings: BookingRepository,
    @inject(TYPES.AvailabilityRepository) private readonly availability: AvailabilityRepository,
    @inject(TYPES.SettingsRepository) private readonly settings: SettingsRepository,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  buildAuthUrl(state?: string): string {
    const clientId = this.env.GOOGLE_CLIENT_ID;
    const redirectUri = this.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri) throw new Error("Google Calendar OAuth is not configured");
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar.events",
      access_type: "offline",
      prompt: "consent",
      ...(state ? { state } : {}),
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<{ refreshToken: string; accessToken: string }> {
    const clientId = this.env.GOOGLE_CLIENT_ID;
    const clientSecret = this.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = this.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) throw new Error("Google Calendar OAuth is not configured");

    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token exchange failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as TokenResponse;
    if (!data.refresh_token) throw new Error("Google did not return a refresh token");
    return { refreshToken: data.refresh_token, accessToken: data.access_token };
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const clientId = this.env.GOOGLE_CLIENT_ID;
    const clientSecret = this.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("Google Calendar OAuth is not configured");

    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Refresh token failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as Omit<TokenResponse, "refresh_token">;
    return data.access_token;
  }

  async insertEvent(calendarId: string, accessToken: string, booking: BookingDTO): Promise<string> {
    const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `${booking.meetingTypeName} with ${booking.inviteeName}`,
        description: `Booking ID: ${booking.id}\nEmail: ${booking.inviteeEmail}\n${booking.notes ?? ""}`,
        start: { dateTime: booking.startsAt },
        end: { dateTime: booking.endsAt },
        transparency: "opaque",
        reminders: { useDefault: false, overrides: [] },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Insert event failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as { id: string };
    return data.id;
  }

  async deleteEvent(calendarId: string, accessToken: string, eventId: string): Promise<void> {
    const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok && res.status !== 404 && res.status !== 410) {
      const text = await res.text();
      throw new Error(`Delete event failed: ${res.status} ${text}`);
    }
  }

  async syncAvailabilityToGoogleCalendar(calendarId: string, accessToken: string): Promise<number> {
    const from = new Date();
    const to = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const activeBookings = await this.bookings.findActiveBetween(from, to);
    let pushed = 0;
    for (const b of activeBookings) {
      if (b.googleCalendarEventId) continue;
      try {
        const eventId = await this.insertEvent(calendarId, accessToken, b);
        await this.bookings.update(b.id, { googleCalendarEventId: eventId });
        pushed++;
      } catch (e) {
        this.logger.warn("Failed to push booking to Google Calendar", { bookingId: b.id, error: (e as Error).message });
      }
    }
    return pushed;
  }

  async fetchFreeBusyFromGoogleCalendar(calendarId: string, accessToken: string, from: Date, to: Date): Promise<number> {
    const params = new URLSearchParams({
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "2500",
    });
    const url = `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Fetch events failed: ${res.status} ${text}`);
    }
    const data = (await res.json()) as {
      items: Array<{
        id: string;
        summary?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
      }>;
    };

    const slots: ExternalBusySlot[] = [];
    for (const item of data.items ?? []) {
      const start = item.start?.dateTime ?? (item.start?.date ? `${item.start.date}T00:00:00Z` : undefined);
      const end = item.end?.dateTime ?? (item.end?.date ? `${item.end.date}T23:59:59Z` : undefined);
      if (!start || !end) continue;
      slots.push({ startsAt: start, endsAt: end, source: `google-calendar:${item.id}` });
    }

    await this.availability.upsert({ externalBusySlots: slots });
    return slots.length;
  }
}
