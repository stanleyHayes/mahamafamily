import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { EventDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { EventRepository } from "../../domain/ports.js";

@injectable()
export class MongoEventRepository extends GenericCrudRepository<EventDTO> implements EventRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "events", ["title.en", "description.en", "venue.en", "city.en"], { startsAt: -1 });
  }
}
