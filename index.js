import 'dotenv/config'; // ES Modules
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; 
import { concat } from "@langchain/core/utils/stream";


const addTool = tool(
  async (input) => {
    return input.a + input.b;
  },
  {
    name: "add",
    description: "Adds a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const multiplyTool = tool(
  async (input) => {
    return input.a * input.b;
  },
  {
    name: "multiply",
    description: "Multiplies a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const tools = [addTool, multiplyTool];
const toolsByName = Object.fromEntries(tools.map((t) => [t.name, t]));
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", 
  temperature: 0.7,
});


const modelWithTools = model.bindTools(tools);
const query = "What is 3 * 12? Also, what is 11 + 49?";
let gathered = undefined;
const stream = await modelWithTools.stream(query);
for await (const chunk of stream) {
  gathered = gathered !== undefined ? concat(gathered, chunk) : chunk;
}

// 7. Now handle tool calls
for (const toolCall of gathered.tool_calls ?? []) {
  const tool = toolsByName[toolCall.name];
  const result = await tool.invoke(toolCall.args);
  console.log(`Tool '${toolCall.name}' result:`, result);
}