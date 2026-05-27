import type { Request, Response, NextFunction } from "express";
import { verifyJwt, JwtError } from "@mahama/jwt-utils";
import { ForbiddenError, UnauthorizedError } from "@mahama/backend-core";
import type { AdminRole, JwtPayload } from "@mahama/shared-types";
import type { BackendEnv } from "@mahama/config";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function requireAuth(env: BackendEnv) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return next(new UnauthorizedError("Missing token"));
    const token = header.slice(7);
    try {
      const payload = verifyJwt(token, {
        secret: env.JWT_SECRET,
        issuer: env.JWT_ISSUER,
      });
      req.auth = payload as unknown as JwtPayload;
      next();
    } catch (e) {
      if (e instanceof JwtError) return next(new UnauthorizedError(e.message));
      next(e);
    }
  };
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new UnauthorizedError());
    if (!roles.includes(req.auth.role)) return next(new ForbiddenError());
    next();
  };
}
