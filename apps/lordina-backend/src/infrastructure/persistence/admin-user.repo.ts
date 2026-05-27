import { injectable, inject } from "inversify";
import { ObjectId, type Db } from "mongodb";
import { TYPES } from "@mahama/backend-core";
import type { AdminUserDTO } from "@mahama/shared-types";
import { fromDoc, timestamps } from "./mongo.helpers.js";
import type { AdminUserRepository } from "../../domain/ports.js";

@injectable()
export class MongoAdminUserRepository implements AdminUserRepository {
  constructor(@inject(TYPES.Mongo) private readonly db: Db) {}

  private get col() {
    return this.db.collection("admin_users");
  }
  private get refresh() {
    return this.db.collection("refresh_tokens");
  }

  private toUser(doc: { _id: ObjectId; passwordHash: string; [k: string]: unknown }): AdminUserDTO & { passwordHash: string } {
    const user = fromDoc<AdminUserDTO>(doc as never);
    return { ...user, passwordHash: doc.passwordHash };
  }

  async findByEmail(email: string) {
    const doc = await this.col.findOne({ email: email.toLowerCase() });
    return doc ? this.toUser(doc as never) : null;
  }

  async findById(id: string): Promise<AdminUserDTO | null> {
    if (!ObjectId.isValid(id)) return null;
    const doc = await this.col.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    const { passwordHash: _omit, ...user } = doc as Record<string, unknown> & { _id: ObjectId };
    return fromDoc<AdminUserDTO>(user as never);
  }

  async list(): Promise<AdminUserDTO[]> {
    const docs = await this.col.find({}).project({ passwordHash: 0 }).sort({ createdAt: -1 }).toArray();
    return docs.map((d) => fromDoc<AdminUserDTO>(d as never));
  }

  async create(data: Omit<AdminUserDTO, "id" | "createdAt" | "updatedAt"> & { passwordHash: string }) {
    const ts = timestamps(true);
    const doc = { ...data, email: data.email.toLowerCase(), ...ts };
    const result = await this.col.insertOne(doc as never);
    const { passwordHash: _ignore, ...user } = doc;
    return { id: result.insertedId.toHexString(), ...user, ...ts } as AdminUserDTO;
  }

  async update(id: string, data: Partial<AdminUserDTO> & { passwordHash?: string }) {
    if (!ObjectId.isValid(id)) return null;
    const { id: _ignore, createdAt: _c, ...rest } = data as AdminUserDTO & { id?: string; createdAt?: string };
    const result = await this.col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...rest, ...timestamps(false) } },
      { returnDocument: "after", projection: { passwordHash: 0 } },
    );
    return result ? fromDoc<AdminUserDTO>(result as never) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const r = await this.col.deleteOne({ _id: new ObjectId(id) });
    return r.deletedCount === 1;
  }

  async saveRefreshToken(token: string, userId: string, expiresAt: Date) {
    await this.refresh.insertOne({ token, userId, expiresAt, createdAt: new Date() });
  }

  async consumeRefreshToken(token: string) {
    const result = await this.refresh.findOneAndDelete({ token, expiresAt: { $gt: new Date() } });
    if (!result) return null;
    return { userId: result.userId as string };
  }

  async recordLogin(userId: string) {
    if (!ObjectId.isValid(userId)) return;
    await this.col.updateOne({ _id: new ObjectId(userId) }, { $set: { lastLoginAt: new Date().toISOString() } });
  }
}
