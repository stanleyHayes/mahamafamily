import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { SiteSettingsDTO } from "@mahama/shared-types";
import { fromDoc, timestamps } from "./mongo.helpers.js";
import type { SettingsRepository } from "../../domain/ports.js";

@injectable()
export class MongoSettingsRepository implements SettingsRepository {
  constructor(
    @inject(TYPES.Mongo) private readonly db: Db,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  private get col() {
    return this.db.collection("settings");
  }

  async get(): Promise<SiteSettingsDTO | null> {
    const doc = await this.col.findOne({ subject: this.env.SUBJECT });
    return doc ? fromDoc<SiteSettingsDTO>(doc as never) : null;
  }

  async upsert(data: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO> {
    const now = new Date().toISOString();
    const result = await this.col.findOneAndUpdate(
      { subject: this.env.SUBJECT },
      {
        $set: { ...data, subject: this.env.SUBJECT, ...timestamps(false) },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" },
    );
    return fromDoc<SiteSettingsDTO>(result as never);
  }
}
