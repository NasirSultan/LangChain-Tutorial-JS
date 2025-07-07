import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const reverseTool = tool(
  ({ text }) => {
    return text.split("").reverse().join("");
  },
  {
    name: "reverseString",
    description: "Reverses the provided text",
    schema: z.object({
      text: z.string(),
    }),
  }
);
