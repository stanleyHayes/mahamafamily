import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";

export interface EmailEvent {
  type: string;
  to: string;
  emailId?: string;
  subject?: string;
  payload: unknown;
  receivedAt: Date;
}

@injectable()
export class EmailEventRepository {
  constructor(@inject(TYPES.Mongo) private readonly db: Db) {}

  private get col() {
    return this.db.collection("email_events");
  }

  async record(event: EmailEvent): Promise<void> {
    await this.col.insertOne(event);
  }

  async list(limit = 200): Promise<EmailEvent[]> {
    const docs = await this.col.find({}).sort({ receivedAt: -1 }).limit(limit).toArray();
    return docs.map((d) => ({
      type: d.type as string,
      to: d.to as string,
      emailId: d.emailId as string | undefined,
      subject: d.subject as string | undefined,
      payload: d.payload,
      receivedAt: d.receivedAt as Date,
    }));
  }

  async countByType(): Promise<Record<string, number>> {
    const result = await this.col.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]).toArray();
    const out: Record<string, number> = {};
    result.forEach((r) => { out[r._id as string] = r.count as number; });
    return out;
  }
}
