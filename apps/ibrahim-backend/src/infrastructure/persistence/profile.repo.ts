import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { ProfileDTO } from "@mahama/shared-types";
import type { ProfileRepository } from "../../domain/ports.js";
import { fromDoc, timestamps } from "./mongo.helpers.js";

@injectable()
export class MongoProfileRepository implements ProfileRepository {
  constructor(
    @inject(TYPES.Mongo) private readonly db: Db,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  private get col() {
    return this.db.collection("profile");
  }

  async get(): Promise<ProfileDTO | null> {
    const doc = await this.col.findOne({ subject: this.env.SUBJECT });
    return doc ? fromDoc<ProfileDTO>(doc as never) : null;
  }

  async upsert(data: Partial<ProfileDTO>): Promise<ProfileDTO> {
    const now = new Date().toISOString();
    const result = await this.col.findOneAndUpdate(
      { subject: this.env.SUBJECT },
      {
        $set: { ...data, ...timestamps(false) },
        $setOnInsert: { subject: this.env.SUBJECT, createdAt: now },
      },
      { upsert: true, returnDocument: "after" },
    );
    return fromDoc<ProfileDTO>(result as never);
  }
}
