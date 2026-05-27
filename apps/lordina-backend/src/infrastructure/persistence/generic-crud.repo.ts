import { ObjectId, type Db } from "mongodb";
import type { ListQuery, Paginated } from "@mahama/shared-types";
import { fromDoc, paginate, searchFilter, timestamps } from "./mongo.helpers.js";
import type { CrudRepository } from "../../domain/ports.js";

export abstract class GenericCrudRepository<T extends { id: string }> implements CrudRepository<T> {
  constructor(
    protected readonly db: Db,
    protected readonly collectionName: string,
    protected readonly searchFields: string[] = [],
    protected readonly defaultSort: Record<string, 1 | -1> = { createdAt: -1 },
  ) {}

  protected get col() {
    return this.db.collection(this.collectionName);
  }

  async list(query?: ListQuery): Promise<Paginated<T>> {
    const filter = searchFilter(query?.search, this.searchFields);
    return paginate<T>(this.col, query, filter, this.defaultSort);
  }

  async findAll(): Promise<T[]> {
    const docs = await this.col.find({}).sort(this.defaultSort).toArray();
    return docs.map((d) => fromDoc<T>(d as never));
  }

  async findById(id: string): Promise<T | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.col.findOne({ _id: new ObjectId(id) });
    return doc ? fromDoc<T>(doc as never) : null;
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const ts = timestamps(true);
    const result = await this.col.insertOne({ ...data, ...ts } as never);
    return { id: result.insertedId.toHexString(), ...data, ...ts } as unknown as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!ObjectId.isValid(id)) return null;
    const { id: _ignore, createdAt: _c, ...rest } = data as T & { id?: string; createdAt?: string };
    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...rest, ...timestamps(false) } },
      { returnDocument: "after" },
    );
    return result ? fromDoc<T>(result as never) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await this.col.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}
