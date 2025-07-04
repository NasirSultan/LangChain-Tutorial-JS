import dotenv from "dotenv";
import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { fetchPageText } from './bodytext.js';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_API_KEY in .env");
const longText = await fetchPageText(); 
// const longText = `
// LangChain is a framework that helps developers build powerful LLM applications.
// It supports chaining, memory, retrieval, and tool usage like APIs or web scraping.

// Google Gemini is a family of large language models developed by Google DeepMind.
// Gemini is designed to handle multimodal inputs and power AI tasks like chatbots, summarization, and generation.

// Retrieval-Augmented Generation (RAG) combines retrieval from a document store with language model generation.
// It improves accuracy by grounding answers in real data sources rather than relying on training data alone.

// Vector stores like Pinecone, Chroma, and FAISS allow storing and retrieving high-dimensional vector embeddings.
// They enable fast similarity search for tasks like semantic search and question answering.
// `;


let sharedVectorstore = null;


const RagSchema = z
  .object({
    question: z.string(),
    context: z.string().optional(),
    answer: z.string().optional(),
  })
  .passthrough();


const ingestNode = async (state) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.createDocuments([longText]);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "models/embedding-001",
    apiKey,
  });

  sharedVectorstore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
  return state;
};

// ✅ Retrieve relevant chunk(s)
const retrieveNode = async (state) => {
  if (!sharedVectorstore) throw new Error("Vectorstore not initialized.");
  const results = await sharedVectorstore.similaritySearch(state.question, 1);
  const context = results.map(r => r.pageContent).join("\n");
  return { ...state, context };
};


const generateNode = async (state) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt = `Answer the following question based on the context below (in less than 100 tokens):\n\n${state.context}\n\nQuestion: ${state.question}`;
  const result = await model.generateContent(prompt);
  const answer = await result.response.text();
  return { ...state, answer };
};


const builder = new StateGraph(RagSchema)
  .addNode("ingest", ingestNode)
  .addNode("retrieve", retrieveNode)
  .addNode("generate", generateNode)
  .addEdge("__start__", "ingest")
  .addEdge("ingest", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__");

const app = builder.compile();

const runRAGFlow = async (question) => {
  const result = await app.invoke({ question });

  // console.log("=== Final Result ===");
  // console.log("Q:", result.question);
  console.log(" Context:\n", result.context);
  console.log(" Answer:\n", result.answer);
};

// Run example
const userQuestion = "What is langchain in LLMs?";
runRAGFlow(userQuestion);
