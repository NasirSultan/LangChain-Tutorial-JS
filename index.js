import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { runFlow } from "./runFlow.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file || !req.body.targetRole) {
      return res.status(400).json({ error: "Resume file and targetRole are required" });
    }

    const fullPath = path.join(__dirname, req.file.path);
    const result = await runFlow(fullPath, req.body.targetRole);
    res.json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
