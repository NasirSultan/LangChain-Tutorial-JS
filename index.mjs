import readline from "readline";
import { StateGraph, NodeInterrupt } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Gemini Setup
const GEMINI_API_KEY = "AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// State schema
const StateAnnotation = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  nextRepresentative: z.string().optional(),
  refundAuthorized: z.boolean().optional(),
});

// Helper
const combineMessages = (systemPrompt, messages) => {
  return `INSTRUCTIONS:\n${systemPrompt}\n\nCONVERSATION:\n` +
    messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
};

// Nodes
const initialSupport = async (state) => {
  const last = state.messages.at(-1)?.content.toLowerCase() || "";
  if (last.includes("refund") || last.includes("charge")) return { nextRepresentative: "BILLING" };
  if (last.includes("not working") || last.includes("error")) return { nextRepresentative: "TECHNICAL" };
  return { nextRepresentative: "GENERAL" };
};

const billingSupport = async (state) => {
  const prompt = combineMessages("You are a billing expert at LangCorp.", state.messages);
  const response = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
  const reply = response.response.text().trim();
  const wantsRefund = /refund/i.test(reply);
  return {
    messages: { role: "assistant", content: reply },
    nextRepresentative: wantsRefund ? "REFUND" : "RESPOND",
  };
};

const technicalSupport = async (state) => {
  const prompt = combineMessages("You are a technical expert at LangCorp.", state.messages);
  const response = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
  const reply = response.response.text().trim();
  return { messages: { role: "assistant", content: reply } };
};

const handleRefund = async (state) => {
  if (!state.refundAuthorized) throw new NodeInterrupt("Refund needs human authorization.");
  return {
    messages: { role: "assistant", content: "Refund processed successfully!" },
  };
};

// LangGraph
let builder = new StateGraph(StateAnnotation)
  .addNode("initial_support", initialSupport)
  .addNode("billing_support", billingSupport)
  .addNode("technical_support", technicalSupport)
  .addNode("handle_refund", handleRefund)
  .addEdge("__start__", "initial_support");

builder = builder.addConditionalEdges("initial_support", async (state) => {
  const next = state.nextRepresentative;
  if (next === "BILLING") return "billing";
  if (next === "TECHNICAL") return "technical";
  return "end";
}, {
  billing: "billing_support",
  technical: "technical_support",
  end: "__end__",
});

builder = builder.addConditionalEdges("billing_support", async (state) => {
  return state.nextRepresentative === "REFUND" ? "refund" : "end";
}, {
  refund: "handle_refund",
  end: "__end__",
});

const app = builder.compile();

// Chat Loop Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let state = {
  messages: [],
  refundAuthorized: false,
};

const promptUser = () => {
  rl.question("\nYou: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    state.messages.push({ role: "user", content: input });

    try {
      const result = await app.invoke(state);

      // Push response to state
      state.messages.push(result.messages);

      console.log(`Bot: ${result.messages.content}`);

      // If refund was interrupted
      if (result.__interrupt__) {
        const ask = await askUser("Manager authorization required. Type 'yes' to approve: ");
        if (ask.toLowerCase() === "yes") {
          state.refundAuthorized = true;
          const retryResult = await app.invoke(state);
          state.messages.push(retryResult.messages);
          console.log(`Bot: ${retryResult.messages.content}`);
        }
      }

    } catch (err) {
      if (err instanceof NodeInterrupt || err.name === "NodeInterrupt") {
        console.log("Bot:", err.message);
      } else {
        console.error("Error:", err);
      }
    }

    promptUser();
  });
};

function askUser(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

// Start chat
console.log("LangCorp AI Support Bot\nType 'exit' to quit.");
promptUser();
