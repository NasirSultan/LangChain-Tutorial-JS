import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { ChatMistralAI } from "@langchain/mistralai";

// Load tools
import { WikipediaTool } from "./wikipediaTool.js";
import { YourDataTool } from "./yourDataTool.js";

// Load prompt
const prompt = await pull("hwchase17/openai-functions-agent");

// Use Mistral model
const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});

// Tools
const tools = [WikipediaTool, YourDataTool];

// Create agent
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

// Agent executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

// Run agent
const result = await agentExecutor.invoke({
  input: "Tell me about Nasir's projects.",
});

console.log("Answer:", result);
