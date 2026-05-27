import "reflect-metadata";
import { loadBackendEnv } from "@mahama/config";
import { ConsoleLogger } from "@mahama/backend-core";
import { buildContainer } from "../container.js";
import { runSeed } from "./seed.js";

async function main() {
  const env = loadBackendEnv();
  const logger = new ConsoleLogger(env.SUBJECT);
  const container = await buildContainer(env, logger);
  await runSeed(container, env, logger);
  logger.info("seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error("seed failed", e);
  process.exit(1);
});
