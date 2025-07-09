import { z } from "zod";
import { tool } from "@langchain/core/tools";

export const multiplyTool = tool(
  async ({ a, b }) => a * b,
  {
    name: "multiply",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Multiplies a and b.",
  }
);
