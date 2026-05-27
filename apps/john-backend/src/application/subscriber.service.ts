import { injectable, inject } from "inversify";
import { TYPES, ConflictError, type Logger } from "@mahama/backend-core";
import type { ListQuery, NewsletterSubscriberDTO, Paginated } from "@mahama/shared-types";
import type { BackendEnv } from "@mahama/config";
import type { EmailSender, SubscriberRepository } from "../domain/ports.js";

@injectable()
export class SubscriberService {
  constructor(
    @inject(TYPES.SubscriberRepository) private readonly repo: SubscriberRepository,
    @inject(TYPES.EmailSender) private readonly mail: EmailSender,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  async subscribe(data: { email: string; name?: string; source?: string }): Promise<NewsletterSubscriberDTO> {
    const email = data.email.toLowerCase().trim();
    const existing = await this.repo.findByEmail(email);
    if (existing && !existing.unsubscribed) {
      throw new ConflictError("Email already subscribed");
    }
    if (existing) {
      const reactivated = await this.repo.update(existing.id, {
        unsubscribed: false,
        unsubscribedAt: undefined,
        confirmed: true,
        confirmedAt: new Date().toISOString(),
      });
      return reactivated!;
    }
    const created = await this.repo.create({
      email,
      name: data.name,
      source: data.source,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      unsubscribed: false,
    } as Omit<NewsletterSubscriberDTO, "id" | "createdAt" | "updatedAt">);

    try {
      await this.mail.send({
        to: email,
        subject: `Welcome to ${this.env.SUBJECT}'s updates`,
        html: `<p>Hello${data.name ? " " + data.name : ""},</p><p>Thank you for subscribing. You'll receive periodic updates from the office of ${this.env.SUBJECT}.</p>`,
      });
    } catch (e) {
      this.logger.warn("welcome email failed", { error: (e as Error).message });
    }
    return created;
  }

  list(q?: ListQuery): Promise<Paginated<NewsletterSubscriberDTO>> {
    return this.repo.list(q);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async broadcast(subject: string, html: string): Promise<number> {
    const all = await this.repo.listConfirmed();
    let sent = 0;
    for (const s of all) {
      try {
        await this.mail.send({ to: s.email, subject, html });
        sent++;
      } catch (e) {
        this.logger.warn("broadcast failure", { email: s.email, error: (e as Error).message });
      }
    }
    return sent;
  }
}
