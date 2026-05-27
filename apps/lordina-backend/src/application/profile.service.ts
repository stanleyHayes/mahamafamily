import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import type { ProfileDTO } from "@mahama/shared-types";
import type { ProfileRepository } from "../domain/ports.js";

@injectable()
export class ProfileService {
  constructor(@inject(TYPES.ProfileRepository) private readonly repo: ProfileRepository) {}

  get(): Promise<ProfileDTO | null> {
    return this.repo.get();
  }

  update(data: Partial<ProfileDTO>): Promise<ProfileDTO> {
    return this.repo.upsert(data);
  }
}
