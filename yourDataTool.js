import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { DynamicStructuredTool } from "langchain/tools";

// ====== Custom Tool (Nasir's Profile Info) ======
const YourDataTool = new DynamicStructuredTool({
  name: "getMyInfo",
  description: "Returns developer profile info about Nasir (skills, projects, experience).",
  schema: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "A question related to Nasir's skills, experience, or projects",
      },
    },
    required: ["question"],
  },
  func: async ({ question }) => {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes("skills") || lowerQ.includes("stack")) {
      return `Nasir is a Full Stack Developer with expertise in the MERN stack (MongoDB, Express.js, React.js, Node.js), LangChain, LangGraph, Gemini AI, and deployment (Vercel, Hostinger, AWS).`;
    }

    if (lowerQ.includes("experience")) {
      return `Nasir has 1 year of real-world experience in web development and AI, including internships at Rhombix Technologies and Youngdiv, and freelance projects like an AI Interview & Resume Assistant platform.`;
    }

    if (lowerQ.includes("project")) {
      return `Some projects include:
1. AI Interview & Resume Assistant (LangChain, Gemini, React)
2. Food Ordering App (MERN + Stripe)
3. Vehicle Tracking System (Node.js, Express, MongoDB).`;
    }

    return `No relevant info found. Ask about skills, experience, or projects.`;
  },
});

// ====== Initialize Mistral Chat Model ======
const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  apiKey: process.env.MISTRAL_API_KEY,
});

// ====== Memory ======
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
});

// ====== Tools ======
const tools = [new Calculator(), YourDataTool];

// ====== Agent Executor ======
const executor = await initializeAgentExecutorWithOptions(
  tools,
  llm,
  {
    agentType: "chat-conversational-react-description",
    memory,
    verbose: true,
  }
);

// ====== Run Conversation ======
const res1 = await executor.call({ input: "What are Nasir's skills?" });
console.log("Agent:", res1.output);

const res2 = await executor.call({ input: "Tell me about his experience." });
console.log("Agent:", res2.output);

const res3 = await executor.call({ input: "What’s 100 + 50 then multiply by 2?" });
console.log("Agent:", res3.output);
