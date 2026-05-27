import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { z } from "zod";
import { TYPES, UnauthorizedError } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { AuthService } from "../application/auth.service.js";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const refreshSchema = z.object({ refreshToken: z.string().min(20) });

@injectable()
export class AuthController {
  constructor(@inject(TYPES.AuthService) private readonly auth: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      ok(res, await this.auth.login(email, password));
    } catch (e) { next(e); }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      ok(res, await this.auth.refresh(refreshToken));
    } catch (e) { next(e); }
  };

  logout = async (_req: Request, res: Response) => {
    ok(res, { ok: true });
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) throw new UnauthorizedError();
      ok(res, await this.auth.me(req.auth.sub));
    } catch (e) { next(e); }
  };
}
