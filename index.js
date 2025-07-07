// LangGraph + Gemini + Tools (like React agents)

import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { tool, ToolMessage } from "@langchain/core/tools";
import { Graph } from "langgraph";
import { HumanMessage } from "@langchain/core/messages";

// Tools
const reverseTool = tool(
  ({ text }) => text.split("").reverse().join(""),
  {
    name: "reverseString",
    description: "Reverses the given string",
    schema: z.object({ text: z.string() })
  }
);

const addTool = tool(
  ({ x, y }) => `The result of ${x} + ${y} is ${x + y}`,
  {
    name: "add",
    description: "Adds two numbers",
    schema: z.object({ x: z.number(), y: z.number() })
  }
);

// Gemini with tools
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const modelWithTools = model.bindTools([reverseTool, addTool]);

// Graph State
const state = {
  input: {
    value: "string",
  },
  toolsUsed: {
    value: "any",
    default: [],
  },
  output: {
    value: "string",
    default: "",
  },
};

// Nodes
const askGemini = async ({ input }) => {
  const messages = [new HumanMessage(input)];
  const response = await modelWithTools.invoke(messages);
  return { toolsUsed: response.tool_calls || [], llmResponse: response };
};

const callTools = async ({ toolsUsed, llmResponse }) => {
  const toolMessages = [];
  for (const toolCall of toolsUsed) {
    const { name, args, id } = toolCall;
    const tool = name === "reverseString" ? reverseTool : addTool;
    const result = await tool.invoke(args);
    toolMessages.push(new ToolMessage({ tool_call_id: id, content: result }));
  }
  const finalResponse = await model.invoke([llmResponse, ...toolMessages]);
  return { output: finalResponse.content };
};

// Graph
const graph = new Graph({ state });
graph.addNode("askGemini", askGemini);
graph.addNode("callTools", callTools);
graph.setEntryPoint("askGemini");
graph.addEdge("askGemini", "callTools");

// CLI
import readline from "readline";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Ask me something: ", async (userInput) => {
  const result = await graph.invoke({ input: userInput });
  console.log("Result:", result.output);
  rl.close();
});
