import { z } from "zod";
import { tool } from "@langchain/core/tools";

export const addTool = tool(
  async ({ a, b }) => a + b,
  {
    name: "add",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Adds a and b.",
  }
);
