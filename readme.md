
# LangChain Tool-Binding Demo with Gemini LLM

This project demonstrates how to bind **custom tools** and **built-in tools** (like Wikipedia search) with a **Gemini LLM** using **LangChain**.

It is beginner-friendly, cleanly structured, and helps you build powerful AI agents that can:
- Solve math problems using custom tools
- Fetch real-time information using built-in tools like Wikipedia
- Automatically decide which tool to use based on user input

---

## Project Structure

```

langchain-tools-demo/
│
├── addTool.js           # Custom tool: adds two numbers
├── multiplyTool.js      # Custom tool: multiplies two numbers
└── wikiTool.js          # Built-in tool: Wikipedia search
│
└── index.js                 # Main file that binds tools to Gemini LLM

````

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/langchain-tools-demo.git
cd langchain-tools-demo
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file and add your Gemini API key:

```env
GOOGLE_API_KEY=your_google_generative_ai_key
```

### 4. Run the Project

```bash
node index.js
```

---

## How It Works

* `index.js` sets up the Gemini LLM with tool support using `bindTools()`.
* When the user sends a message, the model:

  * Analyzes the query
  * Calls tools if needed (math or Wikipedia)
  * Returns a final answer after tool outputs are used
* All logic is handled automatically by LangChain and Gemini.

---

## Example

User input:

```
What is 3 * 12? What is 11 + 49? Tell me about Pakistan.
```

Output:

```
Final Answer:
3 * 12 is 36. 11 + 49 is 60. Here's a brief summary about Pakistan: ...
```

---

## Tools Included

### Custom Tools

* `add`: Adds two numbers
* `multiply`: Multiplies two numbers

### Built-in Tool

* `wiki_search`: Uses `WikipediaQueryRun` to fetch a summary

---

## Tags

`LangChain` `LLM` `Gemini` `LangChainTools` `WikipediaQueryRun`
`ToolBinding` `BeginnerFriendly` `AItools` `CustomTools`

---

## License

MIT — feel free to use and modify.

---

## Support

If you need help or want to extend this project (such as adding a weather tool, CLI version, or LangGraph integration), feel free to open an issue or contribute.


