import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const addTool = tool(
  ({ x, y }) => `The result of ${x} + ${y} is ${x + y}`,
  {
    name: "add",
    description: "Adds two numbers",
    schema: z.object({
      x: z.number(),
      y: z.number(),
    }),
  }
);
