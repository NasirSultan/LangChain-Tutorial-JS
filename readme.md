

# Website Content Scraper using Puppeteer 



**Website Content Extractor with Puppeteer and LangChain Document Support**

## Overview

This project provides a Node.js-based utility to extract clean, visible text content from a list of websites using Puppeteer. The extracted content is then structured using LangChain's `Document` class, allowing for easy integration into AI agents, retrieval systems, or further text analysis pipelines.

---

## Purpose

The main goal is to automate the collection of textual data from public web pages and format it in a way that is compatible with LangChain workflows. This is useful for:

* Preparing content for AI-powered question answering using retrieval-augmented generation (RAG)
* Ingesting website data for indexing in vector databases
* Feeding structured data into LangChain agents or conversational AI applications

---

## Technologies Used

* Node.js for executing the script
* Puppeteer for headless browser automation and content extraction
* LangChain JS for creating structured Document objects with metadata

---

## Project Structure

* index.js: The main script to perform scraping and transformation
* package.json: Contains project dependencies
* README.md: Documentation for setup and usage

---

## Setup Instructions

1. Clone or download the project repository to your machine.
2. Install dependencies using `npm install`.
3. Modify the list of URLs in the script to target your desired web pages.
4. Run the script using `node index.js`.

---

## How It Works

The script performs the following steps:

1. Launches a headless browser instance using Puppeteer.
2. Visits each provided URL and waits until the DOM is loaded.
3. Extracts the visible text from the body of the page.
4. Creates a LangChain `Document` object containing the extracted text and the source URL as metadata.
5. Outputs a preview of the content and keeps the data ready for further processing.

---

## Use Cases

* Scraping and storing blog articles or documentation
* Indexing portfolio or resume sites for AI-based analysis
* Preparing website content for vector database insertion and semantic search

---

## Notes

* Ensure that the target URLs are public and do not require login or authentication.
* Puppeteer works well for most websites, but some pages may block headless browsers or require additional handling.
* You can extend the script to save data in a file or feed it directly into a LangChain pipeline.

---

## Author

Nasir Sultan
AI and Full Stack Developer
LangChain and LangGraph Enthusiast

