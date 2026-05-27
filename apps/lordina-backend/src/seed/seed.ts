import type { Container } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type {
  AchievementRepository,
  EventRepository,
  PhilanthropyRepository,
  ProfileRepository,
  QuoteRepository,
  SettingsRepository,
  TimelineRepository,
  VentureRepository,
} from "../domain/ports.js";
import type { AvailabilityRepository } from "../domain/scheduling-ports.js";
import { ibrahim } from "./data/ibrahim.js";
import { john } from "./data/john.js";
import { sharaf } from "./data/sharaf.js";
import { lordina } from "./data/lordina.js";
import type { SeedBundle } from "./data/types.js";

const bundles: Record<BackendEnv["SUBJECT"], SeedBundle> = {
  ibrahim,
  john,
  sharaf,
  lordina,
};

export async function runSeed(container: Container, env: BackendEnv, logger: Logger) {
  const bundle = bundles[env.SUBJECT];
  const profile = container.get<ProfileRepository>(TYPES.ProfileRepository);
  const timeline = container.get<TimelineRepository>(TYPES.TimelineRepository);
  const ventures = container.get<VentureRepository>(TYPES.VentureRepository);
  const philanthropy = container.get<PhilanthropyRepository>(TYPES.PhilanthropyRepository);
  const achievements = container.get<AchievementRepository>(TYPES.AchievementRepository);
  const quotes = container.get<QuoteRepository>(TYPES.QuoteRepository);
  const events = container.get<EventRepository>(TYPES.EventRepository);
  const settings = container.get<SettingsRepository>(TYPES.SettingsRepository);
  const availability = container.get<AvailabilityRepository>(TYPES.AvailabilityRepository);

  await profile.upsert(bundle.profile);
  await settings.upsert(bundle.settings);

  const seedCrud = async <T extends { id: string }>(
    repo: { findAll(): Promise<T[]>; create(d: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> },
    items: Array<Omit<T, "id" | "createdAt" | "updatedAt">>,
    label: string,
  ) => {
    const existing = await repo.findAll();
    if (existing.length > 0) {
      logger.info(`skip ${label} — already seeded`, { count: existing.length });
      return;
    }
    for (const item of items) await repo.create(item);
    logger.info(`seeded ${label}`, { count: items.length });
  };

  await seedCrud(timeline, bundle.timeline, "timeline");
  await seedCrud(ventures, bundle.ventures, "ventures");
  await seedCrud(philanthropy, bundle.philanthropy, "philanthropy");
  await seedCrud(achievements, bundle.achievements, "achievements");
  await seedCrud(quotes, bundle.quotes, "quotes");
  await seedCrud(events, bundle.events, "events");

  const existingTypes = await availability.listMeetingTypes();
  if (existingTypes.length > 0) {
    logger.info("skip meeting types — already seeded", { count: existingTypes.length });
  } else {
    for (const mt of bundle.meetingTypes) await availability.createMeetingType(mt);
    logger.info("seeded meeting types", { count: bundle.meetingTypes.length });
  }
}
