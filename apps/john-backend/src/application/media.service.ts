import { injectable, inject } from "inversify";
import { TYPES, NotFoundError } from "@mahama/backend-core";
import type { ListQuery, MediaAssetDTO, Paginated } from "@mahama/shared-types";
import type { BackendEnv } from "@mahama/config";
import type { MediaRepository, MediaUploader } from "../domain/ports.js";

@injectable()
export class MediaService {
  constructor(
    @inject(TYPES.MediaRepository) private readonly repo: MediaRepository,
    @inject(TYPES.MediaUploader) private readonly uploader: MediaUploader,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  signUpload() {
    return this.uploader.signUpload(`mahama/${this.env.SUBJECT}`);
  }

  list(q?: ListQuery): Promise<Paginated<MediaAssetDTO>> {
    return this.repo.list(q);
  }

  record(data: Partial<MediaAssetDTO>): Promise<MediaAssetDTO> {
    return this.repo.create({
      publicId: data.publicId!,
      url: data.url!,
      secureUrl: data.secureUrl ?? data.url!,
      resourceType: data.resourceType ?? "image",
      format: data.format ?? "jpg",
      width: data.width,
      height: data.height,
      bytes: data.bytes ?? 0,
      alt: data.alt ?? "",
      caption: data.caption,
      credit: data.credit,
      tags: data.tags ?? [],
    } as Omit<MediaAssetDTO, "id" | "createdAt" | "updatedAt">);
  }

  async remove(id: string): Promise<void> {
    const m = await this.repo.findById(id);
    if (!m) throw new NotFoundError("Media", id);
    try {
      await this.uploader.destroy(m.publicId);
    } catch {
      // continue
    }
    await this.repo.delete(id);
  }
}
