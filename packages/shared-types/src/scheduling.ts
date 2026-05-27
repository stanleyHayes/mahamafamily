export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export interface AvailabilityWindowDTO {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  active: boolean;
}

export interface MeetingTypeDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  location: "in-person" | "video" | "phone" | "custom";
  locationDetails?: string;
  active: boolean;
  /** Visibility: do not surface to public when false. */
  public: boolean;
  /** Block bookings closer than X hours from now. */
  noticeHours: number;
  /** Allow booking up to N days ahead. */
  horizonDays: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalBusySlot {
  startsAt: string;
  endsAt: string;
  source: string;
}

export interface AvailabilityProfileDTO {
  id: string;
  timezone: string;
  windows: AvailabilityWindowDTO[];
  blackoutDates: string[]; // ISO dates
  externalBusySlots?: ExternalBusySlot[];
  meetingTypes: MeetingTypeDTO[];
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no-show";

export interface BookingDTO {
  id: string;
  meetingTypeId: string;
  meetingTypeName: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  inviteeName: string;
  inviteeEmail: string;
  inviteePhone?: string;
  inviteeOrg?: string;
  notes?: string;
  status: BookingStatus;
  reminderState: {
    dayBefore: boolean;
    hourBefore: boolean;
  };
  cancelToken: string;
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: "invitee" | "host";
  meetingLocation: string;
  googleCalendarEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookableSlot {
  startsAt: string;
  endsAt: string;
}

export interface BookableDay {
  date: string; // YYYY-MM-DD
  slots: BookableSlot[];
}
