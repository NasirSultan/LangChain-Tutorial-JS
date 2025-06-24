import { PromptTemplate } from "@langchain/core/prompts";

const myPrompt = new PromptTemplate({
  template: "What should be the name of a company that sells {product1} and {product2}?",
  inputVariables: ["product1", "product2"],
});

const formattedPrompt = await myPrompt.format({
  product1: "socks",
  product2: "shoes",
});

console.log(myPrompt);
console.log(formattedPrompt);
