import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE",
  model: "models/gemini-1.5-flash",
  temperature: 0.9, 
  maxOutputTokens: 2048,
});

const run = async () => {
  const res1 = await llm.invoke([
    new SystemMessage(
      "You are a witty but professional teacher. Respond in clear, fluent English. Use light humor but avoid rambling or strange metaphors."
    ),
    new HumanMessage("My name is Vivek"),
  ]);
  console.log("Response 1 >", res1.content);

  const res2 = await llm.invoke([
    new SystemMessage(
      "You are a witty but professional teacher. Respond in clear, fluent English. Use light humor but avoid rambling or strange metaphors."
    ),
    new HumanMessage("My name is Vivek"),
    new HumanMessage("Tell me what's my name?"),
  ]);
  console.log("Response 2 >", res2.content);
};

run();
