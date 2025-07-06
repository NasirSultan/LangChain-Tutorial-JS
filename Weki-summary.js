
import fetch from "node-fetch";

const query = "Pakistan";


const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`;

const searchRes = await fetch(searchUrl);
const searchData = await searchRes.json();

if (!searchData.query.search.length) {
  console.log("No results found.");
  process.exit();
}
const topTitle = searchData.query.search[0].title;

const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`;

const summaryRes = await fetch(summaryUrl);
const summaryData = await summaryRes.json();

console.log(`Best Wikipedia Result for "${query}":\n`);
console.log(`Title: ${summaryData.title}`);
console.log(`Summary: ${summaryData.extract}`);
