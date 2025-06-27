// index.js
import readline from "readline";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { Log } from "./logs.js";

// 1. Connect to MongoDB
await mongoose.connect("mongodb+srv://rainasirsultan123:1234qwer@cluster0.k5gcf.mongodb.net/restoDB?retryWrites=true&w=majority");

// 2. Gemini setup
const genAI = new GoogleGenerativeAI("AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. LangGraph schema
const stateSchema = z.object({
  messages: z.array(z.string())
});

// 4. Node function for handling questions
const answerQuestion = async (state) => {
  const userQ = state.messages.at(-1);

  // Let Gemini infer the intent
  const intentRes = await model.generateContent(`User asked: "${userQ}". Reply only with: list_products or get_price:<productName>`);
  const intent = (await intentRes.response.text()).trim();

  let result = [];

  // 🟢 Handle product listing without aggregation
  if (intent === "list_products") {
    const logs = await Log.find({}).sort({ timestamp: -1 });

    const productMap = new Map();
    for (const log of logs) {
      const pid = log.product.toString();
      if (!productMap.has(pid)) {
        if (log.action !== "delete") {
          productMap.set(pid, {
            name: log.productSnapshot.name,
            price: log.productSnapshot.price,
            totalAmount: log.productSnapshot.totalAmount
          });
        }
      }
    }

    result = [...productMap.values()];
  }

  // 🟡 Handle specific product price query
  if (intent.startsWith("get_price:")) {
    const name = intent.split(":")[1].trim().toLowerCase();
    const logs = await Log.find({ "productSnapshot.name": { $regex: new RegExp(`^${name}$`, "i") } })
                          .sort({ timestamp: -1 });

    for (const log of logs) {
      if (log.action !== "delete") {
        result = [{
          name: log.productSnapshot.name,
          price: log.productSnapshot.price,
        }];
        break;
      }
    }
  }

  const finalAnswer = await model.generateContent(`Question: ${userQ}\nProduct Data: ${JSON.stringify(result)}\nGive user-friendly answer.`);

  return {
    messages: [...state.messages, await finalAnswer.response.text()]
  };
};

// 5. Build the graph
const graph = new StateGraph({ state: stateSchema });
graph.addNode("askGemini", answerQuestion);
graph.setEntryPoint("askGemini");

const compiled = graph.compile();

// 6. CLI interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🧠 Ask anything about products. Type 'bye' to exit.");

const loop = async () => {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "bye") return rl.close();
    const result = await compiled.invoke({ messages: [input] });
    console.log("Bot:", result.messages.at(-1));
    loop();
  });
};

loop();
