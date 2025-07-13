import 'dotenv/config';
import { ChatMistralAI } from "@langchain/mistralai";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { evaluate } from "mathjs";

// Custom tools
const getMyInfo = new DynamicStructuredTool({
  name: "getMyInfo",
  description: "Return developer’s skills",
  schema: z.object({ query: z.string() }),
  func: ({ query }) => query === "skills" ? "JavaScript, Node.js, React, AI, LangChain" : "Unknown",
});
const mathTool = new DynamicStructuredTool({
  name: "mathCalculator",
  description: "Evaluate math expressions",
  schema: z.object({ expression: z.string() }),
  func: ({ expression }) => {
    try {
      return `Result: ${evaluate(expression)}`;
    } catch (e) {
      return `Error: ${e.message}`;
    }
  },
});
const tools = [getMyInfo, mathTool];

// LLM setup
const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

// Create executor
const executor = await PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm,
  tools,
  verbose: true
});

// Invoke
const result = await executor.invoke({
  input: "Get my skills and calculate 13 * 7.",
});

console.log("\n✅ Result:\n", result);
