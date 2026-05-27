import type { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import { ok } from "../infrastructure/http/respond.js";
import type { EmailEventRepository } from "../infrastructure/persistence/email-event.repo.js";
import type { SubscriberRepository } from "../domain/ports.js";

interface ResendEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    to?: string[];
    subject?: string;
    bounce?: { type?: string; subType?: string };
    [k: string]: unknown;
  };
}

@injectable()
export class WebhookController {
  constructor(
    @inject(TYPES.EmailEventRepository ?? Symbol.for("EmailEventRepository")) private readonly events: EmailEventRepository,
    @inject(TYPES.SubscriberRepository) private readonly subscribers: SubscriberRepository,
    @inject(TYPES.Config) private readonly env: BackendEnv,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  resend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (this.env.RESEND_WEBHOOK_SECRET) {
        const sig = req.header("svix-signature") ?? req.header("resend-signature") ?? "";
        const timestamp = req.header("svix-timestamp") ?? "";
        const id = req.header("svix-id") ?? "";
        const rawBody = (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
        if (!this.verifySignature(sig, id, timestamp, rawBody)) {
          this.logger.warn("rejected webhook — bad signature");
          res.status(401).json({ ok: false, error: { code: "UNAUTHORIZED", message: "Bad signature" } });
          return;
        }
      }
      const ev = req.body as ResendEvent;
      const to = Array.isArray(ev.data?.to) ? ev.data.to[0] : undefined;
      await this.events.record({
        type: ev.type ?? "unknown",
        to: to ?? "",
        emailId: ev.data?.email_id,
        subject: ev.data?.subject,
        payload: ev,
        receivedAt: new Date(),
      });

      // React to the event
      if (to && (ev.type === "email.bounced" || ev.type === "email.complained")) {
        const sub = await this.subscribers.findByEmail(to);
        if (sub) {
          await this.subscribers.update(sub.id, {
            unsubscribed: true,
            unsubscribedAt: new Date().toISOString(),
          });
          this.logger.info("auto-unsubscribed on bounce/complaint", { email: to, type: ev.type });
        }
      }

      ok(res, { ok: true });
    } catch (e) {
      next(e);
    }
  };

  private verifySignature(headerSig: string, id: string, ts: string, body: string): boolean {
    if (!this.env.RESEND_WEBHOOK_SECRET) return true;
    const secretBytes = Buffer.from(this.env.RESEND_WEBHOOK_SECRET.replace(/^whsec_/, ""), "base64");
    const toSign = `${id}.${ts}.${body}`;
    const expected = createHmac("sha256", secretBytes).update(toSign).digest("base64");
    // header is "v1,<sig> v1,<sig>" — match any
    const provided = headerSig.split(" ").map((s) => s.replace(/^v1,/, ""));
    for (const p of provided) {
      const a = Buffer.from(expected);
      const b = Buffer.from(p);
      if (a.length === b.length && timingSafeEqual(a, b)) return true;
    }
    return false;
  }
}
