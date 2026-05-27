import { injectable, inject } from "inversify";
import { type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { ListQuery, NewsPostDTO, Paginated } from "@mahama/shared-types";
import { GenericCrudRepository } from "./generic-crud.repo.js";
import { fromDoc, paginate, searchFilter } from "./mongo.helpers.js";
import type { NewsRepository } from "../../domain/ports.js";

@injectable()
export class MongoNewsRepository extends GenericCrudRepository<NewsPostDTO> implements NewsRepository {
  constructor(@inject(TYPES.Mongo) db: Db) {
    super(db, "news", ["title.en", "excerpt.en", "tags"], { publishedAt: -1, createdAt: -1 });
  }

  async findBySlug(slug: string): Promise<NewsPostDTO | null> {
    const doc = await this.col.findOne({ slug, published: true });
    return doc ? fromDoc<NewsPostDTO>(doc as never) : null;
  }

  async listPublished(query?: ListQuery): Promise<Paginated<NewsPostDTO>> {
    const filter = { published: true, ...searchFilter(query?.search, ["title.en", "excerpt.en", "tags"]) };
    return paginate<NewsPostDTO>(this.col, query, filter, { publishedAt: -1 });
  }
}
