export type SupportedLang = "en" | "tw" | "ha" | "ee" | "fr";

export type LocalizedString = { en: string } & Partial<Record<"tw" | "ha" | "ee" | "fr", string>>;

export function resolveLocalized(
  value: LocalizedString | string | undefined | null,
  lang: SupportedLang = "en",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || "";
}

export function localize(value: string | LocalizedString | undefined | null): LocalizedString {
  if (!value) return { en: "" };
  if (typeof value === "string") return { en: value };
  return value;
}

export const SUPPORTED_LANGS = new Set<SupportedLang>(["en", "tw", "ha", "ee", "fr"]);

export function normalizeLang(raw: string | undefined): SupportedLang {
  if (!raw) return "en";
  const code = raw.slice(0, 2) as SupportedLang;
  return SUPPORTED_LANGS.has(code) ? code : "en";
}

export type FlattenLocalized<T> = T extends LocalizedString
  ? string
  : T extends string
    ? T
    : T extends Array<infer U>
      ? Array<FlattenLocalized<U>>
      : T extends Date
        ? T
        : T extends object
          ? { [K in keyof T]: FlattenLocalized<T[K]> }
          : T;

export function isLocalizedString(value: unknown): value is LocalizedString {
  if (typeof value !== "object" || value === null) return false;
  const keys = Object.keys(value) as SupportedLang[];
  return keys.includes("en") && keys.every((k) => SUPPORTED_LANGS.has(k) && typeof (value as Record<string, unknown>)[k] === "string");
}

export function flattenLocalized<T>(obj: T, lang: SupportedLang): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return obj;
  if (typeof obj !== "object") return obj;

  if (isLocalizedString(obj)) {
    return resolveLocalized(obj, lang) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => flattenLocalized(item, lang)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = flattenLocalized(value, lang);
  }
  return result as T;
}

export interface ProfileDTO {
  id: string;
  fullName: LocalizedString | string;
  title: LocalizedString | string;
  tagline: LocalizedString | string;
  bio: LocalizedString | string;
  birthDate: string;
  birthPlace: string;
  hometown?: string;
  ethnicity?: string;
  religion?: string;
  spouse?: string;
  children?: string;
  heroImageUrl?: string;
  portraitUrl?: string;
  avatarUrl?: string;
  socials: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: "instagram" | "x" | "facebook" | "linkedin" | "youtube" | "tiktok" | "website";
  handle: string;
  url: string;
}

export interface TimelineEntryDTO {
  id: string;
  date: string;
  year: string;
  title: LocalizedString | string;
  description: LocalizedString | string;
  category: "education" | "career" | "political" | "philanthropy" | "personal" | "award" | "other";
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VentureDTO {
  id: string;
  name: string;
  sector: string;
  founded?: string;
  role: string;
  summary: string;
  highlights: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  websiteUrl?: string;
  metrics: Array<{ label: string; value: string }>;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhilanthropyDTO {
  id: string;
  title: string;
  category: "health" | "education" | "youth" | "disaster-relief" | "religion" | "sports" | "other";
  year: string;
  beneficiary: string;
  summary: string;
  amount?: string;
  imageUrl?: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementDTO {
  id: string;
  title: string;
  category: "award" | "honour" | "milestone" | "policy";
  year: string;
  awarder?: string;
  description: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteDTO {
  id: string;
  text: string;
  context: string;
  date?: string;
  source?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsPostDTO {
  id: string;
  slug: string;
  title: LocalizedString | string;
  excerpt: LocalizedString | string;
  body: LocalizedString | string;
  coverImageUrl?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventDTO {
  id: string;
  title: LocalizedString | string;
  description: LocalizedString | string;
  startsAt: string;
  endsAt?: string;
  venue: LocalizedString | string;
  city: LocalizedString | string;
  country: string;
  category: "speech" | "philanthropy" | "business" | "sport" | "political" | "other";
  imageUrl?: string;
  url?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAssetDTO {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  alt: string;
  caption?: string;
  credit?: string;
  tags: string[];
  createdAt: string;
}

export interface MessageDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  body: string;
  category: "press" | "philanthropy" | "business" | "general" | "speaking" | "fan";
  status: "new" | "read" | "replied" | "archived";
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriberDTO {
  id: string;
  email: string;
  name?: string;
  source?: string;
  confirmed: boolean;
  confirmedAt?: string;
  unsubscribed: boolean;
  unsubscribedAt?: string;
  createdAt: string;
}

export interface GoogleCalendarSettings {
  refreshToken?: string;
  calendarId?: string;
  connectedAt?: string;
}

export interface SiteSettingsDTO {
  id: string;
  subject: string;
  themeColor: string;
  accentColor: string;
  ctaLabel: string;
  ctaHref: string;
  footerText: string;
  metaTitle: string;
  metaDescription: string;
  metaImage?: string;
  contactEmail: string;
  googleCalendar?: GoogleCalendarSettings;
  updatedAt: string;
}
