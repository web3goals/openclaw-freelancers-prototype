import dotenv from "dotenv";
dotenv.config();

import { HumanMessage } from "langchain";
import { invokeAgent } from "../lib/agent";
import { logger } from "../lib/logger";

async function main() {
  logger.info("[Utils] Registering freelancers...");

  await invokeAgent([new HumanMessage("Register freelancers.")]);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Utils] Registering freelancers completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
