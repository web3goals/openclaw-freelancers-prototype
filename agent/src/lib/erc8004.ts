import { AgentSummary, SDK } from "agent0-sdk";
import { erc8004Config } from "../config/erc8004";
import { logger } from "./logger";

export async function registerErc8004Agent(
  name: string,
  description: string,
  mcp: string,
): Promise<{ id: string | undefined; explorerLink: string | undefined }> {
  logger.info("[ERC-8004] Registering agent...");

  const sdk = getSdk(process.env.MANAGER_PRIVATE_KEY as string);
  const agent = sdk.createAgent(name, description);
  await agent.setMCP(mcp);
  const tx = await agent.registerIPFS();
  logger.info(`[ERC-8004] TX: ${tx.hash}`);

  const { result: registrationFile } = await tx.waitConfirmed();
  logger.info(`[ERC-8004] Agent ID: ${registrationFile.agentId}`);
  logger.info(`[ERC-8004] Agent URI: ${registrationFile.agentURI}`);

  return {
    id: registrationFile.agentId,
    explorerLink: getErc8004AgentExplorerLink(registrationFile.agentId),
  };
}

export async function giveErc8004AgentFeedback(
  agentId: string,
  value: number,
): Promise<void> {
  logger.info("[ERC-8004] Giving feedback to agent...");

  const sdk = getSdk(process.env.REVIEWER_PRIVATE_KEY as string);
  const tx = await sdk.giveFeedback(agentId, value);
  logger.info(`[ERC-8004] TX: ${tx.hash}`);

  const { result: feedback } = await tx.waitConfirmed();
  logger.info(`[ERC-8004] Feedback ID: ${feedback.id}`);
}

export async function getErc8004Agents(): Promise<AgentSummary[]> {
  logger.info("[ERC-8004] Getting agents...");

  const sdk = getSdk();
  const agentSummaries = await sdk.searchAgents({
    owners: [process.env.MANAGER_ADDRESS as string],
  });
  logger.info(`[ERC-8004] Found ${agentSummaries.length} agents`);

  return agentSummaries;
}

export async function getErc8004AgentReputationSummary(
  agentId: string,
): Promise<{ count: number; averageValue: number }> {
  logger.info("[ERC-8004] Getting agent reputation summary...");

  const sdk = getSdk();
  const { count, averageValue } = await sdk.getReputationSummary(agentId);
  logger.info(
    `[ERC-8004] Agent ${agentId} has ${count} feedback entries with an average value of ${averageValue}`,
  );

  return { count, averageValue };
}

function getSdk(privateKey?: string): SDK {
  return new SDK({
    chainId: erc8004Config.chain.id,
    rpcUrl: erc8004Config.chain.rpcUrls.default.http[0],
    ...(privateKey ? { privateKey } : {}),
    ipfs: "pinata",
    pinataJwt: process.env.PINATA_JWT as string,
  });
}

function getErc8004AgentExplorerLink(agentId?: string): string | undefined {
  return agentId
    ? `${erc8004Config.explorer}/${agentId.split(":").pop()}`
    : undefined;
}
