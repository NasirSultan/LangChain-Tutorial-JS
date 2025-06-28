import 'dotenv/config';
import fs from 'fs';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const analyzeResume = async (filePath, targetRole) => {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  const content = docs.map(d => d.pageContent).join("\n");

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "models/gemini-1.5-flash",
    temperature: 0.7,
    maxOutputTokens: 2048,
  });

  const prompt = `
You are an ATS resume analyzer. A user has submitted a resume and is targeting the role of "${targetRole}".

Analyze the resume and return:
1. ATS Score (0-100) with reasoning.
2. Suggestions to improve the resume in two sections:
   a. Structure & Formatting
   b. Keyword & Skill Match

Resume Content:
"""
${content}
"""
`;

  const res = await model.invoke(prompt);
  return res.content;
};

export default analyzeResume;
