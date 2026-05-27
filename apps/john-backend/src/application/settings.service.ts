import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import type { SiteSettingsDTO } from "@mahama/shared-types";
import type { SettingsRepository } from "../domain/ports.js";

@injectable()
export class SettingsService {
  constructor(@inject(TYPES.SettingsRepository) private readonly repo: SettingsRepository) {}

  async get(): Promise<SiteSettingsDTO> {
    const s = await this.repo.get();
    if (!s) return await this.repo.upsert({});
    return s;
  }

  update(data: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO> {
    return this.repo.upsert(data);
  }
}
