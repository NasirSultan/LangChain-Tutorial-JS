import "dotenv/config";
import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatMistralAI } from "@langchain/mistralai";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

// Tools
const add = tool(
  async (args) => args.a + args.b,
  {
    name: "add",
    description: "Add two numbers.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiply = tool(
  async (args) => args.a * args.b,
  {
    name: "multiply",
    description: "Multiply two numbers.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const webSearch = tool(
  async (args) => {
    return (
      "Here are the headcounts for each of the FAANG companies in 2024:\n" +
      "1. Facebook (Meta): 67,317 employees.\n" +
      "2. Apple: 164,000 employees.\n" +
      "3. Amazon: 1,551,000 employees.\n" +
      "4. Netflix: 14,000 employees.\n" +
      "5. Google (Alphabet): 181,269 employees."
    );
  },
  {
    name: "web_search",
    description: "Search the web for information.",
    schema: z.object({
      query: z.string(),
    }),
  }
);

// Agents
const mathAgent = createReactAgent({
  llm: model,
  tools: [add, multiply],
  name: "math_agent",
  prompt: "You are a math expert. Always use one tool at a time.",
});

const researchAgent = createReactAgent({
  llm: model,
  tools: [webSearch],
  name: "research_agent",
  prompt: "You are a world class researcher with access to web search. Do not do any math.",
});

// Supervisor
const supervisor = createSupervisor({
  agents: [researchAgent, mathAgent],
  llm: model,
  prompt: `
    You are a smart team supervisor managing a research agent and a math agent.
    First, use the research_agent to get the data (like headcounts).
    Then, use the math_agent to compute totals if needed.
    Finally, summarize and return the result to the user.`,
});

async function run() {
  const app = supervisor.compile();

  const result = await app.invoke(
    {
      messages: [
        {
          role: "user",
          content:
            "What's the combined headcount of the FAANG companies in 2024?",
        },
      ],
    },
    {
      configurable: {
        returnIntermediateSteps: true,
      },
    }
  );

  console.log(JSON.stringify(result, null, 2));
}

run();
