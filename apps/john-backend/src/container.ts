import { Container } from "inversify";
import { MongoClient, type Db } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from "resend";
import OpenAI from "openai";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";

import { MongoProfileRepository } from "./infrastructure/persistence/profile.repo.js";
import { MongoTimelineRepository } from "./infrastructure/persistence/timeline.repo.js";
import { MongoVentureRepository } from "./infrastructure/persistence/venture.repo.js";
import { MongoPhilanthropyRepository } from "./infrastructure/persistence/philanthropy.repo.js";
import { MongoAchievementRepository } from "./infrastructure/persistence/achievement.repo.js";
import { MongoQuoteRepository } from "./infrastructure/persistence/quote.repo.js";
import { MongoNewsRepository } from "./infrastructure/persistence/news.repo.js";
import { MongoEventRepository } from "./infrastructure/persistence/event.repo.js";
import { MongoMediaRepository } from "./infrastructure/persistence/media.repo.js";
import { MongoMessageRepository } from "./infrastructure/persistence/message.repo.js";
import { MongoSubscriberRepository } from "./infrastructure/persistence/subscriber.repo.js";
import { MongoSettingsRepository } from "./infrastructure/persistence/settings.repo.js";
import { MongoAdminUserRepository } from "./infrastructure/persistence/admin-user.repo.js";
import { MongoAvailabilityRepository } from "./infrastructure/persistence/availability.repo.js";
import { MongoBookingRepository } from "./infrastructure/persistence/booking.repo.js";
import { AuditLogRepository } from "./infrastructure/persistence/audit-log.repo.js";
import { EmailEventRepository } from "./infrastructure/persistence/email-event.repo.js";

import { ProfileService } from "./application/profile.service.js";
import { CrudService } from "./application/crud.service.js";
import { MessageService } from "./application/message.service.js";
import { SubscriberService } from "./application/subscriber.service.js";
import { SettingsService } from "./application/settings.service.js";
import { AuthService } from "./application/auth.service.js";
import { MediaService } from "./application/media.service.js";
import { AiService } from "./application/ai.service.js";
import { BookingService } from "./application/booking.service.js";
import { GoogleCalendarSyncService } from "./application/google-calendar-sync.service.js";

import { CloudinaryUploader } from "./infrastructure/media/cloudinary.uploader.js";
import { ResendEmailSender } from "./infrastructure/email/resend.sender.js";
import { OpenAiAssistant } from "./infrastructure/ai/openai.assistant.js";
import { ReminderRunner } from "./infrastructure/scheduler/reminder.runner.js";

import { PublicController } from "./interfaces/public.controller.js";
import { AdminController } from "./interfaces/admin.controller.js";
import { AuthController } from "./interfaces/auth.controller.js";
import { AiController } from "./interfaces/ai.controller.js";
import { MediaController } from "./interfaces/media.controller.js";
import { ContactController } from "./interfaces/contact.controller.js";
import { NewsletterController } from "./interfaces/newsletter.controller.js";
import { BookingController } from "./interfaces/booking.controller.js";
import { SitemapController } from "./interfaces/sitemap.controller.js";
import { PressKitController } from "./interfaces/press-kit.controller.js";
import { WebhookController } from "./interfaces/webhook.controller.js";

import { bootstrapAdmin } from "./infrastructure/persistence/bootstrap.js";

export async function buildContainer(env: BackendEnv, logger: Logger): Promise<Container> {
  const c = new Container({ defaultScope: "Singleton" });

  const mongo = new MongoClient(env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db(env.MONGO_DB);
  await ensureIndexes(db);

  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

  c.bind<Db>(TYPES.Mongo).toConstantValue(db);
  c.bind<Logger>(TYPES.Logger).toConstantValue(logger);
  c.bind<BackendEnv>(TYPES.Config).toConstantValue(env);
  c.bind(TYPES.Cloudinary).toConstantValue(cloudinary);
  c.bind(TYPES.Resend).toConstantValue(resend);
  c.bind(TYPES.OpenAI).toConstantValue(openai);

  // Repositories
  c.bind(TYPES.ProfileRepository).to(MongoProfileRepository);
  c.bind(TYPES.TimelineRepository).to(MongoTimelineRepository);
  c.bind(TYPES.VentureRepository).to(MongoVentureRepository);
  c.bind(TYPES.PhilanthropyRepository).to(MongoPhilanthropyRepository);
  c.bind(TYPES.AchievementRepository).to(MongoAchievementRepository);
  c.bind(TYPES.QuoteRepository).to(MongoQuoteRepository);
  c.bind(TYPES.NewsRepository).to(MongoNewsRepository);
  c.bind(TYPES.EventRepository).to(MongoEventRepository);
  c.bind(TYPES.MediaRepository).to(MongoMediaRepository);
  c.bind(TYPES.MessageRepository).to(MongoMessageRepository);
  c.bind(TYPES.SubscriberRepository).to(MongoSubscriberRepository);
  c.bind(TYPES.SettingsRepository).to(MongoSettingsRepository);
  c.bind(TYPES.AdminUserRepository).to(MongoAdminUserRepository);
  c.bind(TYPES.AvailabilityRepository).to(MongoAvailabilityRepository);
  c.bind(TYPES.BookingRepository).to(MongoBookingRepository);
  c.bind(TYPES.AuditLogRepository).to(AuditLogRepository);
  c.bind(TYPES.EmailEventRepository).to(EmailEventRepository);

  // Adapters
  c.bind(TYPES.MediaUploader).to(CloudinaryUploader);
  c.bind(TYPES.EmailSender).to(ResendEmailSender);
  c.bind(TYPES.AiAssistant).to(OpenAiAssistant);

  // Services
  c.bind(TYPES.ProfileService).to(ProfileService);
  c.bind(TYPES.TimelineService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.TimelineRepository), "Timeline entry"),
  );
  c.bind(TYPES.VentureService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.VentureRepository), "Venture"),
  );
  c.bind(TYPES.PhilanthropyService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.PhilanthropyRepository), "Philanthropy entry"),
  );
  c.bind(TYPES.AchievementService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.AchievementRepository), "Achievement"),
  );
  c.bind(TYPES.QuoteService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.QuoteRepository), "Quote"),
  );
  c.bind(TYPES.NewsService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.NewsRepository), "News post"),
  );
  c.bind(TYPES.EventService).toDynamicValue(
    (ctx) => new CrudService(ctx.get<never>(TYPES.EventRepository), "Event"),
  );
  c.bind(TYPES.MediaService).to(MediaService);
  c.bind(TYPES.MessageService).to(MessageService);
  c.bind(TYPES.SubscriberService).to(SubscriberService);
  c.bind(TYPES.SettingsService).to(SettingsService);
  c.bind(TYPES.AuthService).to(AuthService);
  c.bind(TYPES.AiService).to(AiService);
  c.bind(TYPES.BookingService).to(BookingService);
  c.bind(TYPES.GoogleCalendarSyncService).to(GoogleCalendarSyncService);
  c.bind(TYPES.ReminderRunner).to(ReminderRunner);

  // Controllers
  c.bind(TYPES.PublicController).to(PublicController);
  c.bind(TYPES.AdminController).to(AdminController);
  c.bind(TYPES.AuthController).to(AuthController);
  c.bind(TYPES.AiController).to(AiController);
  c.bind(TYPES.MediaController).to(MediaController);
  c.bind(TYPES.ContactController).to(ContactController);
  c.bind(TYPES.NewsletterController).to(NewsletterController);
  c.bind(TYPES.BookingController).to(BookingController);
  c.bind(TYPES.SitemapController).to(SitemapController);
  c.bind(TYPES.PressKitController).to(PressKitController);
  c.bind(TYPES.WebhookController).to(WebhookController);

  await bootstrapAdmin(c, env, logger);
  c.get<ReminderRunner>(TYPES.ReminderRunner).start();

  return c;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("profile").createIndex({ subject: 1 }, { unique: true }),
    db.collection("timeline").createIndex({ order: 1, date: 1 }),
    db.collection("ventures").createIndex({ order: 1 }),
    db.collection("philanthropy").createIndex({ order: 1, year: -1 }),
    db.collection("achievements").createIndex({ year: -1 }),
    db.collection("quotes").createIndex({ order: 1 }),
    db.collection("news").createIndex({ slug: 1 }, { unique: true }),
    db.collection("news").createIndex({ publishedAt: -1 }),
    db.collection("events").createIndex({ startsAt: -1 }),
    db.collection("media").createIndex({ publicId: 1 }, { unique: true }),
    db.collection("messages").createIndex({ createdAt: -1 }),
    db.collection("subscribers").createIndex({ email: 1 }, { unique: true }),
    db.collection("settings").createIndex({ subject: 1 }, { unique: true }),
    db.collection("admin_users").createIndex({ email: 1 }, { unique: true }),
    db.collection("refresh_tokens").createIndex({ token: 1 }, { unique: true }),
    db.collection("refresh_tokens").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("availability_profile").createIndex({ subject: 1 }, { unique: true }),
    db.collection("meeting_types").createIndex({ slug: 1 }, { unique: true }),
    db.collection("bookings").createIndex({ startsAt: 1 }),
    db.collection("bookings").createIndex({ status: 1, startsAt: 1 }),
    db.collection("bookings").createIndex({ inviteeEmail: 1 }),
    db.collection("audit_log").createIndex({ ts: -1 }),
    db.collection("audit_log").createIndex({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 }),
    db.collection("email_events").createIndex({ receivedAt: -1 }),
    db.collection("email_events").createIndex({ type: 1, receivedAt: -1 }),
    db.collection("email_events").createIndex({ to: 1, receivedAt: -1 }),
    db.collection("email_events").createIndex({ receivedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }),
  ]);
}
