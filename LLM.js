import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Step 1: Create a prompt template
const myPrompt = new PromptTemplate({
  template: "What should be the name of a company that sells {product1} and {product2}?",
  inputVariables: ["product1", "product2"],
});

async function run() {
  // Step 2: Format the prompt with real values
  const formattedPrompt = await myPrompt.format({
    product1: "socks",
    product2: "shoes",
  });

  console.log("Formatted Prompt:\n", formattedPrompt);

  // Step 3: Initialize the Gemini model
  const model = new ChatGoogleGenerativeAI({
    apiKey: "AIzaSyCOHvkgqyBzOebZjKAyx8oVYHzEwxxgQGE", // 🔐 Replace with your actual API key
    model: "models/gemini-1.5-flash", // Or "gemini-1.5-flash", etc.
    maxOutputTokens: 2048,
    temperature: 0.7,
  });

  // Step 4: Call the model using `.invoke()`
  const result = await model.invoke(formattedPrompt);

  console.log("Gemini Response:\n", result.content);
}

run();
