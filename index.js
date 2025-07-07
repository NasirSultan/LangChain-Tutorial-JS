import 'dotenv/config';
import readline from 'readline';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { reverseTool } from "./tools/reverseTool.js";
import { addTool } from "./tools/mathTool.js";
import { ToolMessage } from "@langchain/core/messages";

// Init Gemini
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const modelWithTools = model.bindTools([reverseTool, addTool]);

// Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user
rl.question("💬 Ask me something (e.g., reverse 'hello' or add 5 and 3): ", async (userInput) => {
  const messages = [
    ["system", "You are a helpful assistant that can use tools like reverseString and add."],
    ["human", userInput],
  ];

  // Step 1: Gemini first call
  const firstResponse = await modelWithTools.invoke(messages);
  const toolCalls = firstResponse.tool_calls || firstResponse.additional_kwargs?.tool_calls;

  if (toolCalls?.length > 0) {
    const toolCall = toolCalls[0];
    const toolName = toolCall.name;
    const args = toolCall.args;

    let toolResult;

    // Step 2: Call correct tool
    if (toolName === "reverseString") {
      toolResult = await reverseTool.invoke(args);
    } else if (toolName === "add") {
      toolResult = await addTool.invoke(args);
    } else {
      console.error("❌ Unknown tool called:", toolName);
      rl.close();
      return;
    }

    // Step 3: Send tool result back to Gemini
    const toolMessage = new ToolMessage({
      tool_call_id: toolCall.id,
      content: toolResult,
    });

    const finalResponse = await model.invoke([
      ...messages,
      firstResponse,
      toolMessage,
    ]);

    console.log("✅ Final Gemini Output:", finalResponse.content);
  } else {
    // No tool used
    console.log("🧠 Gemini Output:", firstResponse.content);
  }

  rl.close(); // End input
});
