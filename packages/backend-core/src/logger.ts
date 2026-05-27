export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  constructor(private readonly subject: string) {}

  private fmt(level: string, message: string, meta?: Record<string, unknown>) {
    const entry = {
      ts: new Date().toISOString(),
      subject: this.subject,
      level,
      message,
      ...(meta ?? {}),
    };
    return JSON.stringify(entry);
  }

  info(message: string, meta?: Record<string, unknown>) {
    console.log(this.fmt("info", message, meta));
  }
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.fmt("warn", message, meta));
  }
  error(message: string, meta?: Record<string, unknown>) {
    console.error(this.fmt("error", message, meta));
  }
  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.fmt("debug", message, meta));
    }
  }
}
