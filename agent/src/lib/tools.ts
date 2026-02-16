import axios from "axios";
import { moltbookConfig } from "../config/moltbook";
import {
  getErc8004AgentExplorerLink,
  getErc8004AgentReputationSummary,
  getErc8004Agents,
  giveErc8004AgentFeedback,
  registerErc8004Agent,
} from "./erc8004";
import { getErrorString } from "./error";
import { logger } from "./logger";

export async function getMoltbookSubmoltPosts(
  submolt: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting Moltbook submolt posts, submolt: ${submolt}...`,
    );

    const { data } = await axios.get(
      `https://www.moltbook.com/api/v1/posts?submolt=${submolt}&sort=new&limit=${moltbookConfig.getPostsLimit}`,
      { headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` } },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`,
    );
    return `Failed to get Moltbook submolt posts, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookSubmoltPost(
  submolt: string,
  title: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting Moltbook submolt post, submolt: ${submolt}, title: ${title}, content: ${content}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts`,
      {
        submolt,
        title,
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post Moltbook submolt post, error: ${getErrorString(error)}`,
    );
    return `Failed to post Moltbook submolt post, error: ${getErrorString(error)}`;
  }
}

export async function verifyMoltbookPost(
  verification_code: string,
  answer: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Verifying Moltbook post, verification_code: ${verification_code}, answer: ${answer}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/verify`,
      {
        verification_code,
        answer,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to verify Moltbook post, error: ${getErrorString(error)}`,
    );
    return `Failed to verify Moltbook post, error: ${getErrorString(error)}`;
  }
}

export async function postMoltbookComment(
  post: string,
  content: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Posting Moltbook comment, post: ${post}, content: ${content}...`,
    );

    const { data } = await axios.post(
      `https://www.moltbook.com/api/v1/posts/${post}/comments`,
      {
        content,
      },
      {
        headers: { Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}` },
      },
    );

    return JSON.stringify(data);
  } catch (error) {
    logger.error(
      `[Tools] Failed to post Moltbook comment, error: ${getErrorString(error)}`,
    );
    return `Failed to post Moltbook comment, error: ${getErrorString(error)}`;
  }
}

export async function registerAgent(
  name: string,
  description: string,
  mcp: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Registering agent, name: ${name}, description: ${description}, mcp: ${mcp}...`,
    );

    const registrationFile = await registerErc8004Agent(name, description, mcp);

    return JSON.stringify(registrationFile);
  } catch (error) {
    logger.error(
      `[Tools] Failed to register agent, error: ${getErrorString(error)}`,
    );
    return `Failed to register agent, error: ${getErrorString(error)}`;
  }
}

export async function giveAgentFeedback(
  agentId: string,
  value: number,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Giving feedback to agent, agentId: ${agentId}, value: ${value}...`,
    );

    const feedback = await giveErc8004AgentFeedback(agentId, value);

    return JSON.stringify(feedback);
  } catch (error) {
    logger.error(
      `[Tools] Failed to give feedback to agent, error: ${getErrorString(error)}`,
    );
    return `Failed to give feedback to agent, error: ${getErrorString(error)}`;
  }
}

export async function getAgents(): Promise<string> {
  try {
    logger.info(`[Tools] Getting agents...`);

    const agents = await getErc8004Agents();

    return JSON.stringify(agents);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get agents, error: ${getErrorString(error)}`,
    );
    return `Failed to get agents, error: ${getErrorString(error)}`;
  }
}

export async function getAgentReputationSummary(
  agentId: string,
): Promise<string> {
  try {
    logger.info(
      `[Tools] Getting agent reputation summary, agentId: ${agentId}...`,
    );

    const reputationSummary = await getErc8004AgentReputationSummary(agentId);

    return JSON.stringify(reputationSummary);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get agent reputation summary, error: ${getErrorString(error)}`,
    );
    return `Failed to get agent reputation summary, error: ${getErrorString(error)}`;
  }
}

export async function getAgentExplorerLink(agentId: string): Promise<string> {
  try {
    logger.info(`[Tools] Getting agent explorer link, agentId: ${agentId}...`);

    const explorerLink = getErc8004AgentExplorerLink(agentId);

    return JSON.stringify(explorerLink);
  } catch (error) {
    logger.error(
      `[Tools] Failed to get agent explorer link, error: ${getErrorString(error)}`,
    );
    return `Failed to get agent explorer link, error: ${getErrorString(error)}`;
  }
}
