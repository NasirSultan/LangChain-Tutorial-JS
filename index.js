import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FakeEmbeddings } from "langchain/embeddings/fake";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RetrievalQAChain } from "langchain/chains";
import readline from "readline";

const askUser = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });

const run = async () => {
  console.log("Loading PDF...");
  const loader = new PDFLoader("your.pdf");
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(docs);
  console.log(`Split into ${chunks.length} chunks`);

  const embeddings = new FakeEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
  console.log("Vector store created");

  const model = new ChatGoogleGenerativeAI({
    apiKey: "your apiKey",
    model: "models/gemini-1.5-flash",
    temperature: 0.7,
    maxOutputTokens: 2048,
  });

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  while (true) {
    const question = await askUser("Ask a question (or type 'exit'): ");
    if (question.trim().toLowerCase() === "exit") break;

    const response = await chain.call({ query: question });
    console.log("\nAnswer:\n" + response.text);
  }
};

run();
