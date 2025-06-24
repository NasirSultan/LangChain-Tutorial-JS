import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";


const chat = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE", 
  model: "models/gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
});


const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a friendly and helpful AI. Keep responses short and clear."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);


const chain = new ConversationChain({
  llm: chat,
  prompt: chatPrompt,
  memory: new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
  }),
});


const runChat = async () => {
  const res1 = await chain.call({ input: "Hi, my name is Ali." });
  console.log("Bot:", res1.response);

  const res2 = await chain.call({ input: "What’s my name?" });
  console.log("Bot:", res2.response);
};

runChat();
