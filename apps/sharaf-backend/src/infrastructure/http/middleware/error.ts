import type { ErrorRequestHandler } from "express";
import { DomainError, type Logger } from "@mahama/backend-core";
import { ZodError } from "zod";

export function errorHandler(logger: Logger): ErrorRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, _req, res, _next) => {
    if (res.headersSent) return;

    if (err instanceof ZodError) {
      res.status(422).json({
        ok: false,
        error: { code: "VALIDATION_FAILED", message: "Invalid input", details: err.flatten() },
      });
      return;
    }
    if (err instanceof DomainError) {
      res.status(err.status).json({
        ok: false,
        error: { code: err.code, message: err.message },
      });
      return;
    }

    logger.error("unhandled error", { error: (err as Error)?.message, stack: (err as Error)?.stack });
    res.status(500).json({
      ok: false,
      error: { code: "INTERNAL", message: "Something went wrong" },
    });
  };
}
