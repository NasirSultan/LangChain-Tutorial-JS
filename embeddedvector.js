import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

dotenv.config();

const longText = `
LangChain is a framework that helps developers build powerful LLM applications.
It supports chaining, memory, retrieval, and tool usage like APIs or web scraping.

Google Gemini is a family of large language models developed by Google DeepMind.
Gemini is designed to handle multimodal inputs and power AI tasks like chatbots, summarization, and generation.

Retrieval-Augmented Generation (RAG) combines retrieval from a document store with language model generation.
It improves accuracy by grounding answers in real data sources rather than relying on training data alone.

Vector stores like Pinecone, Chroma, and FAISS allow storing and retrieving high-dimensional vector embeddings.
They enable fast similarity search for tasks like semantic search and question answering.
`;

let vectorstore;

async function initializeVectorStore() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY in .env");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.createDocuments([longText]);

  console.log("\nChunks:");
  chunks.forEach((chunk, i) => {
    console.log(`\nChunk #${i + 1}:\n${chunk.pageContent}`);
  });

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "models/embedding-001",
    apiKey,
  });

  const vectors = await embeddings.embedDocuments(chunks.map(c => c.pageContent));

  console.log("\nEmbedded Vectors:");
  vectors.forEach((vec, i) => {
    console.log(`\nVector #${i + 1} (length: ${vec.length}):\n[${vec.slice(0, 5).join(", ")} ...]`);
  });

  vectorstore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
}

async function retrieve(state) {
  if (!vectorstore) await initializeVectorStore();

  const results = await vectorstore.similaritySearch(state.question, 2);
  return {
    context: results
      .map((r, i) => `Chunk #${i + 1}:\n${r.pageContent}`)
      .join("\n\n"),
  };
}

(async () => {
  const result = await retrieve({ question: "What is RAG in LLMs?" });
  console.log("\nRetrieved Context:\n", result.context);
})();
