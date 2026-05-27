import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { TYPES } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { AiService } from "../application/ai.service.js";
import type { BackendEnv } from "@mahama/config";

const askSchema = z.object({ question: z.string().min(3).max(500) });
const draftSchema = z.object({ notes: z.string().min(10).max(3000) });
const polishSchema = z.object({ text: z.string().min(3).max(5000), tone: z.string().default("dignified") });
const summarizeSchema = z.object({ text: z.string().min(20).max(8000) });

@injectable()
export class AiController {
  constructor(
    @inject(TYPES.AiService) private readonly ai: AiService,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  ask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question } = askSchema.parse(req.body);
      ok(res, { answer: await this.ai.ask(question) });
    } catch (e) { next(e); }
  };

  draftBio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notes } = draftSchema.parse(req.body);
      ok(res, { text: await this.ai.draftBio(notes, this.env.SUBJECT) });
    } catch (e) { next(e); }
  };

  polish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, tone } = polishSchema.parse(req.body);
      ok(res, { text: await this.ai.polish(text, tone) });
    } catch (e) { next(e); }
  };

  summarize = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = summarizeSchema.parse(req.body);
      ok(res, { text: await this.ai.summarize(text) });
    } catch (e) { next(e); }
  };
}
