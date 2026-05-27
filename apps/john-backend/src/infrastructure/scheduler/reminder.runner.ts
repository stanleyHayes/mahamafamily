import { injectable, inject } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import type { BookingService } from "../../application/booking.service.js";

const TICK_MS = 5 * 60 * 1000; // run every 5 minutes

@injectable()
export class ReminderRunner {
  private timer: NodeJS.Timeout | null = null;

  constructor(
    @inject(TYPES.BookingService) private readonly svc: BookingService,
    @inject(TYPES.Logger) private readonly logger: Logger,
  ) {}

  start() {
    if (this.timer) return;
    this.tick().catch((e) => this.logger.warn("reminder tick failed", { error: (e as Error).message }));
    this.timer = setInterval(() => {
      this.tick().catch((e) => this.logger.warn("reminder tick failed", { error: (e as Error).message }));
    }, TICK_MS);
    this.logger.info("reminder runner started", { intervalMs: TICK_MS });
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async tick() {
    const result = await this.svc.runRemindersTick();
    if (result.day || result.hour) {
      this.logger.info("reminders sent", { ...result });
    }
  }
}
