import "dotenv/config"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; 
import { tool } from "@langchain/core/tools";
import { z } from "zod";
const llm= new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", // or "gemini-pro"
  temperature: 0.7,
});


const add = tool(
  (input) => {
    return `${input.a + input.b}`;
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

const multiply = tool(
  (input) => {
    return `${input.a * input.b}`;
  },
  {
    name: "Multiply",
    description: "Multiplies a and b.",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);

const tools = [add, multiply];

const llmForcedToMultiply = llm.bindTools(tools, {
  tool_choice: "Multiply",
});
const multiplyResult = await llmForcedToMultiply.invoke("what is 2 + 4");
console.log(JSON.stringify(multiplyResult.tool_calls, null, 2));