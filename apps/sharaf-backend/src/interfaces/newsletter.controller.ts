import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { TYPES } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { SubscriberService } from "../application/subscriber.service.js";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  source: z.string().max(80).optional(),
});

@injectable()
export class NewsletterController {
  constructor(@inject(TYPES.SubscriberService) private readonly svc: SubscriberService) {}

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      const created = await this.svc.subscribe(data);
      ok(res, { id: created.id }, 201);
    } catch (e) { next(e); }
  };
}
