import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { VentureDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { VentureRepository } from "../../domain/ports.js";

@injectable()
export class MongoVentureRepository extends GenericCrudRepository<VentureDTO> implements VentureRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "ventures", ["name", "sector", "summary"], { order: 1 });
  }
}
