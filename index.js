import 'dotenv/config';
import readline from 'readline';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ToolMessage } from "@langchain/core/messages";

// Import tools
import { reverseTool } from "./tools/reverseTool.js";
import { addTool } from "./tools/mathTool.js";
import { webTool } from "./tools/webTool.js";

// Tool map for dynamic access
const toolMap = {
  [reverseTool.name]: reverseTool,
  [addTool.name]: addTool,
  [webTool.name]: webTool,
};

const tools = Object.values(toolMap);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const modelWithTools = model.bindTools(tools);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your prompt: ", async (userInput) => {
  const messages = [
    ["system", "You are a helpful assistant that uses tools like reverseString, add, and web search."],
    ["human", userInput],
  ];

  const firstResponse = await modelWithTools.invoke(messages);
  const toolCalls = firstResponse.tool_calls || [];

  if (toolCalls.length > 0) {
    const toolMessages = [];

    for (const call of toolCalls) {
      const { name, args, id } = call;
      const tool = toolMap[name];

      if (!tool) {
        console.warn(`Tool not found: ${name}`);
        continue;
      }

      const result = await tool.invoke(args);
      toolMessages.push(new ToolMessage({ tool_call_id: id, content: result }));
    }

    const finalResponse = await model.invoke([
      ...messages,
      firstResponse,
      ...toolMessages,
    ]);

    console.log(finalResponse.content);
  } else {
    console.log(firstResponse.content);
  }

  rl.close();
});
