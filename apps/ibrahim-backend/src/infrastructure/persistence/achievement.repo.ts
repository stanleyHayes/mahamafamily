import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { AchievementDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { AchievementRepository } from "../../domain/ports.js";

@injectable()
export class MongoAchievementRepository extends GenericCrudRepository<AchievementDTO> implements AchievementRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "achievements", ["title", "description", "awarder"], { year: -1 });
  }
}
