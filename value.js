import "dotenv/config";
import { ChatMistralAI } from "@langchain/mistralai";
import { setContextVariable, getContextVariable } from "@langchain/core/context";
import { tool } from "@langchain/core/tools";
import { RunnableLambda } from "@langchain/core/runnables";

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
});


let userToPets = {};


const updateFavoritePets = tool(
  async (input) => {
    const userId = getContextVariable("userId");
    if (!userId) {
      throw new Error(`"userId" not found in context. Please set it first.`);
    }

    userToPets[userId] = input.pets;
    return `Favorite pets updated for user "${userId}".`;
  },
  {
    name: "update_favorite_pets",
    description: "Update the user's favorite pets",
    schema: {
      type: "object",
      properties: {
        pets: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["pets"],
    },
  }
);


const handleRunTimeRequestRunnable = RunnableLambda.from(
  async (params) => {
    const { userId, query, llm } = params;

    if (!llm.bindTools) {
      throw new Error("LLM does not support tool binding.");
    }

    setContextVariable("userId", userId);

    const llmWithTools = llm.bindTools([updateFavoritePets]);
    const response = await llmWithTools.invoke(query);

    if (response.tool_calls && response.tool_calls.length > 0) {
      return await updateFavoritePets.invoke(response.tool_calls[0].args);
    } else {
      return "No tool was invoked by the model.";
    }
  }
);

const result1 = await handleRunTimeRequestRunnable.invoke({
  userId: "brace",
  query: "Add cats and parrots to my favorite animals.",
  llm: llm,
});
console.log("LLM result:", result1);


const manualToolCaller = RunnableLambda.from(async () => {
  setContextVariable("userId", "brace");
  return await updateFavoritePets.invoke({ pets: ["dog", "owl"] });
});
const result2 = await manualToolCaller.invoke();
console.log("Manual tool call result:", result2);

console.log("User-to-pets data:", userToPets);
