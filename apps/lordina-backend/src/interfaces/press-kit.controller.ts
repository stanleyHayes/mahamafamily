import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { ProfileRepository, MediaRepository } from "../domain/ports.js";

@injectable()
export class PressKitController {
  constructor(
    @inject(TYPES.ProfileRepository) private readonly profile: ProfileRepository,
    @inject(TYPES.MediaRepository) private readonly media: MediaRepository,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  /**
   * Press kit: one JSON document with bio + links to media.
   * (We avoid bundling a real ZIP so this stays dependency-free; the bundle URL list
   * lets a journalist or PR shop pull each asset directly from Cloudinary.)
   */
  download = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await this.profile.get();
      const media = await this.media.findAll();
      const kit = {
        subject: this.env.SUBJECT,
        generatedAt: new Date().toISOString(),
        profile: profile && {
          fullName: profile.fullName,
          title: profile.title,
          tagline: profile.tagline,
          bio: profile.bio,
          birthDate: profile.birthDate,
          birthPlace: profile.birthPlace,
          hometown: profile.hometown,
          religion: profile.religion,
          spouse: profile.spouse,
          socials: profile.socials,
        },
        photographs: media.filter((m) => m.resourceType === "image").map((m) => ({
          url: m.secureUrl,
          credit: m.credit,
          alt: m.alt,
          width: m.width,
          height: m.height,
        })),
        contact: {
          inbox: this.env.CONTACT_INBOX,
          host: this.env.PUBLIC_BASE_URL,
        },
      };
      res
        .setHeader("Content-Disposition", `attachment; filename="${this.env.SUBJECT}-press-kit.json"`)
        .type("application/json")
        .send(JSON.stringify(kit, null, 2));
    } catch (e) {
      next(e);
    }
  };
}
