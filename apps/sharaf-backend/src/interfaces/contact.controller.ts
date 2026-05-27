import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { TYPES } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { MessageService } from "../application/message.service.js";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  subject: z.string().min(2).max(200),
  body: z.string().min(10).max(8000),
  category: z.enum(["press", "philanthropy", "business", "general", "speaking", "fan"]).default("general"),
  // honeypot — bots fill all fields; real users won't see this one
  website: z.string().max(0).optional(),
});

@injectable()
export class ContactController {
  constructor(@inject(TYPES.MessageService) private readonly svc: MessageService) {}

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body);
      const { website: _hp, ...payload } = data;
      const created = await this.svc.submit({
        ...payload,
        ipAddress: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      });
      ok(res, { id: created.id }, 201);
    } catch (e) { next(e); }
  };
}
