import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { NewsletterSubscriberDTO } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import { fromDoc } from "./mongo.helpers.js";
import type { SubscriberRepository } from "../../domain/ports.js";

@injectable()
export class MongoSubscriberRepository extends GenericCrudRepository<NewsletterSubscriberDTO> implements SubscriberRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "subscribers", ["email", "name"], { createdAt: -1 });
  }

  async findByEmail(email: string): Promise<NewsletterSubscriberDTO | null> {
    const doc = await this.col.findOne({ email: email.toLowerCase() });
    return doc ? fromDoc<NewsletterSubscriberDTO>(doc as never) : null;
  }

  async listConfirmed(): Promise<NewsletterSubscriberDTO[]> {
    const docs = await this.col.find({ confirmed: true, unsubscribed: { $ne: true } }).toArray();
    return docs.map((d) => fromDoc<NewsletterSubscriberDTO>(d as never));
  }
}
