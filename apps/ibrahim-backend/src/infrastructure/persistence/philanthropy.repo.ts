import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { PhilanthropyDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { PhilanthropyRepository } from "../../domain/ports.js";

@injectable()
export class MongoPhilanthropyRepository extends GenericCrudRepository<PhilanthropyDTO> implements PhilanthropyRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "philanthropy", ["title", "summary", "beneficiary"], { order: 1, year: -1 });
  }
}
