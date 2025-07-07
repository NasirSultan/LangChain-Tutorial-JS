

# LangChain Gemini Tool-Calling Calculator Agent

This project showcases the use of **tool calling with Gemini 1.5 Flash** using LangChain in Node.js. Instead of only replying with text, the language model can decide to **invoke an external function (a tool)** — allowing it to perform real actions like mathematical operations.

## Core Idea: Tool Calling

The agent doesn't just generate answers — it **detects intent** (like a math operation), and if needed, **calls a tool** with structured inputs to compute the result.

Example:
User asks: *“What’s 3 times 12?”*
→ The Gemini model generates a **tool call** to the `calculator` tool
→ LangChain executes the tool
→ The result is returned back to Gemini to complete the conversation

Tool calling makes the AI more interactive, safe, and capable of extending beyond its own reasoning.

---

## What the Agent Can Do

* **Understands natural language input**
* Automatically decides when a tool call is needed
* Uses a calculator tool to handle:

  * Addition
  * Subtraction
  * Multiplication
  * Division
* Validates tool inputs with Zod schema
* Cleanly separates LLM thinking from tool execution

---

## How It Works (Flow)

1. **LLM receives user input**
2. **LLM decides to call a tool** (e.g., `calculator`) with structured arguments
3. LangChain executes the tool
4. Tool returns a result as a string
5. Gemini model may generate a final answer using that result

This is known as the **structured tool use** paradigm.

---

## Technologies Used

* LangChain (JavaScript/Node.js)
* Gemini 1.5 Flash model
* Zod (for tool input validation)
* dotenv (for API key configuration)

---

## Why Tool Calls Matter

* They make the AI **actionable** — able to do more than just "talk"
* Tool calls are **explicit and interpretable**, not hidden in generated text
* You can chain tools together to build powerful multi-function agents

---

## Future Ideas

* Add more tools (e.g., date/time, currency conversion)
* Build a full CLI or web-based chat agent
* Introduce decision logic for multi-step reasoning and workflows
