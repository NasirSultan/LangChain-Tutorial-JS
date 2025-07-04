// fetchPageText.js
import puppeteer from 'puppeteer';

export const fetchPageText = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://nasirfreelance.vercel.app", { waitUntil: 'domcontentloaded' });
  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return text;
};
