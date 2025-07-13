import { DynamicStructuredTool } from "langchain/tools";

export const YourDataTool = new DynamicStructuredTool({
  name: "getMyInfo",
  description: "Returns developer profile info about Nasir (skills, projects, experience).",
  schema: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "A question related to Nasir's skills, experience, or projects",
      },
    },
    required: ["question"],
  },
  func: async ({ question }) => {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes("skills") || lowerQ.includes("stack")) {
      return `Nasir is a Full Stack Developer with expertise in the MERN stack (MongoDB, Express.js, React.js, Node.js), LangChain, LangGraph, Gemini AI, and deployment (Vercel, Hostinger, AWS).`;
    }

    if (lowerQ.includes("experience")) {
      return `Nasir has 1 year of real-world experience in web development and AI, including internships at Rhombix Technologies and Youngdiv, and freelance projects like an AI Interview & Resume Assistant platform.`;
    }

    if (lowerQ.includes("project")) {
      return `Some projects include:
1. AI Interview & Resume Assistant (LangChain, Gemini, React)
2. Food Ordering App (MERN + Stripe)
3. Vehicle Tracking System (Node.js, Express, MongoDB).`;
    }

    return `No relevant info found. Ask about skills, experience, or projects.`;
  },
});
