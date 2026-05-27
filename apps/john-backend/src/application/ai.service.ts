import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import { resolveLocalized } from "@mahama/shared-types";
import type {
  AchievementRepository,
  AiAssistant,
  PhilanthropyRepository,
  ProfileRepository,
  QuoteRepository,
  TimelineRepository,
  VentureRepository,
} from "../domain/ports.js";

@injectable()
export class AiService {
  constructor(
    @inject(TYPES.AiAssistant) private readonly ai: AiAssistant,
    @inject(TYPES.ProfileRepository) private readonly profile: ProfileRepository,
    @inject(TYPES.TimelineRepository) private readonly timeline: TimelineRepository,
    @inject(TYPES.VentureRepository) private readonly ventures: VentureRepository,
    @inject(TYPES.PhilanthropyRepository) private readonly philanthropy: PhilanthropyRepository,
    @inject(TYPES.AchievementRepository) private readonly achievements: AchievementRepository,
    @inject(TYPES.QuoteRepository) private readonly quotes: QuoteRepository,
  ) {}

  async ask(question: string): Promise<string> {
    const ctx = await this.buildContext();
    return this.ai.ask(question, ctx);
  }

  draftBio(notes: string, subject: string) {
    return this.ai.draftBio(notes, subject);
  }

  polish(text: string, tone: string) {
    return this.ai.polish(text, tone);
  }

  summarize(text: string) {
    return this.ai.summarize(text);
  }

  private async buildContext(): Promise<string> {
    const [profile, timeline, ventures, philanthropy, achievements, quotes] = await Promise.all([
      this.profile.get(),
      this.timeline.findAll(),
      this.ventures.findAll(),
      this.philanthropy.findAll(),
      this.achievements.findAll(),
      this.quotes.findAll(),
    ]);

    const lines: string[] = [];
    if (profile) {
      lines.push(`# Profile\n${resolveLocalized(profile.fullName)} — ${resolveLocalized(profile.title)}`);
      lines.push(resolveLocalized(profile.bio));
    }
    if (timeline.length) {
      lines.push("\n# Timeline");
      timeline.forEach((t) => lines.push(`- ${t.year}: ${resolveLocalized(t.title)} — ${resolveLocalized(t.description)}`));
    }
    if (ventures.length) {
      lines.push("\n# Ventures");
      ventures.forEach((v) => lines.push(`- ${v.name} (${v.sector}): ${v.summary}`));
    }
    if (philanthropy.length) {
      lines.push("\n# Philanthropy");
      philanthropy.forEach((p) => lines.push(`- ${p.year} ${p.title} (${p.beneficiary}): ${p.summary}`));
    }
    if (achievements.length) {
      lines.push("\n# Achievements");
      achievements.forEach((a) => lines.push(`- ${a.year} ${a.title}${a.awarder ? " (" + a.awarder + ")" : ""}`));
    }
    if (quotes.length) {
      lines.push("\n# Quotes");
      quotes.forEach((q) => lines.push(`- "${q.text}" — ${q.context}`));
    }
    return lines.join("\n");
  }
}
