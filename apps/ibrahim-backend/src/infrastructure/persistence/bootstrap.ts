import type { Container } from "inversify";
import { TYPES, type Logger } from "@mahama/backend-core";
import { hashPassword } from "@mahama/jwt-utils";
import type { BackendEnv } from "@mahama/config";
import type { AdminUserRepository } from "../../domain/ports.js";

export async function bootstrapAdmin(container: Container, env: BackendEnv, logger: Logger) {
  if (!env.ADMIN_BOOTSTRAP_EMAIL || !env.ADMIN_BOOTSTRAP_PASSWORD) return;
  const repo = container.get<AdminUserRepository>(TYPES.AdminUserRepository);
  const existing = await repo.findByEmail(env.ADMIN_BOOTSTRAP_EMAIL);
  if (existing) return;
  await repo.create({
    email: env.ADMIN_BOOTSTRAP_EMAIL,
    name: env.ADMIN_BOOTSTRAP_NAME ?? "Owner",
    role: "owner",
    active: true,
    passwordHash: hashPassword(env.ADMIN_BOOTSTRAP_PASSWORD),
  });
  logger.info("Bootstrap admin created", { email: env.ADMIN_BOOTSTRAP_EMAIL });
}
