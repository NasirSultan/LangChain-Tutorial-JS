import { StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs/promises";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const stateSchema = z.object({
  filePath: z.string(),
  targetRole: z.string(),
  resumeText: z.string().optional(),
  analysis: z.string().optional(),
  improvementNotes: z.string().optional(),
  improvedResume: z.string().optional(),
});

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-1.5-flash",
  temperature: 0.7,
});

const load_pdf = async (state) => {
  if (!state.filePath) throw new Error("Missing filePath");
  const buffer = await fs.readFile(state.filePath);
  const loader = new PDFLoader(buffer, { parsedExtension: ".pdf" });
  const docs = await loader.load();
  return { resumeText: docs.map(d => d.pageContent).join("\n") };
};

const analyze_resume = async (state) => {
  const prompt = `Analyze this resume for the role of "${state.targetRole}". Give ATS score and brief feedback.\n\nResume:\n${state.resumeText}`;
  const res = await model.invoke(prompt);
  return { analysis: res.content };
};

const suggest_improvements = async (state) => {
  const prompt = `Based on this resume and analysis:\n\n${state.analysis}\n\nSuggest improvements in:\n1. Format/Structure\n2. Skills/Keywords\n\nResume:\n${state.resumeText}`;
  const res = await model.invoke(prompt);
  return { improvementNotes: res.content };
};

const generate_resume = async (state) => {
  const prompt = `Improve the resume below based on these suggestions:\n${state.improvementNotes}\n\nOriginal Resume:\n${state.resumeText}`;
  const res = await model.invoke(prompt);
  return { improvedResume: res.content };
};

const builder = new StateGraph({ channels: stateSchema })
  .addNode("load_pdf", load_pdf)
  .addNode("analyze", analyze_resume)
  .addNode("suggest", suggest_improvements)
  .addNode("generate", generate_resume)
  .addEdge("load_pdf", "analyze")
  .addEdge("analyze", "suggest")
  .addEdge("suggest", "generate")
  .setEntryPoint("load_pdf");

const graph = builder.compile();

export async function runFlow(filePath, targetRole) {
  return await graph.invoke({ filePath, targetRole });
}
