import type {
  ApiResponse,
  ProfileDTO,
  TimelineEntryDTO,
  VentureDTO,
  PhilanthropyDTO,
  AchievementDTO,
  QuoteDTO,
  NewsPostDTO,
  EventDTO,
  MediaAssetDTO,
  MessageDTO,
  NewsletterSubscriberDTO,
  SiteSettingsDTO,
  LoginRequest,
  LoginResponse,
  AdminUserDTO,
  Paginated,
  ListQuery,
  AvailabilityProfileDTO,
  MeetingTypeDTO,
  BookingDTO,
  BookableDay,
  SupportedLang,
  FlattenLocalized,
} from "@mahama/shared-types";

export class ApiError extends Error {
  constructor(message: string, public readonly code: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ClientOptions {
  baseUrl: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

export class ApiClient {
  constructor(private readonly opts: ClientOptions) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const token = this.opts.getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "omit",
    });

    if (res.status === 401 && this.opts.onUnauthorized) this.opts.onUnauthorized();
    const json = (await res.json()) as ApiResponse<T>;
    if (!json.ok) throw new ApiError(json.error.message, json.error.code, res.status);
    return json.data;
  }

  // Public endpoints (always return flattened strings)
  getProfile = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<ProfileDTO>>("GET", `/api/public/profile${qs({ lang })}`);
  listTimeline = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<TimelineEntryDTO>[]>("GET", `/api/public/timeline${qs({ lang })}`);
  listVentures = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<VentureDTO>[]>("GET", `/api/public/ventures${qs({ lang })}`);
  listPhilanthropy = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<PhilanthropyDTO>[]>("GET", `/api/public/philanthropy${qs({ lang })}`);
  listAchievements = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<AchievementDTO>[]>("GET", `/api/public/achievements${qs({ lang })}`);
  listQuotes = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<QuoteDTO>[]>("GET", `/api/public/quotes${qs({ lang })}`);
  listNews = (q?: ListQuery & { lang?: SupportedLang }) =>
    this.request<FlattenLocalized<Paginated<NewsPostDTO>>>("GET", `/api/public/news${qs(q)}`);
  getNewsPost = (slug: string, lang?: SupportedLang) =>
    this.request<FlattenLocalized<NewsPostDTO>>("GET", `/api/public/news/${slug}${qs({ lang })}`);
  listEvents = (lang?: SupportedLang) =>
    this.request<FlattenLocalized<EventDTO>[]>("GET", `/api/public/events${qs({ lang })}`);
  getSettings = () => this.request<SiteSettingsDTO>("GET", "/api/public/settings");
  sendMessage = (msg: Pick<MessageDTO, "name" | "email" | "subject" | "body" | "category" | "phone">) =>
    this.request<{ id: string }>("POST", "/api/public/messages", msg);
  subscribeNewsletter = (data: { email: string; name?: string; source?: string }) =>
    this.request<{ id: string }>("POST", "/api/public/newsletter", data);
  askAi = (question: string) => this.request<{ answer: string }>("POST", "/api/public/ai/ask", { question });

  // Booking (public)
  listMeetingTypes = () => this.request<MeetingTypeDTO[]>("GET", "/api/public/booking/meeting-types");
  getMeetingType = (slug: string) => this.request<MeetingTypeDTO>("GET", `/api/public/booking/meeting-types/${slug}`);
  getAvailableSlots = (meetingTypeId: string, params: { from: string; to: string }) =>
    this.request<BookableDay[]>("GET", `/api/public/booking/slots?meetingTypeId=${meetingTypeId}&from=${params.from}&to=${params.to}`);
  createBooking = (data: { meetingTypeId: string; startsAt: string; inviteeName: string; inviteeEmail: string; inviteePhone?: string; inviteeOrg?: string; notes?: string }) =>
    this.request<BookingDTO>("POST", "/api/public/booking", data);
  cancelBooking = (id: string, token: string, reason?: string) =>
    this.request<{ ok: true }>("POST", `/api/public/booking/${id}/cancel`, { token, reason });
  rescheduleBooking = (id: string, token: string, startsAt: string) =>
    this.request<BookingDTO>("POST", `/api/public/booking/${id}/reschedule`, { token, startsAt });

  // Auth
  login = (data: LoginRequest) => this.request<LoginResponse>("POST", "/api/auth/login", data);
  refresh = (refreshToken: string) => this.request<LoginResponse>("POST", "/api/auth/refresh", { refreshToken });
  me = () => this.request<AdminUserDTO>("GET", "/api/auth/me");
  logout = () => this.request<{ ok: true }>("POST", "/api/auth/logout");

  admin = {
    profile: {
      get: () => this.request<ProfileDTO>("GET", "/api/admin/profile"),
      update: (data: Partial<ProfileDTO>) => this.request<ProfileDTO>("PUT", "/api/admin/profile", data),
    },
    timeline: crud<TimelineEntryDTO>(this, "timeline"),
    ventures: crud<VentureDTO>(this, "ventures"),
    philanthropy: crud<PhilanthropyDTO>(this, "philanthropy"),
    achievements: crud<AchievementDTO>(this, "achievements"),
    quotes: crud<QuoteDTO>(this, "quotes"),
    news: crud<NewsPostDTO>(this, "news"),
    events: crud<EventDTO>(this, "events"),
    media: {
      list: (q?: ListQuery) => this.request<Paginated<MediaAssetDTO>>("GET", `/api/admin/media${qs(q)}`),
      sign: () => this.request<{ signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string }>("POST", "/api/admin/media/sign"),
      record: (data: Partial<MediaAssetDTO>) => this.request<MediaAssetDTO>("POST", "/api/admin/media", data),
      remove: (id: string) => this.request<{ ok: true }>("DELETE", `/api/admin/media/${id}`),
    },
    messages: {
      list: (q?: ListQuery) => this.request<Paginated<MessageDTO>>("GET", `/api/admin/messages${qs(q)}`),
      get: (id: string) => this.request<MessageDTO>("GET", `/api/admin/messages/${id}`),
      update: (id: string, patch: Partial<MessageDTO>) => this.request<MessageDTO>("PATCH", `/api/admin/messages/${id}`, patch),
      remove: (id: string) => this.request<{ ok: true }>("DELETE", `/api/admin/messages/${id}`),
      reply: (id: string, body: string) => this.request<{ ok: true }>("POST", `/api/admin/messages/${id}/reply`, { body }),
    },
    subscribers: {
      list: (q?: ListQuery) => this.request<Paginated<NewsletterSubscriberDTO>>("GET", `/api/admin/subscribers${qs(q)}`),
      remove: (id: string) => this.request<{ ok: true }>("DELETE", `/api/admin/subscribers/${id}`),
      broadcast: (data: { subject: string; html: string }) => this.request<{ sent: number }>("POST", `/api/admin/subscribers/broadcast`, data),
    },
    settings: {
      get: () => this.request<SiteSettingsDTO>("GET", "/api/admin/settings"),
      update: (data: Partial<SiteSettingsDTO>) => this.request<SiteSettingsDTO>("PUT", "/api/admin/settings", data),
    },
    users: crud<AdminUserDTO>(this, "users"),
    ai: {
      draftBio: (notes: string) => this.request<{ text: string }>("POST", "/api/admin/ai/draft-bio", { notes }),
      polish: (text: string, tone: string) => this.request<{ text: string }>("POST", "/api/admin/ai/polish", { text, tone }),
      summarize: (text: string) => this.request<{ text: string }>("POST", "/api/admin/ai/summarize", { text }),
    },
    availability: {
      get: () => this.request<AvailabilityProfileDTO>("GET", "/api/admin/booking/availability"),
      update: (data: Partial<AvailabilityProfileDTO>) => this.request<AvailabilityProfileDTO>("PUT", "/api/admin/booking/availability", data),
    },
    meetingTypes: {
      list: () => this.request<MeetingTypeDTO[]>("GET", "/api/admin/booking/meeting-types"),
      create: (data: Partial<MeetingTypeDTO>) => this.request<MeetingTypeDTO>("POST", "/api/admin/booking/meeting-types", data),
      update: (id: string, data: Partial<MeetingTypeDTO>) => this.request<MeetingTypeDTO>("PUT", `/api/admin/booking/meeting-types/${id}`, data),
      remove: (id: string) => this.request<{ ok: true }>("DELETE", `/api/admin/booking/meeting-types/${id}`),
    },
    bookings: {
      list: (q?: ListQuery & { status?: string }) =>
        this.request<Paginated<BookingDTO>>("GET", `/api/admin/booking/bookings${qs(q)}`),
      get: (id: string) => this.request<BookingDTO>("GET", `/api/admin/booking/bookings/${id}`),
      confirm: (id: string) => this.request<BookingDTO>("POST", `/api/admin/booking/bookings/${id}/confirm`),
      cancel: (id: string, reason?: string) => this.request<BookingDTO>("POST", `/api/admin/booking/bookings/${id}/cancel`, { reason }),
      complete: (id: string) => this.request<BookingDTO>("POST", `/api/admin/booking/bookings/${id}/complete`),
    },
    googleCalendar: {
      connect: () => this.request<{ authUrl: string }>("GET", "/api/admin/google-calendar/connect"),
      callback: (code: string) => this.request<{ ok: true }>("POST", "/api/admin/google-calendar/callback", { code }),
      sync: () => this.request<{ pushed: number; pulled: number }>("POST", "/api/admin/google-calendar/sync"),
      disconnect: () => this.request<{ ok: true }>("POST", "/api/admin/google-calendar/disconnect"),
    },
  };
}

function qs(q?: Record<string, unknown> | ListQuery): string {
  if (!q) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v == null || v === "") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

function crud<T extends { id: string }>(client: ApiClient, resource: string) {
  return {
    list: (q?: ListQuery) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any).request("GET", `/api/admin/${resource}${qs(q)}`) as Promise<Paginated<T>>,
    get: (id: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any).request("GET", `/api/admin/${resource}/${id}`) as Promise<T>,
    create: (data: Partial<T>) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any).request("POST", `/api/admin/${resource}`, data) as Promise<T>,
    update: (id: string, data: Partial<T>) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any).request("PUT", `/api/admin/${resource}/${id}`, data) as Promise<T>,
    remove: (id: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (client as any).request("DELETE", `/api/admin/${resource}/${id}`) as Promise<{ ok: true }>,
  };
}
