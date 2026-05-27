import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES, ConflictError } from "@mahama/backend-core";
import { hashPassword } from "@mahama/jwt-utils";
import { ok } from "../infrastructure/http/respond.js";
import type {
  AchievementDTO,
  AdminUserDTO,
  EventDTO,
  ListQuery,
  NewsPostDTO,
  PhilanthropyDTO,
  QuoteDTO,
  TimelineEntryDTO,
  VentureDTO,
} from "@mahama/shared-types";
import type { ProfileService } from "../application/profile.service.js";
import type { CrudService } from "../application/crud.service.js";
import type { MessageService } from "../application/message.service.js";
import type { SubscriberService } from "../application/subscriber.service.js";
import type { SettingsService } from "../application/settings.service.js";
import type { AdminUserRepository } from "../domain/ports.js";

function listQuery(req: Request): ListQuery {
  return {
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    search: (req.query.search as string) || undefined,
    sortBy: (req.query.sortBy as string) || undefined,
    sortDir: (req.query.sortDir as "asc" | "desc") || undefined,
  };
}

function crudHandlers<T extends { id: string }>(svc: CrudService<T>) {
  return {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try { ok(res, await svc.list(listQuery(req))); } catch (e) { next(e); }
    },
    get: async (req: Request, res: Response, next: NextFunction) => {
      try { ok(res, await svc.get(req.params.id!)); } catch (e) { next(e); }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try { ok(res, await svc.create(req.body), 201); } catch (e) { next(e); }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try { ok(res, await svc.update(req.params.id!, req.body)); } catch (e) { next(e); }
    },
    remove: async (req: Request, res: Response, next: NextFunction) => {
      try { await svc.remove(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
    },
  };
}

@injectable()
export class AdminController {
  profile: { get: import("express").RequestHandler; update: import("express").RequestHandler };
  timeline; ventures; philanthropy; achievements; quotes; news; events;
  messages; subscribers; settings; users;

  constructor(
    @inject(TYPES.ProfileService) profileService: ProfileService,
    @inject(TYPES.TimelineService) timelineService: CrudService<TimelineEntryDTO>,
    @inject(TYPES.VentureService) ventureService: CrudService<VentureDTO>,
    @inject(TYPES.PhilanthropyService) philanthropyService: CrudService<PhilanthropyDTO>,
    @inject(TYPES.AchievementService) achievementService: CrudService<AchievementDTO>,
    @inject(TYPES.QuoteService) quoteService: CrudService<QuoteDTO>,
    @inject(TYPES.NewsService) newsService: CrudService<NewsPostDTO>,
    @inject(TYPES.EventService) eventService: CrudService<EventDTO>,
    @inject(TYPES.MessageService) messageService: MessageService,
    @inject(TYPES.SubscriberService) subscriberService: SubscriberService,
    @inject(TYPES.SettingsService) settingsService: SettingsService,
    @inject(TYPES.AdminUserRepository) userRepo: AdminUserRepository,
  ) {
    this.profile = {
      get: async (_req, res, next) => {
        try { ok(res, await profileService.get()); } catch (e) { next(e); }
      },
      update: async (req, res, next) => {
        try { ok(res, await profileService.update(req.body)); } catch (e) { next(e); }
      },
    };
    this.timeline = crudHandlers(timelineService);
    this.ventures = crudHandlers(ventureService);
    this.philanthropy = crudHandlers(philanthropyService);
    this.achievements = crudHandlers(achievementService);
    this.quotes = crudHandlers(quoteService);
    this.news = crudHandlers(newsService);
    this.events = crudHandlers(eventService);

    this.messages = {
      list: async (req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await messageService.list(listQuery(req))); } catch (e) { next(e); }
      },
      get: async (req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await messageService.get(req.params.id!)); } catch (e) { next(e); }
      },
      update: async (req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await messageService.update(req.params.id!, req.body)); } catch (e) { next(e); }
      },
      remove: async (req: Request, res: Response, next: NextFunction) => {
        try { await messageService.remove(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
      },
      reply: async (req: Request, res: Response, next: NextFunction) => {
        try { await messageService.reply(req.params.id!, String(req.body.body || "")); ok(res, { ok: true }); } catch (e) { next(e); }
      },
    };

    this.subscribers = {
      list: async (req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await subscriberService.list(listQuery(req))); } catch (e) { next(e); }
      },
      remove: async (req: Request, res: Response, next: NextFunction) => {
        try { await subscriberService.remove(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
      },
      broadcast: async (req: Request, res: Response, next: NextFunction) => {
        try {
          const sent = await subscriberService.broadcast(String(req.body.subject), String(req.body.html));
          ok(res, { sent });
        } catch (e) { next(e); }
      },
    };

    this.settings = {
      get: async (_req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await settingsService.get()); } catch (e) { next(e); }
      },
      update: async (req: Request, res: Response, next: NextFunction) => {
        try { ok(res, await settingsService.update(req.body)); } catch (e) { next(e); }
      },
    };

    this.users = {
      list: async (_req: Request, res: Response, next: NextFunction) => {
        try { ok(res, { items: await userRepo.list(), total: 0, page: 1, pageSize: 100 }); } catch (e) { next(e); }
      },
      create: async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password, name, role } = req.body as { email: string; password: string; name: string; role: AdminUserDTO["role"] };
          const existing = await userRepo.findByEmail(email);
          if (existing) throw new ConflictError("Email already in use");
          const user = await userRepo.create({
            email, name, role, active: true, passwordHash: hashPassword(password),
          });
          ok(res, user, 201);
        } catch (e) { next(e); }
      },
      update: async (req: Request, res: Response, next: NextFunction) => {
        try {
          const patch: Partial<AdminUserDTO> & { password?: string } = req.body;
          const passwordHash = patch.password ? hashPassword(patch.password) : undefined;
          delete patch.password;
          ok(res, await userRepo.update(req.params.id!, { ...patch, ...(passwordHash ? { passwordHash } : {}) }));
        } catch (e) { next(e); }
      },
      remove: async (req: Request, res: Response, next: NextFunction) => {
        try { await userRepo.delete(req.params.id!); ok(res, { ok: true }); } catch (e) { next(e); }
      },
    };
  }
}
