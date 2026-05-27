import type { ListQuery, Paginated } from "@mahama/shared-types";
import { NotFoundError } from "@mahama/backend-core";
import type { CrudRepository } from "../domain/ports.js";

export class CrudService<T extends { id: string }> {
  constructor(private readonly repo: CrudRepository<T>, private readonly entity: string) {}

  list(query?: ListQuery): Promise<Paginated<T>> {
    return this.repo.list(query);
  }

  findAll(): Promise<T[]> {
    return this.repo.findAll();
  }

  async get(id: string): Promise<T> {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundError(this.entity, id);
    return item;
  }

  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    return this.repo.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const item = await this.repo.update(id, data);
    if (!item) throw new NotFoundError(this.entity, id);
    return item;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundError(this.entity, id);
  }
}
