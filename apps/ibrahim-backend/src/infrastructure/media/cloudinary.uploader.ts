import { injectable, inject } from "inversify";
import type { v2 as Cloudinary } from "cloudinary";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { MediaUploader } from "../../domain/ports.js";

@injectable()
export class CloudinaryUploader implements MediaUploader {
  constructor(
    @inject(TYPES.Cloudinary) private readonly cl: typeof Cloudinary,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  signUpload(folder: string) {
    if (!this.env.CLOUDINARY_API_KEY || !this.env.CLOUDINARY_API_SECRET || !this.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary not configured");
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = this.cl.utils.api_sign_request(
      { folder, timestamp },
      this.env.CLOUDINARY_API_SECRET,
    );
    return {
      signature,
      timestamp,
      apiKey: this.env.CLOUDINARY_API_KEY,
      cloudName: this.env.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }

  async destroy(publicId: string): Promise<void> {
    if (!this.env.CLOUDINARY_API_KEY) return;
    await this.cl.uploader.destroy(publicId);
  }
}
