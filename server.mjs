// index.mjs
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const app = express();
app.use(cors());
app.use(express.json());

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "models/gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 1000,
});

function extractFileId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match?.[1] || null;
}

async function fetchPdfText(fileId) {
  const res = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
  const uint8Array = new Uint8Array(await res.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(" ") + "\n\n";
  }
  return fullText.trim();
}


app.post("/analyze", async (req, res) => {
  try {
    const { driveUrl } = req.body;
    const fileId = extractFileId(driveUrl);
    if (!fileId) return res.status(400).json({ error: "Invalid Google Drive link" });

    const pdfText = await fetchPdfText(fileId);

    const analysisPrompt = `You are an expert resume analyst. Analyze the resume below and return the following:
- ATS score (out of 100) with ful accuracy and correction
- Strengths
- Weaknesses
- Missing sections
- Tailored suggestions for improvement based on profession
- ATS-relevant keywords that are missing or weak

Resume: ${pdfText}`;

    const analysis = await llm.invoke(analysisPrompt);

    res.json({
      atsAnalysis: analysis.content.trim(),
      pdfText,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/suggest-achievements", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ error: "Resume text is required." });

    const achievementsPrompt = `Read the following resume and suggest industry-specific achievements or enhancements. Tailor examples to the candidate's field, whether teaching, civil engineering, or software. Use real-world metrics where possible (e.g., improved X%, taught Y students, led Z projects).

Resume: ${resumeText}`;

    const achievementSuggestions = await llm.invoke(achievementsPrompt);

    res.json({
      suggestedAchievements: achievementSuggestions.content.trim(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post("/improve", async (req, res) => {
  try {
    const { userInfo, pdfText, userAcceptedAchievements } = req.body;

    if (!userInfo || !pdfText) {
      return res.status(400).json({ error: "Missing userInfo or pdfText" });
    }

    
    let formattedSections = "";
    for (const [key, value] of Object.entries(userInfo)) {
      if (value?.trim()) {
        const titleCase = key
          .replace(/([A-Z])/g, " $1") 
          .replace(/^./, (char) => char.toUpperCase());
        formattedSections += `### ${titleCase}\n${value}\n\n`;
      }
    }


    const improvePrompt = `
You are a professional resume builder and ATS specialist.

Your task is to rewrite and improve the resume using the following user-provided information:

${formattedSections}

Also include:
### Achievements
${userAcceptedAchievements || "None provided"}

Original Resume:
${pdfText}

Make sure the improved resume is:
- Professionally formatted
- Clear and concise
- ATS-optimized (use relevant keywords)
- Reflects the candidate’s best strengths
`;

    const result = await llm.invoke(improvePrompt);
    res.json({ improved: result.content.trim() });
  } catch (err) {
    console.error(" Resume improvement error:", err.message);
    res.status(500).json({ error: "Failed to improve resume" });
  }
});


app.listen(3001, () => console.log("API running on http://localhost:3001"));
