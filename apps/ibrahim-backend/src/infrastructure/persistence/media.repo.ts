import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { MediaAssetDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import { fromDoc } from "./mongo.helpers.js";
import type { MediaRepository } from "../../domain/ports.js";

@injectable()
export class MongoMediaRepository extends GenericCrudRepository<MediaAssetDTO> implements MediaRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "media", ["alt", "caption", "tags"], { createdAt: -1 });
  }

  async findByPublicId(publicId: string): Promise<MediaAssetDTO | null> {
    const doc = await this.col.findOne({ publicId });
    return doc ? fromDoc<MediaAssetDTO>(doc as never) : null;
  }
}
