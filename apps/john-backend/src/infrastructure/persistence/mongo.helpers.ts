import { ObjectId, type Collection, type Document, type Filter, type Sort } from "mongodb";
import type { ListQuery, Paginated } from "@mahama/shared-types";

export function toId(id: string): ObjectId {
  return ObjectId.isValid(id) ? new ObjectId(id) : new ObjectId();
}

export function fromDoc<T>(doc: Document & { _id: ObjectId }): T {
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as T;
}

export async function paginate<T extends { id: string }>(
  col: Collection<Document>,
  q: ListQuery | undefined,
  filter: Filter<Document> = {},
  defaultSort: Sort = { createdAt: -1 },
): Promise<Paginated<T>> {
  const page = Math.max(1, q?.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, q?.pageSize ?? 20));
  const sort: Sort = q?.sortBy ? { [q.sortBy]: q?.sortDir === "asc" ? 1 : -1 } : defaultSort;

  const cursor = col.find(filter).sort(sort).skip((page - 1) * pageSize).limit(pageSize);
  const [items, total] = await Promise.all([cursor.toArray(), col.countDocuments(filter)]);
  return {
    items: items.map((d) => fromDoc<T>(d as Document & { _id: ObjectId })),
    total,
    page,
    pageSize,
  };
}

export function searchFilter(search: string | undefined, fields: string[]): Filter<Document> {
  if (!search) return {};
  const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(safe, "i");
  const conditions: Filter<Document>[] = [];
  for (const f of fields) {
    conditions.push({ [f]: re });
    // Also search the root field for backward compatibility with plain-string data
    if (f.includes(".")) {
      const root = f.split(".")[0]!;
      conditions.push({ [root]: re });
    }
  }
  return { $or: conditions };
}

export function timestamps(create = false) {
  const now = new Date().toISOString();
  return create ? { createdAt: now, updatedAt: now } : { updatedAt: now };
}
