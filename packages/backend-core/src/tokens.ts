export const TYPES = {
  // infrastructure
  Mongo: Symbol.for("Mongo"),
  Logger: Symbol.for("Logger"),
  Config: Symbol.for("Config"),
  Cloudinary: Symbol.for("Cloudinary"),
  Resend: Symbol.for("Resend"),
  OpenAI: Symbol.for("OpenAI"),

  // repositories
  ProfileRepository: Symbol.for("ProfileRepository"),
  TimelineRepository: Symbol.for("TimelineRepository"),
  VentureRepository: Symbol.for("VentureRepository"),
  PhilanthropyRepository: Symbol.for("PhilanthropyRepository"),
  AchievementRepository: Symbol.for("AchievementRepository"),
  QuoteRepository: Symbol.for("QuoteRepository"),
  NewsRepository: Symbol.for("NewsRepository"),
  EventRepository: Symbol.for("EventRepository"),
  MediaRepository: Symbol.for("MediaRepository"),
  MessageRepository: Symbol.for("MessageRepository"),
  SubscriberRepository: Symbol.for("SubscriberRepository"),
  SettingsRepository: Symbol.for("SettingsRepository"),
  AdminUserRepository: Symbol.for("AdminUserRepository"),

  // scheduling
  AvailabilityRepository: Symbol.for("AvailabilityRepository"),
  BookingRepository: Symbol.for("BookingRepository"),
  BookingService: Symbol.for("BookingService"),
  BookingController: Symbol.for("BookingController"),
  GoogleCalendarSyncService: Symbol.for("GoogleCalendarSyncService"),
  ReminderRunner: Symbol.for("ReminderRunner"),

  // services (use cases)
  ProfileService: Symbol.for("ProfileService"),
  TimelineService: Symbol.for("TimelineService"),
  VentureService: Symbol.for("VentureService"),
  PhilanthropyService: Symbol.for("PhilanthropyService"),
  AchievementService: Symbol.for("AchievementService"),
  QuoteService: Symbol.for("QuoteService"),
  NewsService: Symbol.for("NewsService"),
  EventService: Symbol.for("EventService"),
  MediaService: Symbol.for("MediaService"),
  MessageService: Symbol.for("MessageService"),
  SubscriberService: Symbol.for("SubscriberService"),
  SettingsService: Symbol.for("SettingsService"),
  AuthService: Symbol.for("AuthService"),
  AiService: Symbol.for("AiService"),

  // adapters
  EmailSender: Symbol.for("EmailSender"),
  MediaUploader: Symbol.for("MediaUploader"),
  AiAssistant: Symbol.for("AiAssistant"),

  // misc / cross-cutting
  AuditLogRepository: Symbol.for("AuditLogRepository"),
  SitemapController: Symbol.for("SitemapController"),
  PressKitController: Symbol.for("PressKitController"),
  EmailEventRepository: Symbol.for("EmailEventRepository"),
  WebhookController: Symbol.for("WebhookController"),

  // controllers
  PublicController: Symbol.for("PublicController"),
  AdminController: Symbol.for("AdminController"),
  AuthController: Symbol.for("AuthController"),
  AiController: Symbol.for("AiController"),
  MediaController: Symbol.for("MediaController"),
  ContactController: Symbol.for("ContactController"),
  NewsletterController: Symbol.for("NewsletterController"),
} as const;
