import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { MessageDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import type { MessageRepository } from "../../domain/ports.js";

@injectable()
export class MongoMessageRepository extends GenericCrudRepository<MessageDTO> implements MessageRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "messages", ["name", "email", "subject", "body"], { createdAt: -1 });
  }
}
