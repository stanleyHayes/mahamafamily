import "reflect-metadata";
import { loadBackendEnv } from "@mahama/config";
import { buildContainer } from "./container.js";
import { startServer } from "./infrastructure/http/server.js";
import { ConsoleLogger } from "@mahama/backend-core";

async function main() {
  const env = loadBackendEnv();
  const logger = new ConsoleLogger(env.SUBJECT);
  try {
    const container = await buildContainer(env, logger);
    await startServer(container, env, logger);
  } catch (e) {
    logger.error("fatal startup error", { error: (e as Error).message });
    process.exit(1);
  }
}

main();
// reload

