import type { Express, Request, Response, NextFunction } from "express";
import type { Container } from "inversify";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { AdminRole } from "@mahama/shared-types";
import { PublicController } from "../../interfaces/public.controller.js";
import { AdminController } from "../../interfaces/admin.controller.js";
import { AuthController } from "../../interfaces/auth.controller.js";
import { AiController } from "../../interfaces/ai.controller.js";
import { MediaController } from "../../interfaces/media.controller.js";
import { ContactController } from "../../interfaces/contact.controller.js";
import { NewsletterController } from "../../interfaces/newsletter.controller.js";
import { BookingController } from "../../interfaces/booking.controller.js";
import { SitemapController } from "../../interfaces/sitemap.controller.js";
import { PressKitController } from "../../interfaces/press-kit.controller.js";
import { WebhookController } from "../../interfaces/webhook.controller.js";
import { auditMiddleware } from "./middleware/audit.js";
import type { AuditLogRepository } from "../persistence/audit-log.repo.js";
import type { EmailEventRepository } from "../persistence/email-event.repo.js";

interface MiddlewareFactory {
  requireAuth: (env: BackendEnv) => (req: Request, res: Response, next: NextFunction) => void;
  requireRole: (...roles: AdminRole[]) => (req: Request, res: Response, next: NextFunction) => void;
}

export function wireRoutes(app: Express, container: Container, env: BackendEnv, mw: MiddlewareFactory) {
  const auth = mw.requireAuth(env);
  const editorOrOwner = mw.requireRole("editor", "owner");
  const ownerOnly = mw.requireRole("owner");

  const pub = container.get<PublicController>(TYPES.PublicController);
  const admin = container.get<AdminController>(TYPES.AdminController);
  const authCtl = container.get<AuthController>(TYPES.AuthController);
  const aiCtl = container.get<AiController>(TYPES.AiController);
  const media = container.get<MediaController>(TYPES.MediaController);
  const contact = container.get<ContactController>(TYPES.ContactController);
  const newsletter = container.get<NewsletterController>(TYPES.NewsletterController);
  const booking = container.get<BookingController>(TYPES.BookingController);
  const sitemap = container.get<SitemapController>(TYPES.SitemapController);
  const pressKit = container.get<PressKitController>(TYPES.PressKitController);
  const webhooks = container.get<WebhookController>(TYPES.WebhookController);

  // Webhooks (no rate limit, no audit)
  app.post("/api/webhooks/resend", webhooks.resend);

  // SEO
  app.get("/sitemap.xml", sitemap.sitemap);
  app.get("/robots.txt", sitemap.robots);
  app.get("/rss.xml", sitemap.rss);
  // Press kit
  app.get("/api/public/press-kit.json", pressKit.download);

  // Audit middleware on all admin mutations
  app.use(auditMiddleware(container));

  // Public
  app.get("/api/public/profile", pub.getProfile);
  app.get("/api/public/timeline", pub.listTimeline);
  app.get("/api/public/ventures", pub.listVentures);
  app.get("/api/public/philanthropy", pub.listPhilanthropy);
  app.get("/api/public/achievements", pub.listAchievements);
  app.get("/api/public/quotes", pub.listQuotes);
  app.get("/api/public/news", pub.listNews);
  app.get("/api/public/news/:slug", pub.getNewsBySlug);
  app.get("/api/public/events", pub.listEvents);
  app.get("/api/public/settings", pub.getSettings);
  app.post("/api/public/messages", contact.submit);
  app.post("/api/public/newsletter", newsletter.subscribe);
  app.post("/api/public/ai/ask", aiCtl.ask);

  // Booking — public
  app.get("/api/public/booking/meeting-types", booking.listMeetingTypes);
  app.get("/api/public/booking/meeting-types/:slug", booking.getMeetingType);
  app.get("/api/public/booking/slots", booking.listSlots);
  app.post("/api/public/booking", booking.create);
  app.post("/api/public/booking/:id/cancel", booking.cancel);
  app.get("/api/public/booking/:id/cancel", booking.cancel);
  app.post("/api/public/booking/:id/reschedule", booking.reschedule);

  // Auth
  app.post("/api/auth/login", authCtl.login);
  app.post("/api/auth/refresh", authCtl.refresh);
  app.post("/api/auth/logout", authCtl.logout);
  app.get("/api/auth/me", auth, authCtl.me);

  // Admin (auth + editor)
  app.get("/api/admin/profile", auth, editorOrOwner, admin.profile.get);
  app.put("/api/admin/profile", auth, editorOrOwner, admin.profile.update);

  for (const r of ["timeline", "ventures", "philanthropy", "achievements", "quotes", "news", "events"] as const) {
    app.get(`/api/admin/${r}`, auth, editorOrOwner, admin[r].list);
    app.get(`/api/admin/${r}/:id`, auth, editorOrOwner, admin[r].get);
    app.post(`/api/admin/${r}`, auth, editorOrOwner, admin[r].create);
    app.put(`/api/admin/${r}/:id`, auth, editorOrOwner, admin[r].update);
    app.delete(`/api/admin/${r}/:id`, auth, editorOrOwner, admin[r].remove);
  }

  // Media
  app.get("/api/admin/media", auth, editorOrOwner, media.list);
  app.post("/api/admin/media/sign", auth, editorOrOwner, media.sign);
  app.post("/api/admin/media", auth, editorOrOwner, media.record);
  app.delete("/api/admin/media/:id", auth, editorOrOwner, media.remove);

  // Messages
  app.get("/api/admin/messages", auth, editorOrOwner, admin.messages.list);
  app.get("/api/admin/messages/:id", auth, editorOrOwner, admin.messages.get);
  app.patch("/api/admin/messages/:id", auth, editorOrOwner, admin.messages.update);
  app.delete("/api/admin/messages/:id", auth, editorOrOwner, admin.messages.remove);
  app.post("/api/admin/messages/:id/reply", auth, editorOrOwner, admin.messages.reply);

  // Subscribers
  app.get("/api/admin/subscribers", auth, editorOrOwner, admin.subscribers.list);
  app.delete("/api/admin/subscribers/:id", auth, editorOrOwner, admin.subscribers.remove);
  app.post("/api/admin/subscribers/broadcast", auth, ownerOnly, admin.subscribers.broadcast);

  // Settings
  app.get("/api/admin/settings", auth, editorOrOwner, admin.settings.get);
  app.put("/api/admin/settings", auth, ownerOnly, admin.settings.update);

  // Users (owner only)
  app.get("/api/admin/users", auth, ownerOnly, admin.users.list);
  app.post("/api/admin/users", auth, ownerOnly, admin.users.create);
  app.put("/api/admin/users/:id", auth, ownerOnly, admin.users.update);
  app.delete("/api/admin/users/:id", auth, ownerOnly, admin.users.remove);

  // AI admin
  app.post("/api/admin/ai/draft-bio", auth, editorOrOwner, aiCtl.draftBio);
  app.post("/api/admin/ai/polish", auth, editorOrOwner, aiCtl.polish);
  app.post("/api/admin/ai/summarize", auth, editorOrOwner, aiCtl.summarize);

  // Booking — admin
  app.get("/api/admin/booking/availability", auth, editorOrOwner, booking.getAvailability);
  app.put("/api/admin/booking/availability", auth, editorOrOwner, booking.updateAvailability);
  app.get("/api/admin/booking/meeting-types", auth, editorOrOwner, booking.listAdminMeetingTypes);
  app.post("/api/admin/booking/meeting-types", auth, editorOrOwner, booking.createMeetingType);
  app.put("/api/admin/booking/meeting-types/:id", auth, editorOrOwner, booking.updateMeetingType);
  app.delete("/api/admin/booking/meeting-types/:id", auth, editorOrOwner, booking.deleteMeetingType);
  app.get("/api/admin/booking/bookings", auth, editorOrOwner, booking.listBookings);
  app.get("/api/admin/booking/bookings/:id", auth, editorOrOwner, booking.getBooking);
  app.post("/api/admin/booking/bookings/:id/confirm", auth, editorOrOwner, booking.confirm);
  app.post("/api/admin/booking/bookings/:id/cancel", auth, editorOrOwner, booking.cancelHost);
  app.post("/api/admin/booking/bookings/:id/complete", auth, editorOrOwner, booking.complete);

  // Google Calendar
  app.post("/api/admin/booking/google-calendar/connect", auth, ownerOnly, booking.gcalConnect);
  app.post("/api/admin/booking/google-calendar/callback", auth, ownerOnly, booking.gcalCallback);
  app.post("/api/admin/booking/google-calendar/sync", auth, ownerOnly, booking.gcalSync);
  app.post("/api/admin/booking/google-calendar/disconnect", auth, ownerOnly, booking.gcalDisconnect);

  // Audit log (read-only, owner)
  app.get("/api/admin/audit-log", auth, ownerOnly, async (_req, res, next) => {
    try {
      const repo = container.get<AuditLogRepository>(TYPES.AuditLogRepository);
      res.json({ ok: true, data: await repo.list(100) });
    } catch (e) {
      next(e);
    }
  });

  // Email events
  app.get("/api/admin/email-events", auth, editorOrOwner, async (_req, res, next) => {
    try {
      const repo = container.get<EmailEventRepository>(TYPES.EmailEventRepository);
      const [list, counts] = await Promise.all([repo.list(200), repo.countByType()]);
      res.json({ ok: true, data: { list, counts } });
    } catch (e) {
      next(e);
    }
  });
}
