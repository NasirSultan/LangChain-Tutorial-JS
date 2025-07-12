import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// 1. Load the web page content
const loader = new CheerioWebBaseLoader("https://docs.smith.langchain.com/overview");
const docs = await loader.load();

// 2. Split the content into smaller chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const documents = await splitter.splitDocuments(docs);

// 3. Create vector store with OpenAI embeddings
const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  new OpenAIEmbeddings()
);

// 4. Create a retriever from the vector store
const retriever = vectorStore.asRetriever();

// 5. Query the retriever
const query = "how to upload a dataset";
const results = await retriever.invoke(query);

// 6. Output the most relevant result
console.log("Top Matching Chunk:");
console.log(results[0].pageContent);
