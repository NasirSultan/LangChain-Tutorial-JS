# Retrieval-Augmented Generation (RAG) using LangChain and LangGraph

This project demonstrates a simple RAG system built with LangChain and LangGraph using only two files:

- `index.js` – contains all logic: loading text, chunking, embedding, graph flow, and LLM answering.

## Concept

The Retrieval-Augmented Generation (RAG) architecture improves LLM responses by retrieving relevant information from external knowledge 

### Flow

1. Load text content from `bodytext.js`.
2. Split the text into manageable chunks.
3. Embed each chunk into vector space using a language embedding model.
4. Store embeddings in a temporary memory vector store.
5. Use LangGraph to define a series of steps (nodes) in a graph:
   - Split → Embed → Retrieve → Generate
6. Ask the user a question.
7. Retrieve the most relevant chunks from the vector store.
8. Send them to the LLM to generate the final answer.

## File Descriptions

### index.js

- Loads `bodytext.js`
- Chunks the text
- Embeds chunks and stores them
- Uses LangGraph to define nodes and edges
- Accepts a user question and generates a context-based answer

### bodytext.txt

- Place your input document/text here
- This file should contain the raw content the system will use for retrieval and answering

## Setup

1. Clone or download the project
2. Add your text content to `bodytext.js`
3. Install dependencies:

```bash
npm install
