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
    const { shutdown } = await startServer(container, env, logger);

    const handleSignal = async (signal: string) => {
      logger.info(`received ${signal}`);
      try {
        await shutdown();
      } catch (e) {
        logger.error("shutdown error", { error: (e as Error).message });
      }
      process.exit(0);
    };

    process.on("SIGTERM", () => handleSignal("SIGTERM"));
    process.on("SIGINT", () => handleSignal("SIGINT"));
  } catch (e) {
    logger.error("fatal startup error", { error: (e as Error).message });
    process.exit(1);
  }
}

main();
