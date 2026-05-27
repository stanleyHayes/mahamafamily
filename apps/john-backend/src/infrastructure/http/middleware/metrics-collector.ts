import type { Request, Response, NextFunction } from "express";
import type { Logger } from "@mahama/backend-core";

interface MetricsSnapshot {
  requestsByStatus: Record<string, number>;
  averageResponseTimeMs: number;
  totalRequests: number;
}

const state = {
  requestsByStatus: {} as Record<string, number>,
  totalDuration: 0,
  requestCount: 0,
};

export function metricsCollector(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/health") {
      return next();
    }
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = String(res.statusCode);
      state.requestsByStatus[status] = (state.requestsByStatus[status] || 0) + 1;
      state.totalDuration += duration;
      state.requestCount++;
      logger.info("request", {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
        userAgent: req.get("user-agent"),
      });
    });
    next();
  };
}

export function getMetrics(): MetricsSnapshot {
  return {
    requestsByStatus: { ...state.requestsByStatus },
    averageResponseTimeMs:
      state.requestCount > 0
        ? Math.round(state.totalDuration / state.requestCount)
        : 0,
    totalRequests: state.requestCount,
  };
}
