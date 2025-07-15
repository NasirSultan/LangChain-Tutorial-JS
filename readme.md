
# Supervisor - LangGraph Agent Workflow Example

This project demonstrates how to build a **multi-agent AI workflow** using [LangGraph](https://js.langchain.com/docs/langgraph), [MistralAI](https://docs.langchain.com/docs/ecosystem/integrations/chat/mistralai), and [LangChain tools](https://js.langchain.com/docs/modules/agents/tools/). A **supervisor agent** intelligently coordinates between:

* A **Research Agent** to retrieve data (e.g. FAANG headcounts),
* A **Math Agent** to perform calculations on the data.

## Use Case

> “What’s the combined headcount of the FAANG companies in 2024?”

The supervisor delegates:

1. Data gathering to `research_agent`,
2. Math calculation to `math_agent`,
3. Summarizes the result and returns it to the user.

## Technologies and Libraries

* Node.js
* LangGraph (`@langchain/langgraph-supervisor`, `@langchain/langgraph`)
* LangChain Core (`@langchain/core`)
* MistralAI via `@langchain/mistralai`
* Zod for input schema validation
* dotenv for managing environment variables

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/your-username/supervisor-langgraph-example.git
cd supervisor-langgraph-example
```

2. Install Dependencies:

```bash
npm install
```

3. Setup Environment:

Create a `.env` file in the root with your MistralAI API key:

```env
MISTRAL_API_KEY=your-mistral-api-key
```

## Running the App

```bash
node index.js
```

The program will output a JSON object that includes:

* The final answer,
* Intermediate steps (if `returnIntermediateSteps: true` is enabled).

## Agents Overview

| Agent            | Role                                    | Tools Used        |
| ---------------- | --------------------------------------- | ----------------- |
| `research_agent` | Fetch static web-like data (headcounts) | `web_search`      |
| `math_agent`     | Perform arithmetic on numbers           | `add`, `multiply` |

## Project Structure

```
.
├── index.js          // Main application
├── .env              // API keys
└── README.md         // Project description
```

## Example Output

```json
{
  "output": "The combined headcount of the FAANG companies in 2024 is 1,976,586.",
  "steps": [...]
}
```

## Notes

* This example uses mocked data in the `web_search` tool.
* You can replace it with a real search tool from `@langchain/community/tools` or your own API integration.



