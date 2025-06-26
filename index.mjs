// agent.js

// IMPORTANT - Add your API keys here. Be careful not to publish them.

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

// Define the tools for the agent to use
const tools = [new TavilySearchResults({ maxResults: 3 })];
const toolNode = new ToolNode(tools);

// Create a model and give it access to the tools
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash",
  temperature: 0.7,
});

// Function to determine whether to continue or not
function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1];

  // If the LLM makes a tool call, route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, stop using the special "__end__" node
  return "__end__";
}

// Function that calls the model
async function callModel(state) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

// Define the workflow graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

// Compile it into a LangChain Runnable
const app = workflow.compile();

// Use the agent
const finalState = await app.invoke({
  messages: [new HumanMessage("what is the lahore")],
});
console.log(finalState.messages[finalState.messages.length - 1].content);

const nextState = await app.invoke({
  messages: [...finalState.messages, new HumanMessage("tell me about the pakistan team")],
});
console.log(nextState.messages[nextState.messages.length - 1].content);
