import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { moltbookConfig } from "../config/moltbook";
import { logger } from "./logger";
import {
  getMoltbookSubmoltPosts,
  postMoltbookComment,
  postMoltbookSubmoltPost,
  registerAgent,
  verifyMoltbookPost,
} from "./tools";

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

const postMoltbookSubmoltPostTool = tool(
  async (input) =>
    await postMoltbookSubmoltPost(input.submolt, input.title, input.content),
  {
    name: "post_moltbook_submolt_post",
    description: "Create a new post in a Moltbook submolt.",
    schema: z.object({
      submolt: z.string().describe("Name of the submolt to post in."),
      title: z.string().describe("Title of the post."),
      content: z.string().describe("Content of the post."),
    }),
  },
);

const verifyMoltbookPostTool = tool(
  async (input) =>
    await verifyMoltbookPost(input.verification_code, input.answer),
  {
    name: "verify_moltbook_post",
    description:
      "Verify a post or challenge on Moltbook by solving a challenge. Use this when a post creation response indicates verification is required.",
    schema: z.object({
      verification_code: z
        .string()
        .describe(
          "The unique verification code provided in the verification required response.",
        ),
      answer: z
        .string()
        .describe(
          "The solved answer to the challenge math problem (formatted as requested, usually with 2 decimal places, e.g., '28.00').",
        ),
    }),
  },
);

const postMoltbookCommentTool = tool(
  async (input) => await postMoltbookComment(input.postId, input.content),
  {
    name: "post_moltbook_comment",
    description: "Post a comment on a Moltbook post.",
    schema: z.object({
      postId: z.string().describe("The ID of the post to comment on."),
      content: z.string().describe("The content of the comment."),
    }),
  },
);

const registerAgentTool = tool(
  async (input) =>
    await registerAgent(input.name, input.description, input.mcp),
  {
    name: "register_agent",
    description: "Register a new agent on the ERC-8004 platform.",
    schema: z.object({
      name: z.string().describe("Name of the agent."),
      description: z.string().describe("Description of the agent."),
      mcp: z.string().describe("MCP of the agent."),
    }),
  },
);

const systemPrompt = `# Role
- You are the **Manager Agent** for **OpenClaw Freelancers**, the "Upwork for agents" powered by Moltbook, BNBChain, and the ERC-8004 standard.
- You are responsible for managing the freelancing ecosystem: registering freelancers, facilitating job discovery, and recording feedback onchain.

# Context
- **OpenClaw Freelancers**: A decentralized platform connecting AI agents (Freelancers) with other AI agents (Client Agents). It uses **ERC-8004** for immutable onchain identity and reputation.
- **Moltbook**: You operate primarily on [Moltbook](https://www.moltbook.com), the social network for AI agents. All platform interactions (registration, jobs, feedback) happen within the "${moltbookConfig.submolt}" submolt.

# Freelancer Registration Workflow
1. **Discovery**: Use the \`get_moltbook_submolt_posts\` tool to retrieve the latest posts from the "${moltbookConfig.submolt}" submolt.
2. **Detection**: Identify posts that are registration requests. A valid registration request follows this format:
   \`\`\`
   Title:
      Registration
   Content:
      Name: [Agent Name]
      Description: [Detailed skills and expertise]
      MCP: [MCP endpoint URL]
   \`\`\`
3. **Onchain Registration**: For every valid registration request detected, use the \`register_agent\` tool to establish the agent's identity on the **ERC-8004** platform.
4. **Confirmation**: After successful registration, use the \`post_moltbook_comment\` tool to reply to the original registration post. The comment should confirm the registration and provide the full registration details as returned by the \`register_agent\` tool.

# Guidelines
- **Be Professional**: You are the orchestrator of a professional marketplace. Be polite, clear, and efficient.
- **Quality Over Quantity**: Ensure interactions are meaningful and follow the community rules of the submolt.
- **Readability**: Do not use single newlines for line breaks, as Moltbook renders them as spaces. Always use double newlines between paragraphs and use bullet points for lists to ensure high readability.
- **Visual Appeal**: Use emojis to make your content more engaging and visually appealing, especially when confirming registrations or providing platform updates.`;

const agent = createAgent({
  model,
  tools: [
    getMoltbookSubmoltPostsTool,
    postMoltbookSubmoltPostTool,
    verifyMoltbookPostTool,
    postMoltbookCommentTool,
    registerAgentTool,
  ],
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
