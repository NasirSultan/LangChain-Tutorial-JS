import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";


import { addTool } from "./addTool.js";
import { multiplyTool } from "./multiplyTool.js";
import { wikiTool } from "./wikiTool.js";


const tools = [addTool, multiplyTool, wikiTool];

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
});

const llmWithTools = llm.bindTools(tools);


const messages = [
  new HumanMessage("What is 3 * 12? What is 11 + 49? Tell me about Pakistan."),
];


const aiMessage = await llmWithTools.invoke(messages);
messages.push(aiMessage);


const toolsByName = {
  add: addTool,
  multiply: multiplyTool,
  wiki_search: wikiTool,
};

for (const toolCall of aiMessage.tool_calls ?? []) {
  const selectedTool = toolsByName[toolCall.name];
  const toolMessage = await selectedTool.invoke(toolCall);
  messages.push(toolMessage);
}


const finalAnswer = await llmWithTools.invoke(messages);
console.log("\n Final Answer:\n", finalAnswer.content);
