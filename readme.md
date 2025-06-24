# PDF Question Answering with LangChain + Gemini

This project lets you ask questions about the contents of a PDF file using LangChain and Google's Gemini model. It’s a simple terminal-based app that loads your PDF, processes its content, and allows natural language querying.

## Features

* Loads and reads a PDF file.
* Splits content into manageable text chunks.
* Stores chunks in memory using fake embeddings.
* Uses Gemini 1.5 Flash to answer your questions.
* Interactive question-answer loop in the terminal.

## Requirements

* Node.js v18 or higher
* Gemini API key (from Google AI Studio)

## Setup

1. Place your PDF file (e.g., `cybersecurety.pdf`) in the project folder.
2. Install the dependencies with `npm install`.
3. Replace the placeholder Gemini API key in the code with your own.

## Important Notes

* This project uses **FakeEmbeddings** from LangChain.
* **Gemini does not support embedding generation yet** — that’s why a fake embedding is used here for demonstration.
* If you need real semantic search, you can switch to models that support embeddings, like OpenAI or Cohere.

## How to Use

* Run the app using Node.js.
* When prompted, type your question in the terminal.
* To exit, type `exit`.

## Project Structure

* PDF file (e.g., `cybersecurety.pdf`)
* Main script (`index.js`)
* `package.json` for dependencies


