import { StateGraph, NodeInterrupt } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Please set the GEMINI_API_KEY environment variable.");
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const StateAnnotation = {
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  nextRepresentative: z.string().optional(),
  refundAuthorized: z.boolean().optional(),
};


const formatMessages = (messages) => messages.map((m) => ({
  role: m.role === "assistant" ? "model" : "user",
  parts: [{ text: m.content }],
}));


const initialSupport = async (state) => {
  const last = state.messages.at(-1)?.content.toLowerCase() || "";
  if (last.includes("refund") || last.includes("charge")) {
    return { nextRepresentative: "BILLING" };
  } else if (last.includes("not working") || last.includes("error")) {
    return { nextRepresentative: "TECHNICAL" };
  } else {
    return { nextRepresentative: "GENERAL" };
  }
};

const billingSupport = async (state) => {
  const SYSTEM = `You are a billing expert at LangCorp. You can initiate a refund if needed. Be concise.`;

  const geminiResponse = await model.generateContent({
    contents: [
      { role: "system", parts: [{ text: SYSTEM }] },
      ...formatMessages(state.messages),
    ],
  });

  const reply = geminiResponse.response.text().trim();
  const wantsRefund = /refund/i.test(reply);

  return {
    messages: { role: "assistant", content: reply },
    nextRepresentative: wantsRefund ? "REFUND" : "RESPOND",
  };
};

const technicalSupport = async (state) => {
  const SYSTEM = `You are a technical support expert at LangCorp. Be concise.`;

  const geminiResponse = await model.generateContent({
    contents: [
      { role: "system", parts: [{ text: SYSTEM }] },
      ...formatMessages(state.messages),
    ],
  });

  return {
    messages: { role: "assistant", content: geminiResponse.response.text().trim() },
  };
};

const handleRefund = async (state) => {
  if (!state.refundAuthorized) {
    throw new NodeInterrupt("Refund needs manager approval.");
  }
  return {
    messages: { role: "assistant", content: "Refund processed successfully!" },
  };
};


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


const inputState = {
  messages: [
    { role: "user", content: "I was overcharged. I want a refund." }
  ],
  refundAuthorized: false, // change to true to allow refund
};

const run = async () => {
  try {
    const result = await app.invoke(inputState);
    console.log("\n Final State:\n", result);
  } catch (err) {
    if (err instanceof NodeInterrupt || err.name === "NodeInterrupt") {
      console.warn("\n HUMAN REVIEW NEEDED:", err.message);
    } else {
      console.error("\n Error:", err);
    }
  }
};

run();
