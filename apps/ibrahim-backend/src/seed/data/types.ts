import type {
  AchievementDTO,
  EventDTO,
  MeetingTypeDTO,
  PhilanthropyDTO,
  ProfileDTO,
  QuoteDTO,
  SiteSettingsDTO,
  TimelineEntryDTO,
  VentureDTO,
} from "@mahama/shared-types";

type Seed<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export interface SeedBundle {
  profile: Partial<ProfileDTO>;
  settings: Partial<SiteSettingsDTO>;
  timeline: Array<Seed<TimelineEntryDTO>>;
  ventures: Array<Seed<VentureDTO>>;
  philanthropy: Array<Seed<PhilanthropyDTO>>;
  achievements: Array<Seed<AchievementDTO>>;
  quotes: Array<Seed<QuoteDTO>>;
  events: Array<Seed<EventDTO>>;
  meetingTypes: Array<Seed<MeetingTypeDTO>>;
}
