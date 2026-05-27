import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { TimelineEntryDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { TimelineRepository } from "../../domain/ports.js";

@injectable()
export class MongoTimelineRepository extends GenericCrudRepository<TimelineEntryDTO> implements TimelineRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "timeline", ["title", "description", "year"], { order: 1, date: 1 });
  }
}
