import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import { resolveLocalized } from "@mahama/shared-types";
import type { NewsRepository, EventRepository } from "../domain/ports.js";

import type { ProfileRepository } from "../domain/ports.js";

@injectable()
export class SitemapController {
  constructor(
    @inject(TYPES.NewsRepository) private readonly news: NewsRepository,
    @inject(TYPES.EventRepository) private readonly events: EventRepository,
    @inject(TYPES.ProfileRepository) private readonly profile: ProfileRepository,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  rss = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const host = this.publicSiteHost();
      const profile = await this.profile.get();
      const news = await this.news.listPublished({ pageSize: 50 });
      const items = news.items
        .map((p) => `
    <item>
      <title>${escapeXml(resolveLocalized(p.title))}</title>
      <link>${host}/news/${p.slug}</link>
      <guid>${host}/news/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(resolveLocalized(p.excerpt))}</description>
    </item>`)
        .join("");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(resolveLocalized(profile?.fullName) || this.env.SUBJECT)} — News</title>
    <link>${host}</link>
    <description>${escapeXml(resolveLocalized(profile?.tagline))}</description>
    <language>en-gh</language>${items}
  </channel>
</rss>`;
      res.type("application/rss+xml").send(xml);
    } catch (e) {
      next(e);
    }
  };

  robots = (_req: Request, res: Response) => {
    const lines = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/admin/",
      "Disallow: /api/auth/",
      `Sitemap: ${this.publicHost()}/sitemap.xml`,
    ];
    res.type("text/plain").send(lines.join("\n"));
  };

  sitemap = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const host = this.publicSiteHost();
      const staticUrls = ["/", "/about", "/timeline", "/ventures", "/impact", "/news", "/events", "/contact", "/book"];
      const urls: Array<{ loc: string; priority: number; changefreq: string; lastmod?: string }> = staticUrls.map((p) => ({ loc: `${host}${p}`, priority: p === "/" ? 1.0 : 0.7, changefreq: "weekly" }));

      const news = await this.news.listPublished({ pageSize: 200 });
      news.items.forEach((n) =>
        urls.push({ loc: `${host}/news/${n.slug}`, priority: 0.6, changefreq: "monthly", lastmod: (n.updatedAt ?? n.publishedAt ?? n.createdAt).slice(0, 10) }),
      );
      const events = await this.events.findAll();
      if (events.length > 0) {
        const latestEvent = events.reduce((a, b) => (a.updatedAt ?? a.startsAt) > (b.updatedAt ?? b.startsAt) ? a : b);
        urls.push({ loc: `${host}/events`, priority: 0.5, changefreq: "weekly", lastmod: (latestEvent.updatedAt ?? latestEvent.startsAt).slice(0, 10) });
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "";
          return `  <url><loc>${escapeXml(u.loc)}</loc>${lastmod}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
        }),
        "</urlset>",
      ].join("\n");
      res.type("application/xml").send(xml);
    } catch (e) {
      next(e);
    }
  };

  private publicHost(): string {
    return this.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  private publicSiteHost(): string {
    // The website URL is typically the first allowed origin
    const first = this.env.ALLOWED_ORIGINS.split(",")[0]?.trim();
    return (first ?? this.publicHost()).replace(/\/$/, "");
  }
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!));
}
