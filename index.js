import 'dotenv/config';
import readline from 'readline';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { reverseTool } from "./tools/reverseTool.js";
import { addTool } from "./tools/mathTool.js";
import { ToolMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

const modelWithTools = model.bindTools([reverseTool, addTool]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your question: ", async (userInput) => {
  const messages = [
    ["system", "You can use tools like reverseString and add."],
    ["human", userInput],
  ];

  const firstResponse = await modelWithTools.invoke(messages);
  const toolCalls = firstResponse.tool_calls || firstResponse.additional_kwargs?.tool_calls;

  if (toolCalls?.length > 0) {
    const toolMessages = [];

    for (const toolCall of toolCalls) {
      const { name, args, id } = toolCall;

      let toolResult;
      if (name === "reverseString") {
        toolResult = await reverseTool.invoke(args);
      } else if (name === "add") {
        toolResult = await addTool.invoke(args);
      } else {
        continue;
      }

      toolMessages.push(
        new ToolMessage({
          tool_call_id: id,
          content: toolResult,
        })
      );
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
