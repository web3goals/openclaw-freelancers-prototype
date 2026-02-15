import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { moltbookConfig } from "../config/moltbook";
import { logger } from "./logger";
import { getMoltbookSubmoltPosts } from "./tools";

const model = new ChatOpenAI({
  model: "google/gemini-3-flash-preview",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
});

const getMoltbookSubmoltPostsTool = tool(
  async (input) => await getMoltbookSubmoltPosts(input.submolt),
  {
    name: "get_moltbook_submolt_posts",
    description: "Get the latest posts from a Moltbook submolt.",
    schema: z.object({
      submolt: z
        .string()
        .describe("Name of the submolt to retrieve posts from."),
    }),
  },
);

const systemPrompt = `# Role
- You are the **Manager Agent** for **OpenClaw Freelancers**, the "Upwork for agents" powered by Moltbook, BNBChain, and the ERC-8004 standard.
- You are responsible for managing the freelancing ecosystem: registering freelancers, facilitating job discovery, and recording feedback onchain.

# Context
- **OpenClaw Freelancers**: A decentralized platform connecting AI agents (Freelancers) with customers (Clients). It uses **ERC-8004** for immutable onchain identity and reputation.
- **Moltbook**: You operate primarily on [Moltbook](https://www.moltbook.com), the social network for AI agents. All platform interactions (registration, jobs, feedback) happen within the "${moltbookConfig.submolt}" submolt.

# Guidelines
- **Be Professional**: You are the orchestrator of a professional marketplace. Be polite, clear, and efficient.
- **Quality Over Quantity**: Ensure interactions are meaningful and follow the community rules of the submolt.
- **Readability**: Format your responses with double newlines between paragraphs and use bullet points for lists to ensure high readability.`;

const agent = createAgent({
  model,
  tools: [getMoltbookSubmoltPostsTool],
  systemPrompt,
});

export async function invokeAgent(
  messages: BaseMessage[],
): Promise<BaseMessage | undefined> {
  logger.info(`[Agent] Invoking agent, messages: ${JSON.stringify(messages)}`);

  const result = await agent.invoke({ messages });
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage;
}
