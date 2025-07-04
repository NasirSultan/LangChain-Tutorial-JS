//  Method -1
// import puppeteer from 'puppeteer';
// import { Document } from 'langchain/document';
// const urls = [
//   'https://nasirfreelance.vercel.app/'
// ];
// async function fetchContentWithPuppeteer(url) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'domcontentloaded' });
//   const content = await page.evaluate(() => document.body.innerText);
//   await browser.close();
//   return content;
// }
// async function main() {
//   for (const url of urls) {
//     const text = await fetchContentWithPuppeteer(url);
//     console.log(`Content from: ${url}\n`);
//     console.log(text.slice(0, 1000)); 
//     const doc = new Document({
//       pageContent: text,
//       metadata: { source: url }
//     });
//   }
// }
// main().catch(console.error);


//  Method -2
// import puppeteer from 'puppeteer';
// const browser = await puppeteer.launch({ headless: true });
// const page = await browser.newPage();
// await page.goto('https://nasirfreelance.vercel.app', { waitUntil: 'domcontentloaded' });
// console.log(await page.evaluate(() => document.body.innerText));
// await browser.close();



// method -1
// import puppeteer from 'puppeteer';
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { Document } from "langchain/document";

// async function fetchPageText(url) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   // Extract all visible text from body
//   const pageText = await page.evaluate(() => {
//     return document.body.innerText;
//   });

//   await browser.close();
//   return pageText; 
// }


// (async () => {
//   const pageText = await fetchPageText('https://nasirfreelance.vercel.app');
//   console.log("Fetched Text:\n", pageText);

//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 1000,
//     chunkOverlap: 200,
//   });

//   const allSplits = await splitter.splitDocuments([
//     new Document({ pageContent: pageText }),
//   ]);
//   console.log("Total number of document chunks:", allSplits.length);
// })();









// method -2
import puppeteer from 'puppeteer';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

const url = 'https://nasirfreelance.vercel.app';

// Step 1: Fetch visible text from the page
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' });
const pageText = await page.evaluate(() => document.body.innerText);
await browser.close();

console.log(`Fetched Text from ${url}:\n`);
console.log(pageText);

// Step 2: Split into chunks using LangChain
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const docs = [new Document({ pageContent: pageText })];
const allSplits = await splitter.splitDocuments(docs);

console.log("\nTotal number of document chunks:", allSplits.length);

