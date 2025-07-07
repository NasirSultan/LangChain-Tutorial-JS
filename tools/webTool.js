import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const wikiTool = new WikipediaQueryRun({ topKResults: 1 });

export const webTool = tool(
  async ({ query }) => {
    const result = await wikiTool.invoke(query);
    return result.slice(0, 500); // limit result length
  },
  {
    name: "webSearch",
    description: "Searches for current knowledge using Wikipedia",
    schema: z.object({
      query: z.string(),
    }),
  }
);
