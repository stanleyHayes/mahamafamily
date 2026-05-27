import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";

export interface AuditEntry {
  actorId?: string;
  actorEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip?: string;
  meta?: Record<string, unknown>;
  ts: Date;
}

@injectable()
export class AuditLogRepository {
  constructor(@inject(TYPES.Mongo) private readonly db: Db) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.db.collection("audit_log").insertOne(entry);
  }

  async list(limit = 100): Promise<AuditEntry[]> {
    const docs = await this.db.collection("audit_log").find({}).sort({ ts: -1 }).limit(limit).toArray();
    return docs.map((d) => ({
      actorId: d.actorId as string | undefined,
      actorEmail: d.actorEmail as string | undefined,
      action: d.action as string,
      resource: d.resource as string,
      resourceId: d.resourceId as string | undefined,
      ip: d.ip as string | undefined,
      meta: d.meta as Record<string, unknown> | undefined,
      ts: d.ts as Date,
    }));
  }
}
