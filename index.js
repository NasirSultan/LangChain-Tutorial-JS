import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { DynamicTool } from "langchain/tools";
import { evaluate } from "mathjs";


// ===== Calculator Tool =====
const Calculator = new DynamicTool({
  name: "calculator",
  description: "Evaluates basic math expressions like 2 + 3 * 5 or (10 + 5) / 2.",
  func: async (input) => {
    try {
      const result = evaluate(input);
      return `The result is ${result}`;
    } catch (err) {
      return "Invalid math expression.";
    }
  },
});


// ===== Mistral Model =====
const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  apiKey: process.env.MISTRAL_API_KEY,
});


// ===== Memory =====
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});


// ===== Agent Executor =====
const tools = [Calculator];

const executor = await initializeAgentExecutorWithOptions(
  tools,
  llm,
  {
    agentType: "chat-conversational-react-description",
    memory,
    verbose: true,
  }
);


const res1 = await executor.call({ input: "What is 25 + 75?" });
console.log(" Response 1:", res1.output);

const res2 = await executor.call({ input: "Multiply that by 2" });
console.log(" Response 2:", res2.output);
