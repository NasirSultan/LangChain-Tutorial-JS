
import puppeteer from 'puppeteer';
import { Document } from 'langchain/document';
const urls = [
  'https:.app/'
];
async function fetchContentWithPuppeteer(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const content = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return content;
}
async function main() {
  for (const url of urls) {
    const text = await fetchContentWithPuppeteer(url);
    console.log(`Content from: ${url}\n`);
    console.log(text.slice(0, 1000)); 
    const doc = new Document({
      pageContent: text,
      metadata: { source: url }
    });
  }
}
main().catch(console.error);
