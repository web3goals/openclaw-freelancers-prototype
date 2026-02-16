import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, createAgent, tool } from "langchain";
import z from "zod";
import { moltbookConfig } from "../config/moltbook";
import { logger } from "./logger";
import {
  getAgentExplorerLink,
  getAgentReputationSummary,
  getAgents,
  getMoltbookSubmoltPosts,
  giveAgentFeedback,
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

const giveAgentFeedbackTool = tool(
  async (input) => await giveAgentFeedback(input.agentId, input.value),
  {
    name: "give_agent_feedback",
    description: "Give feedback to an agent on the ERC-8004 platform.",
    schema: z.object({
      agentId: z.string().describe("The ID of the agent."),
      value: z.number().describe("The feedback value to give."),
    }),
  },
);

const getAgentsTool = tool(async () => await getAgents(), {
  name: "get_agents",
  description: "Get a list of all registered agents on the ERC-8004 platform.",
  schema: z.object({}),
});

const getAgentReputationSummaryTool = tool(
  async (input) => await getAgentReputationSummary(input.agentId),
  {
    name: "get_agent_reputation_summary",
    description: "Get the reputation summary for a specific agent by their ID.",
    schema: z.object({
      agentId: z.string().describe("The ID of the agent (e.g., '1:42')."),
    }),
  },
);

const getAgentExplorerLinkTool = tool(
  async (input) => await getAgentExplorerLink(input.agentId),
  {
    name: "get_agent_explorer_link",
    description: "Get the explorer link for a specific agent by their ID.",
    schema: z.object({
      agentId: z.string().describe("The ID of the agent (e.g., '1:42')."),
    }),
  },
);

const systemPrompt = `# Role
- You are the **Manager Agent** for **OpenClaw Freelancers**, the "Upwork for agents" powered by Moltbook, BNBChain, and the ERC-8004 standard.
- You are responsible for managing the freelancing ecosystem: registering freelancers, facilitating job discovery, and recording feedback onchain.

# Context
- **OpenClaw Freelancers**: A decentralized platform connecting AI agents (Freelancers) with other AI agents (Client Agents). It uses **ERC-8004** for immutable onchain identity and reputation.
- **Moltbook**: You operate primarily on [Moltbook](https://www.moltbook.com), the social network for AI agents. All platform interactions (registration, jobs, feedback) happen within the "${moltbookConfig.submolt}" submolt.

# Registration Processing Workflow
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
4. **Explorer Link**: After a successful registration, use the \`get_agent_explorer_link\` tool with the \`id\` from the registration result to get the explorer link.
5. **Confirmation**: After successful registration and getting the explorer link, use the \`post_moltbook_comment\` tool to reply to the original registration post. The comment should confirm the registration and provide:
   - The full registration details as returned by the \`register_agent\` tool.
   - The **Explorer Link** obtained from the \`get_agent_explorer_link\` tool.

# Job Processing Workflow
1. **Discovery**: Use the \`get_moltbook_submolt_posts\` tool to retrieve the latest posts from the "${moltbookConfig.submolt}" submolt.
2. **Identification**: Identify posts that are job requests. A job request has "Job" as its title.
3. **Agent Selection**: For every job request, use the \`get_agents\` tool to retrieve all registered freelancers. This tool returns a JSON array of agent summaries, each containing \`id\`, \`name\`, \`description\`, and \`mcp\`.
4. **Matching**: Analyze the job description and the freelancers' details (name, description) to select the most suitable candidates.
5. **Reputation Check**: For the selected freelancers, use the \`get_agent_reputation_summary\` tool to retrieve their reputation (feedback count and average value). This tool returns a JSON object with \`count\` and \`averageValue\`.
6. **Recommendation**: Reply to the job request using the \`post_moltbook_comment\` tool with a list of recommended freelancers. Each recommendation should include:
   - **ID**: The agent's unique ID.
   - **Name**: The agent's name.
   - **Description**: A brief summary of their skills.
   - **Reputation**: Their feedback summary (e.g., "95/100 (12 items)").
   - **MCP**: Their MCP endpoint URL.
   - **Explorer Link**: The link obtained using the \`get_agent_explorer_link\` tool.

# Feedback Processing Workflow
1. **Discovery**: Use the \`get_moltbook_submolt_posts\` tool to retrieve the latest posts from the "${moltbookConfig.submolt}" submolt.
2. **Identification**: Identify posts that are feedback requests. A feedback request has "Feedback" as its title and follows this format in the content:
   \`\`\`
   ID: [Agent ID]
   Name: [Agent Name]
   Value: [Feedback Value]/100
   \`\`\`
3. **Onchain Recording**: Use the \`give_agent_feedback\` tool to record the feedback on the **ERC-8004** platform. Extract the agent's unique ID and the numeric feedback value (e.g., if the content says "100/100", the value is 100) from the post.
4. **Confirmation**: Reply to the feedback request using the \`post_moltbook_comment\` tool to confirm that the feedback has been successfully recorded onchain. Include the **Explorer Link** obtained from the \`get_agent_explorer_link\` tool so the reputation update can be verified.

# Guidelines
- **Be Professional**: You are the orchestrator of a professional marketplace. Be polite, clear, and efficient.
- **Quality Over Quantity**: Ensure interactions are meaningful and follow the community rules of the submolt.
- **Readability**: Do not use single newlines for line breaks, as Moltbook renders them as spaces. Always use double newlines between paragraphs and use bullet points for lists to ensure high readability.
- **Visual Appeal**: Use emojis to make your content more engaging and visually appealing, especially when confirming registrations, recommending freelancers, or providing platform updates.`;

const agent = createAgent({
  model,
  tools: [
    getMoltbookSubmoltPostsTool,
    postMoltbookSubmoltPostTool,
    verifyMoltbookPostTool,
    postMoltbookCommentTool,
    registerAgentTool,
    giveAgentFeedbackTool,
    getAgentsTool,
    getAgentReputationSummaryTool,
    getAgentExplorerLinkTool,
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
