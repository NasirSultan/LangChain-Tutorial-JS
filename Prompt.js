// prompt.js
import { PromptTemplate } from "@langchain/core/prompts";

// 1. Define the prompt template
const myPrompt = new PromptTemplate({
  template: "What should be the name of a company that sells {product1} and {product2}?",
  inputVariables: ["product1", "product2"],
});

// 2. Format the prompt with actual input values
const formattedPrompt = await myPrompt.format({
  product1: "socks",
  product2: "shoes",
});

// 3. Output the raw and formatted prompt
console.log("Prompt Template:", myPrompt);
console.log("Formatted Prompt:", formattedPrompt);
