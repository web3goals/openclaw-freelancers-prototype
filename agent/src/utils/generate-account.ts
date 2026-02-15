import dotenv from "dotenv";
dotenv.config();

import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { logger } from "../lib/logger";

async function main() {
  logger.info("[Utils] Generating account...");

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  logger.info(`[Utils] Address: ${account.address}`);
  logger.info(`[Utils] Private key: ${privateKey}`);

  // Wait a bit before exiting to ensure all logs are saved
  await new Promise((resolve) => setTimeout(resolve, 2000));

  logger.info("[Utils] Generating account completed");
  process.exit(0);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
