import type {
  ProfileDTO,
  TimelineEntryDTO,
  VentureDTO,
  PhilanthropyDTO,
  AchievementDTO,
  QuoteDTO,
  NewsPostDTO,
  EventDTO,
  MediaAssetDTO,
  MessageDTO,
  NewsletterSubscriberDTO,
  SiteSettingsDTO,
  AdminUserDTO,
  ListQuery,
  Paginated,
} from "@mahama/shared-types";

export interface CrudRepository<T extends { id: string }> {
  list(query?: ListQuery): Promise<Paginated<T>>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface ProfileRepository {
  get(): Promise<ProfileDTO | null>;
  upsert(data: Partial<ProfileDTO>): Promise<ProfileDTO>;
}

export interface TimelineRepository extends CrudRepository<TimelineEntryDTO> {}
export interface VentureRepository extends CrudRepository<VentureDTO> {}
export interface PhilanthropyRepository extends CrudRepository<PhilanthropyDTO> {}
export interface AchievementRepository extends CrudRepository<AchievementDTO> {}
export interface QuoteRepository extends CrudRepository<QuoteDTO> {}
export interface NewsRepository extends CrudRepository<NewsPostDTO> {
  findBySlug(slug: string): Promise<NewsPostDTO | null>;
  listPublished(query?: ListQuery): Promise<Paginated<NewsPostDTO>>;
}
export interface EventRepository extends CrudRepository<EventDTO> {}
export interface MediaRepository extends CrudRepository<MediaAssetDTO> {
  findByPublicId(id: string): Promise<MediaAssetDTO | null>;
}
export interface MessageRepository extends CrudRepository<MessageDTO> {}
export interface SubscriberRepository extends CrudRepository<NewsletterSubscriberDTO> {
  findByEmail(email: string): Promise<NewsletterSubscriberDTO | null>;
  listConfirmed(): Promise<NewsletterSubscriberDTO[]>;
}
export interface SettingsRepository {
  get(): Promise<SiteSettingsDTO | null>;
  upsert(data: Partial<SiteSettingsDTO>): Promise<SiteSettingsDTO>;
}

export interface AdminUserRepository {
  findByEmail(email: string): Promise<(AdminUserDTO & { passwordHash: string }) | null>;
  findById(id: string): Promise<AdminUserDTO | null>;
  list(): Promise<AdminUserDTO[]>;
  create(data: Omit<AdminUserDTO, "id" | "createdAt" | "updatedAt"> & { passwordHash: string }): Promise<AdminUserDTO>;
  update(id: string, data: Partial<AdminUserDTO> & { passwordHash?: string }): Promise<AdminUserDTO | null>;
  delete(id: string): Promise<boolean>;
  saveRefreshToken(token: string, userId: string, expiresAt: Date): Promise<void>;
  consumeRefreshToken(token: string): Promise<{ userId: string } | null>;
  recordLogin(userId: string): Promise<void>;
}

// Adapter ports
export interface MediaUploader {
  signUpload(folder: string): { signature: string; timestamp: number; apiKey: string; cloudName: string; folder: string };
  destroy(publicId: string): Promise<void>;
}

export interface EmailSender {
  send(args: {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
    attachments?: Array<{ filename: string; contentBase64: string }>;
  }): Promise<void>;
}

export interface AiAssistant {
  ask(question: string, context: string): Promise<string>;
  draftBio(notes: string, subject: string): Promise<string>;
  polish(text: string, tone: string): Promise<string>;
  summarize(text: string): Promise<string>;
}
