import { SDK } from "agent0-sdk";
import { erc8004Config } from "../config/erc8004";
import { logger } from "./logger";

export async function registerAgent(name: string, description: string) {
  logger.info("[ERC-8004] Registering agent...");

  const sdk = getSdk(process.env.MANAGER_PRIVATE_KEY as string);
  const agent = sdk.createAgent(name, description);
  const tx = await agent.registerIPFS();
  logger.info(`[ERC-8004] TX: ${tx.hash}`);

  const { result: registrationFile } = await tx.waitConfirmed();
  logger.info(`[ERC-8004] Agent ID: ${registrationFile.agentId}`);
  logger.info(`[ERC-8004] Agent URI: ${registrationFile.agentURI}`);
}

export async function giveAgentFeedback(agentId: string, value: number) {
  logger.info("[ERC-8004] Giving feedback to agent...");

  const sdk = getSdk(process.env.REVIEWER_PRIVATE_KEY as string);
  const tx = await sdk.giveFeedback(
    `${erc8004Config.chain.id}:${agentId}`,
    value,
  );
  logger.info(`[ERC-8004] TX: ${tx.hash}`);

  const { result: feedbackFile } = await tx.waitConfirmed();
  logger.info(`[ERC-8004] ID: ${feedbackFile.id}`);
}

function getSdk(privateKey: string) {
  return new SDK({
    chainId: erc8004Config.chain.id,
    rpcUrl: erc8004Config.chain.rpcUrls.default.http[0],
    privateKey: privateKey,
    ipfs: "pinata",
    pinataJwt: process.env.PINATA_JWT as string,
  });
}
