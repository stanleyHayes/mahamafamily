import { z } from "zod";

export const backendEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUBJECT: z.enum(["ibrahim", "john", "sharaf", "lordina"]),
  PORT: z.coerce.number().default(4000),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:4000"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173,http://localhost:5174"),
  MONGO_URI: z.string().min(1),
  MONGO_DB: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default("mahama-portfolios"),
  JWT_TTL_SECONDS: z.coerce.number().default(60 * 60),
  REFRESH_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 14),
  RESEND_API_KEY: z.string().optional(),
  RESEND_WEBHOOK_SECRET: z.string().optional(),
  RESEND_FROM: z.string().default("hello@mahama-portfolios.test"),
  CONTACT_INBOX: z.string().email().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().optional(),
  ADMIN_BOOTSTRAP_NAME: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(120),
});

export type BackendEnv = z.infer<typeof backendEnvSchema>;

export function loadBackendEnv(env: NodeJS.ProcessEnv = process.env): BackendEnv {
  const parsed = backendEnvSchema.safeParse(env);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    throw new Error(`Invalid backend env: ${JSON.stringify(flat.fieldErrors)}`);
  }
  return parsed.data;
}
