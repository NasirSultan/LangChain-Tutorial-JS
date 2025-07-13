// wikipediaTool.js
import { DynamicStructuredTool } from "langchain/tools";
import wiki from "wikipedia";

export const WikipediaTool = new DynamicStructuredTool({
  name: "searchWikipedia",
  description: "Search Wikipedia for information about a specific topic.",
  schema: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "The topic to look up on Wikipedia",
      },
    },
    required: ["topic"],
  },
  func: async ({ topic }) => {
    try {
      const page = await wiki.page(topic);
      const summary = await page.summary();
      return summary.extract;
    } catch {
      return "No Wikipedia result found.";
    }
  },
});
