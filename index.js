import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const myPrompt = new PromptTemplate({
  template: "What should be the name of a company that sells {product1} and {product2}?",
  inputVariables: ["product1", "product2"],
});

async function run() {

  const formattedPrompt = await myPrompt.format({
    product1: "socks",
    product2: "shoes",
  });

  console.log("Formatted Prompt:\n", formattedPrompt);


  const model = new ChatGoogleGenerativeAI({
    apiKey: "your-api-key",
    model: "models/gemini-1.5-flash", 
    maxOutputTokens: 2048,
    temperature: 0.7,
  });


  const result = await model.invoke(formattedPrompt);

  console.log("Gemini Response:\n", result.content);
}

run();
