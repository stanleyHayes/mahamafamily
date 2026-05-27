import { injectable, inject } from "inversify";
import { ObjectId, type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { BookingDTO, BookingStatus, ListQuery, Paginated } from "@mahama/shared-types";
import { fromDoc, paginate, searchFilter, timestamps } from "./mongo.helpers.js";
import type { BookingRepository } from "../../domain/scheduling-ports.js";

@injectable()
export class MongoBookingRepository implements BookingRepository {
  constructor(@inject(TYPES.Mongo) private readonly db: Db) {}

  private get col() {
    return this.db.collection("bookings");
  }

  list(query: ListQuery & { status?: BookingStatus | string }): Promise<Paginated<BookingDTO>> {
    const filter = {
      ...(query.status ? { status: query.status } : {}),
      ...searchFilter(query.search, ["inviteeName", "inviteeEmail", "meetingTypeName"]),
    };
    return paginate<BookingDTO>(this.col, query, filter, { startsAt: -1 });
  }

  async findById(id: string): Promise<BookingDTO | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.col.findOne({ _id: new ObjectId(id) });
    return doc ? fromDoc<BookingDTO>(doc as never) : null;
  }

  async findActiveBetween(from: Date, to: Date): Promise<BookingDTO[]> {
    const docs = await this.col.find({
      status: { $in: ["pending", "confirmed"] },
      startsAt: { $lt: to.toISOString() },
      endsAt: { $gt: from.toISOString() },
    }).toArray();
    return docs.map((d) => fromDoc<BookingDTO>(d as never));
  }

  async findDueForReminder(window: "day" | "hour", now: Date): Promise<BookingDTO[]> {
    const minMs = window === "day" ? 23 * 60 * 60 * 1000 : 50 * 60 * 1000;
    const maxMs = window === "day" ? 25 * 60 * 60 * 1000 : 70 * 60 * 1000;
    const minDate = new Date(now.getTime() + minMs);
    const maxDate = new Date(now.getTime() + maxMs);
    const flagPath = window === "day" ? "reminderState.dayBefore" : "reminderState.hourBefore";
    const docs = await this.col.find({
      status: "confirmed",
      startsAt: { $gte: minDate.toISOString(), $lte: maxDate.toISOString() },
      [flagPath]: { $ne: true },
    }).toArray();
    return docs.map((d) => fromDoc<BookingDTO>(d as never));
  }

  async create(data: Omit<BookingDTO, "id" | "createdAt" | "updatedAt">): Promise<BookingDTO> {
    const ts = timestamps(true);
    const result = await this.col.insertOne({ ...data, ...ts } as never);
    return { id: result.insertedId.toHexString(), ...data, ...ts } as BookingDTO;
  }

  async update(id: string, data: Partial<BookingDTO>): Promise<BookingDTO | null> {
    if (!ObjectId.isValid(id)) return null;
    const { id: _ignore, createdAt: _c, ...rest } = data as BookingDTO & { id?: string; createdAt?: string };
    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...rest, ...timestamps(false) } },
      { returnDocument: "after" },
    );
    return result ? fromDoc<BookingDTO>(result as never) : null;
  }

  async markReminderSent(id: string, window: "day" | "hour"): Promise<void> {
    if (!ObjectId.isValid(id)) return;
    const flagPath = window === "day" ? "reminderState.dayBefore" : "reminderState.hourBefore";
    await this.col.updateOne({ _id: new ObjectId(id) }, { $set: { [flagPath]: true } });
  }
}
