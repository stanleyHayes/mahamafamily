import type {
  AvailabilityProfileDTO,
  BookingDTO,
  BookingStatus,
  ListQuery,
  MeetingTypeDTO,
  Paginated,
} from "@mahama/shared-types";

export interface AvailabilityRepository {
  get(): Promise<AvailabilityProfileDTO | null>;
  upsert(data: Partial<AvailabilityProfileDTO>): Promise<AvailabilityProfileDTO>;
  listMeetingTypes(opts?: { onlyActive?: boolean; onlyPublic?: boolean }): Promise<MeetingTypeDTO[]>;
  findMeetingTypeById(id: string): Promise<MeetingTypeDTO | null>;
  findMeetingTypeBySlug(slug: string): Promise<MeetingTypeDTO | null>;
  createMeetingType(data: Omit<MeetingTypeDTO, "id" | "createdAt" | "updatedAt">): Promise<MeetingTypeDTO>;
  updateMeetingType(id: string, data: Partial<MeetingTypeDTO>): Promise<MeetingTypeDTO | null>;
  deleteMeetingType(id: string): Promise<boolean>;
}

export interface BookingRepository {
  list(query: ListQuery & { status?: BookingStatus | string }): Promise<Paginated<BookingDTO>>;
  findById(id: string): Promise<BookingDTO | null>;
  findActiveBetween(from: Date, to: Date): Promise<BookingDTO[]>;
  findDueForReminder(window: "day" | "hour", now: Date): Promise<BookingDTO[]>;
  create(data: Omit<BookingDTO, "id" | "createdAt" | "updatedAt">): Promise<BookingDTO>;
  update(id: string, data: Partial<BookingDTO>): Promise<BookingDTO | null>;
  markReminderSent(id: string, window: "day" | "hour"): Promise<void>;
}
