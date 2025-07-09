import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

export const wikiTool = tool(
  async ({ query }) => {
    const wiki = new WikipediaQueryRun();
    const result = await wiki.invoke(query);
    return result.length > 300 ? result.slice(0, 300) + "..." : result;
  },
  {
    name: "wiki_search",
    schema: z.object({
      query: z.string(),
    }),
    description: "Search Wikipedia for information on a topic.",
  }
);
