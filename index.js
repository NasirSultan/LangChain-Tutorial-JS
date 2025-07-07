import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
const wikiTool = new WikipediaQueryRun();
const query = "pakistan";
const result = await wikiTool.invoke(query);


const limited = result.length > 300 ? result.slice(0, 300) + "..." : result;

console.log("Wikipedia Result:", limited);