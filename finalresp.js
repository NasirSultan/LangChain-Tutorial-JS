import "dotenv/config";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";



const addTool = tool(
  async ({ a, b }) => a + b,
  {
    name: "add",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Adds a and b.",
  }
);

const multiplyTool = tool(
  async ({ a, b }) => a * b,
  {
    name: "multiply",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Multiplies a and b.",
  }
);



const wikiTool = tool(
  async ({ query }) => {
    const wiki = new WikipediaQueryRun();
    const result = await wiki.invoke(query);
    return result.length > 300 ? result.slice(0, 300) + "..." : result;
  },
  {
    name: "wiki_search",
    schema: z.object({
      query: z.string(),
    }),
    description: "Search Wikipedia for information on a topic.",
  }
);



const tools = [addTool, multiplyTool, wikiTool];



const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
});

const llmWithTools = llm.bindTools(tools);



const messages = [
  new HumanMessage("What is 3 * 12? Also, what is 11 + 49? And give me a summary about Pakistan."),
];



const aiMessage = await llmWithTools.invoke(messages);
console.log("\  firstResponse:\n", aiMessage);
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

console.log("\n💡 Final Answer:\n", finalAnswer);
