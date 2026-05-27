import { injectable, inject } from "inversify";
import type { Resend } from "resend";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { EmailSender } from "../../domain/ports.js";

@injectable()
export class ResendEmailSender implements EmailSender {
  constructor(
    @inject(TYPES.Resend) private readonly resend: Resend | null,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  async send(args: { to: string | string[]; subject: string; html: string; replyTo?: string; attachments?: Array<{ filename: string; contentBase64: string }> }) {
    if (!this.resend) {
      this.logger.warn("Resend not configured — skipping email", { subject: args.subject });
      return;
    }
    const result = await this.resend.emails.send({
      from: this.env.RESEND_FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
      attachments: args.attachments?.map((a) => ({ filename: a.filename, content: a.contentBase64 })),
    });
    if (result.error) {
      this.logger.error("Resend send failed", { error: result.error.message });
      throw new Error(result.error.message);
    }
  }
}
