import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { QuoteDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { QuoteRepository } from "../../domain/ports.js";

@injectable()
export class MongoQuoteRepository extends GenericCrudRepository<QuoteDTO> implements QuoteRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "quotes", ["text", "context"], { order: 1 });
  }
}
