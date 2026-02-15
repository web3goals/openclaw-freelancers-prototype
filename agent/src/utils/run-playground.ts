import dotenv from "dotenv";
dotenv.config();

import { logger } from "../lib/logger";

async function main() {
  logger.info("[Utils] Running playground...");

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Utils] Running playground completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
