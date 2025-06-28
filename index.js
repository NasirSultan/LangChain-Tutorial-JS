import analyzeResume from "./analyze.js";
import readline from "readline";

const ask = (q) => new Promise((res) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(q, (ans) => { rl.close(); res(ans); });
});

const run = async () => {
  const filePath = await ask("📄 Enter full path to resume PDF: ");
  const targetRole = await ask("🎯 Enter target job role: ");

  console.log("\n🚀 Running AI...\n");

  try {
    const result = await analyzeResume(filePath.trim(), targetRole.trim());
    console.log("🧠 Analysis Result:\n");
    console.log(result);
  } catch (err) {
    console.error("❌ Error analyzing resume:", err.message);
  }
};

run();
