import type { Response } from "express";

export function ok<T>(res: Response, data: T, status = 200, cacheMaxAge?: number) {
  if (cacheMaxAge != null && cacheMaxAge > 0) {
    res.setHeader("Cache-Control", `public, max-age=${cacheMaxAge}, stale-while-revalidate=${cacheMaxAge * 5}`);
  }
  res.status(status).json({ ok: true, data });
}
