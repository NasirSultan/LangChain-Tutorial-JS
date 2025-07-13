
# LangChain Web Scraper & Vector Search

This project demonstrates how to use LangChain's tools to scrape web content, split it into chunks, generate vector embeddings, and perform semantic search using in-memory retrieval.

## Overview

The example uses the following tools from the LangChain ecosystem:

* **CheerioWebBaseLoader**: To load HTML content from a web page.
* **RecursiveCharacterTextSplitter**: To break the content into manageable overlapping text chunks.
* **OpenAIEmbeddings**: To generate vector embeddings of the content.
* **MemoryVectorStore**: To store embeddings in memory for fast retrieval.
* **Retriever**: To search and fetch relevant text based on user queries.

## Use Case

This setup is useful for building a **context-aware question-answering system** based on external web documentation or websites. It loads a webpage, transforms the data into vector space using embeddings, and enables intelligent search over the content.

## Example Flow

1. Load content from a live URL (e.g., LangChain documentation).
2. Split the text into overlapping chunks to retain context.
3. Generate embeddings using OpenAI's API.
4. Store them in a memory-based vector store.
5. Retrieve the most relevant chunks when a user asks a question.

## Sample Query

You can query the retriever with natural language, like:

> "how to upload a dataset"

The system will return the most relevant content block from the loaded documentation.

## Dependencies

* `@langchain/community`
* `@langchain/textsplitters`
* `@langchain/openai`
* `langchain`

Make sure you configure the OpenAI API key in your environment.

