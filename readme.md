// IMPORTANT - Add your API keys here. Be careful not to publish them.
process.env.GOOGLE_API_KEY = "AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE";
process.env.TAVILY_API_KEY = "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";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", // or another supported Gemini model
  temperature: 0.7,
});