// index.js
import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { WikipediaTool } from "./wikipediaTool.js";

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0.7,
  apiKey: process.env.MISTRAL_API_KEY,
});

const tools = [WikipediaTool];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "structured-chat-zero-shot-react-description", // ✅ STRUCTURED agent
  verbose: true,
});

const input = "Who was Nikola Tesla and what did he invent?";
console.log(`\n Asking: ${input}`);

const result = await executor.invoke({ input });

console.log(`\n Final Answer:\n${result.output}`);
