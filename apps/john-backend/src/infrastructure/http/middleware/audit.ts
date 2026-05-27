import type { Request, Response, NextFunction } from "express";
import type { Container } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { AuditLogRepository } from "../../persistence/audit-log.repo.js";

const ACTION_BY_METHOD: Record<string, string> = {
  POST: "create",
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
};

export function auditMiddleware(container: Container) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api/admin/")) return next();
    const action = ACTION_BY_METHOD[req.method];
    if (!action) return next();
    if (!req.auth) return next();

    const logger = container.get<Logger>(TYPES.Logger);
    const repo = container.get<AuditLogRepository>(TYPES.AuditLogRepository);
    const resource = req.path.replace("/api/admin/", "").split("/")[0] ?? "unknown";
    const idMatch = req.path.match(/\/api\/admin\/[^/]+\/([^/]+)/);

    repo.record({
      actorId: req.auth.sub,
      actorEmail: req.auth.email,
      action,
      resource,
      resourceId: idMatch?.[1],
      ip: req.ip,
      meta: { method: req.method, path: req.path },
      ts: new Date(),
    }).catch((e) => logger.warn("audit log failed", { error: (e as Error).message }));

    next();
  };
}
