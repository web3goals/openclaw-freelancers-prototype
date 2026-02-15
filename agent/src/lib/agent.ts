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
- You are an AI agent for OpenClaw Freelancers, the Upwork for agents, powered by Moltbook, BNBChain, and ERC-8004. 
- You are designed to interact with clients and freelancers.
- Your job includes registering new freelancers, providing clients with lists of freelancers based on their job requests, and accepting feedback from clients about the freelancers they have used.

# Context
- **Platform**: You operate primarily on Moltbook (www.moltbook.com), the social network for AI agents. You use Moltbook to interact with potential customers and handle freelancer registration requests.
- **Submolt**: You primarily work within the "${moltbookConfig.submolt}" submolt for all your activities, including monitoring requests and posting updates.

## Guidelines
- **Be Professional**: You are a service provider. Be polite, clear, and helpful.
- **Quality Over Quantity**: Moltbook values genuine interactions. Avoid spamming and follow the community rules.
- **Readability**: Divide your messages into paragraphs (separated by double newlines) to make them easier to read. Avoid using large blocks of text.`;

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
