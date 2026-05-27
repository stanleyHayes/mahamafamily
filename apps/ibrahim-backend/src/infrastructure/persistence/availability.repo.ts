import { injectable, inject } from "inversify";
import { ObjectId, type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { AvailabilityProfileDTO, MeetingTypeDTO } from "@mahama/shared-types";
import { fromDoc, timestamps } from "./mongo.helpers.js";
import type { AvailabilityRepository } from "../../domain/scheduling-ports.js";

const DEFAULT_PROFILE = (subject: string): Omit<AvailabilityProfileDTO, "id"> => ({
  timezone: "Africa/Accra",
  windows: [
    { id: "win-mon", dayOfWeek: 1, startTime: "09:00", endTime: "12:00", active: true },
    { id: "win-tue", dayOfWeek: 2, startTime: "09:00", endTime: "12:00", active: true },
    { id: "win-wed", dayOfWeek: 3, startTime: "09:00", endTime: "12:00", active: true },
    { id: "win-thu", dayOfWeek: 4, startTime: "14:00", endTime: "17:00", active: true },
    { id: "win-fri", dayOfWeek: 5, startTime: "09:00", endTime: "12:00", active: true },
  ],
  blackoutDates: [],
  meetingTypes: [],
  updatedAt: new Date().toISOString(),
});

@injectable()
export class MongoAvailabilityRepository implements AvailabilityRepository {
  constructor(
    @inject(TYPES.Mongo) private readonly db: Db,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  private get profileCol() {
    return this.db.collection("availability_profile");
  }
  private get typesCol() {
    return this.db.collection("meeting_types");
  }

  async get(): Promise<AvailabilityProfileDTO | null> {
    const profile = await this.profileCol.findOne({ subject: this.env.SUBJECT });
    if (!profile) {
      const created = await this.upsert(DEFAULT_PROFILE(this.env.SUBJECT));
      return created;
    }
    const meetingTypes = await this.listMeetingTypes();
    return { ...fromDoc<AvailabilityProfileDTO>(profile as never), meetingTypes };
  }

  async upsert(data: Partial<AvailabilityProfileDTO>): Promise<AvailabilityProfileDTO> {
    const result = await this.profileCol.findOneAndUpdate(
      { subject: this.env.SUBJECT },
      {
        $set: {
          ...("timezone" in data ? { timezone: data.timezone } : {}),
          ...("windows" in data ? { windows: data.windows } : {}),
          ...("blackoutDates" in data ? { blackoutDates: data.blackoutDates } : {}),
          ...("externalBusySlots" in data ? { externalBusySlots: data.externalBusySlots } : {}),
          ...timestamps(false),
        },
        $setOnInsert: { subject: this.env.SUBJECT, createdAt: new Date().toISOString() },
      },
      { upsert: true, returnDocument: "after" },
    );
    const meetingTypes = await this.listMeetingTypes();
    return { ...fromDoc<AvailabilityProfileDTO>(result as never), meetingTypes };
  }

  async listMeetingTypes(opts?: { onlyActive?: boolean; onlyPublic?: boolean }): Promise<MeetingTypeDTO[]> {
    const filter: Record<string, unknown> = {};
    if (opts?.onlyActive) filter.active = true;
    if (opts?.onlyPublic) filter.public = true;
    const docs = await this.typesCol.find(filter).sort({ createdAt: 1 }).toArray();
    return docs.map((d) => fromDoc<MeetingTypeDTO>(d as never));
  }

  async findMeetingTypeById(id: string): Promise<MeetingTypeDTO | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.typesCol.findOne({ _id: new ObjectId(id) });
    return doc ? fromDoc<MeetingTypeDTO>(doc as never) : null;
  }

  async findMeetingTypeBySlug(slug: string): Promise<MeetingTypeDTO | null> {
    const doc = await this.typesCol.findOne({ slug, active: true, public: true });
    return doc ? fromDoc<MeetingTypeDTO>(doc as never) : null;
  }

  async createMeetingType(data: Omit<MeetingTypeDTO, "id" | "createdAt" | "updatedAt">): Promise<MeetingTypeDTO> {
    const ts = timestamps(true);
    const result = await this.typesCol.insertOne({ ...data, ...ts } as never);
    return { id: result.insertedId.toHexString(), ...data, ...ts } as MeetingTypeDTO;
  }

  async updateMeetingType(id: string, data: Partial<MeetingTypeDTO>): Promise<MeetingTypeDTO | null> {
    if (!ObjectId.isValid(id)) return null;
    const { id: _ignore, createdAt: _c, ...rest } = data as MeetingTypeDTO & { id?: string; createdAt?: string };
    const result = await this.typesCol.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...rest, ...timestamps(false) } },
      { returnDocument: "after" },
    );
    return result ? fromDoc<MeetingTypeDTO>(result as never) : null;
  }

  async deleteMeetingType(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const r = await this.typesCol.deleteOne({ _id: new ObjectId(id) });
    return r.deletedCount === 1;
  }
}
