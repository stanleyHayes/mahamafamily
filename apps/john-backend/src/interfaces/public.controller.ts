import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES, NotFoundError } from "@mahama/backend-core";
import { ok } from "../infrastructure/http/respond.js";
import type { ProfileService } from "../application/profile.service.js";
import type { CrudService } from "../application/crud.service.js";
import type { SettingsService } from "../application/settings.service.js";
import type {
  AchievementDTO,
  EventDTO,
  NewsPostDTO,
  PhilanthropyDTO,
  QuoteDTO,
  TimelineEntryDTO,
  VentureDTO,
  SupportedLang,
} from "@mahama/shared-types";
import { flattenLocalized } from "@mahama/shared-types";
import type { NewsRepository } from "../domain/ports.js";

const SUPPORTED_LANGS = new Set<SupportedLang>(["en", "tw", "ha", "ee", "fr"]);

function getLang(req: Request): SupportedLang | undefined {
  const raw = req.query.lang as string | undefined;
  if (raw && SUPPORTED_LANGS.has(raw as SupportedLang)) return raw as SupportedLang;
  return undefined;
}

function maybeFlatten<T>(req: Request, data: T): T {
  const lang = getLang(req) ?? "en";
  return flattenLocalized(data, lang);
}

@injectable()
export class PublicController {
  constructor(
    @inject(TYPES.ProfileService) private readonly profile: ProfileService,
    @inject(TYPES.TimelineService) private readonly timeline: CrudService<TimelineEntryDTO>,
    @inject(TYPES.VentureService) private readonly ventures: CrudService<VentureDTO>,
    @inject(TYPES.PhilanthropyService) private readonly philanthropy: CrudService<PhilanthropyDTO>,
    @inject(TYPES.AchievementService) private readonly achievements: CrudService<AchievementDTO>,
    @inject(TYPES.QuoteService) private readonly quotes: CrudService<QuoteDTO>,
    @inject(TYPES.EventService) private readonly events: CrudService<EventDTO>,
    @inject(TYPES.NewsRepository) private readonly news: NewsRepository,
    @inject(TYPES.SettingsService) private readonly settings: SettingsService,
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const p = await this.profile.get();
      ok(res, maybeFlatten(req, p), 200, 60);
    } catch (e) {
      next(e);
    }
  };

  listTimeline = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.timeline.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listVentures = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.ventures.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listPhilanthropy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.philanthropy.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listAchievements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.achievements.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listQuotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.quotes.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, maybeFlatten(req, await this.events.findAll()), 200, 60);
    } catch (e) { next(e); }
  };
  listNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.news.listPublished({
        page: req.query.page ? Number(req.query.page) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
        search: req.query.search as string | undefined,
      });
      ok(res, maybeFlatten(req, result), 200, 30);
    } catch (e) { next(e); }
  };
  getNewsBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.news.findBySlug(req.params.slug!);
      if (!post) throw new NotFoundError("Post", req.params.slug);
      ok(res, maybeFlatten(req, post), 200, 60);
    } catch (e) { next(e); }
  };
  getSettings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, await this.settings.get(), 200, 60);
    } catch (e) { next(e); }
  };
}
