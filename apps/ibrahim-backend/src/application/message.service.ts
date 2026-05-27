import { injectable, inject } from "inversify";
import { TYPES, NotFoundError, type Logger } from "@mahama/backend-core";
import type { ListQuery, MessageDTO, Paginated } from "@mahama/shared-types";
import type { BackendEnv } from "@mahama/config";
import type { EmailSender, MessageRepository } from "../domain/ports.js";

@injectable()
export class MessageService {
  constructor(
    @inject(TYPES.MessageRepository) private readonly repo: MessageRepository,
    @inject(TYPES.EmailSender) private readonly mail: EmailSender,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  async submit(input: Pick<MessageDTO, "name" | "email" | "subject" | "body" | "category" | "phone"> & { ipAddress?: string; userAgent?: string }): Promise<MessageDTO> {
    const created = await this.repo.create({
      ...input,
      status: "new",
    } as Omit<MessageDTO, "id" | "createdAt" | "updatedAt">);

    if (this.env.CONTACT_INBOX) {
      try {
        await this.mail.send({
          to: this.env.CONTACT_INBOX,
          replyTo: input.email,
          subject: `[${this.env.SUBJECT}] ${input.subject}`,
          html: this.renderInternal(created),
        });
      } catch (e) {
        this.logger.warn("contact email failed", { error: (e as Error).message });
      }
    }
    return created;
  }

  list(q?: ListQuery): Promise<Paginated<MessageDTO>> {
    return this.repo.list(q);
  }

  async get(id: string): Promise<MessageDTO> {
    const m = await this.repo.findById(id);
    if (!m) throw new NotFoundError("Message", id);
    if (m.status === "new") await this.repo.update(id, { status: "read" });
    return m;
  }

  async update(id: string, patch: Partial<MessageDTO>): Promise<MessageDTO> {
    const m = await this.repo.update(id, patch);
    if (!m) throw new NotFoundError("Message", id);
    return m;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundError("Message", id);
  }

  async reply(id: string, body: string): Promise<void> {
    const m = await this.repo.findById(id);
    if (!m) throw new NotFoundError("Message", id);
    await this.mail.send({
      to: m.email,
      subject: `Re: ${m.subject}`,
      html: `<p>Hello ${escapeHtml(m.name)},</p>${paragraphs(body)}<p>— Office of ${this.env.SUBJECT}</p>`,
    });
    await this.repo.update(id, { status: "replied" });
  }

  private renderInternal(m: MessageDTO): string {
    return `
      <h2>New ${m.category} message</h2>
      <p><b>From:</b> ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</p>
      ${m.phone ? `<p><b>Phone:</b> ${escapeHtml(m.phone)}</p>` : ""}
      <p><b>Subject:</b> ${escapeHtml(m.subject)}</p>
      <hr>
      ${paragraphs(m.body)}
    `;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
function paragraphs(s: string): string {
  return s
    .split(/\n\n+/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
