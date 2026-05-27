import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { MediaService } from "../application/media.service.js";

@injectable()
export class MediaController {
  constructor(@inject(TYPES.MediaService) private readonly svc: MediaService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, await this.svc.list({
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        search: req.query.search as string | undefined,
      }));
    } catch (e) { next(e); }
  };

  sign = async (_req: Request, res: Response, next: NextFunction) => {
    try { ok(res, this.svc.signUpload()); } catch (e) { next(e); }
  };

  record = async (req: Request, res: Response, next: NextFunction) => {
    try { ok(res, await this.svc.record(req.body), 201); } catch (e) { next(e); }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try { await this.svc.remove(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
  };
}
