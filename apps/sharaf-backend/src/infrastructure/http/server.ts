import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import type { Container } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { Db } from "mongodb";
import { errorHandler } from "./middleware/error.js";
import { requireAuth, requireRole } from "./middleware/auth.js";
import { metricsCollector, getMetrics } from "./middleware/metrics-collector.js";
import { wireRoutes } from "./routes.js";

export async function startServer(container: Container, env: BackendEnv, logger: Logger) {
  const app: Express = express();
  const db = container.get<Db>(TYPES.Mongo);

  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  }));
  app.use(compression());
  app.use(express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      (req as unknown as { rawBody: string }).rawBody = buf.toString("utf8");
    },
  }));
  const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return cb(null, true);
        return cb(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: false,
    }),
  );

  const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
  const bookingLimiter = rateLimit({
    windowMs: 60_000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
  app.use("/api/public/booking", bookingLimiter);
  app.use("/api/", generalLimiter);

  app.use((_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });

  app.get("/health", async (_req, res) => {
    let mongodb: "ok" | "error" = "ok";
    try {
      await db.admin().ping();
    } catch {
      mongodb = "error";
    }
    const email = env.RESEND_API_KEY ? "ok" : "not_configured";
    const status = mongodb === "ok" ? "ok" : "degraded";
    res.json({ status, subject: env.SUBJECT, timestamp: new Date().toISOString(), checks: { mongodb, email } });
  });

  app.get("/rss.xml", (_req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    next();
  });
  app.get("/sitemap.xml", (_req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    next();
  });

  app.get("/metrics", async (_req, res) => {
    const metrics = getMetrics();
    const [bookings, messages, subscribers] = await Promise.all([
      db.collection("bookings").estimatedDocumentCount(),
      db.collection("messages").estimatedDocumentCount(),
      db.collection("subscribers").estimatedDocumentCount(),
    ]);
    res.json({
      ...metrics,
      bookings,
      messages,
      subscribers,
    });
  });

  app.use(metricsCollector(logger));

  wireRoutes(app, container, env, { requireAuth, requireRole });

  app.use(errorHandler(logger));

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening`, { port: env.PORT, subject: env.SUBJECT });
  });

  return {
    async shutdown() {
      logger.info("shutting down server");
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      await db.client.close();
      logger.info("shutdown complete");
    },
  };
}
