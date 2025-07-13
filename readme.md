

**PlanAndExecuteAgentExecutor**

---

## Description

This project demonstrates the **Plan‑and‑Execute** agent available in LangChain. The agent uses a two-stage approach:

1. **Planner** – the language model breaks a user request into distinct, ordered steps.
2. **Executor** – a tool-equipped agent executes each planned step in sequence.

This structure helps maintain focus and clarity on multi‑step tasks.

---

## Key Features

* **Two‑stage pipeline**
  Separates reasoning (planning) from action (execution), reducing tool misuse and improving structure.

* **Modular tool usage**
  Integrates diverse tools (e.g., calculator, custom info retriever) automatically during execution.

* **Improved reliability**
  Pre‑planning ensures tasks follow a coherent roadmap, reducing mistakes and drift ([LangChain Blog][1], [LangChain Blog][2]).

* **Ideal for complex tasks**
  Efficient for workflows involving multiple dependent steps, such as research → calculation → summarization ([LangChain Blog][2], [Comet][3]).

---

## When to Use

Choose this agent when your task:

* Requires **multiple, ordered steps**.
* Involves **specialized tools** at different stages.
* Benefits from having a **clear execution plan** before taking action.

For simple single-step tasks (e.g., a quick math or lookup), a standard “ReAct” agent is lighter and faster.

---

## Setup and Run

1. Ensure you have the correct packages installed:

   ```bash
   npm install langchain @langchain/core @langchain/mistralai mathjs dotenv zod
   ```

2. Add `"type": "module"` to your `package.json`.

3. Create `index.js` using the `PlanAndExecuteAgentExecutor.fromLLMAndTools(...)` pattern with:

   * `ChatMistralAI` as the LLM.
   * Custom tools like `getMyInfo`.
   * `mathjs` for evaluation.

4. Run:

   ```bash
   node index.js
   ```

---

## Why It Matters

* **Structured precision**: The planner defines a complete task flow before execution.
* **Efficiency**: The executor focuses on following the plan without repeated planning calls ([GitHub][4], [js.langchain.com][5]).
* **Scalability**: Easily extendable with additional tools or memory for larger pipelines.

---

## References

* LangChain blog: “Plan‑and‑Execute Agents” ([LangChain Blog][2], [LangChain Blog][1])
* JS documentation for `PlanAndExecuteAgentExecutor` ([js.langchain.com][5])

---

Feel free to adapt it further based on your workflow or additional features!

[1]: https://blog.langchain.com/plan-and-execute-agents/?utm_source=chatgpt.com "Plan-and-Execute Agents - LangChain Blog"
[2]: https://blog.langchain.com/planning-agents/?utm_source=chatgpt.com "Plan-and-Execute Agents - LangChain Blog"
[3]: https://www.comet.com/site/blog/plan-and-execute-agents-in-langchain/?utm_source=chatgpt.com "Plan-and-Execute Agents in Langchain - Comet"
[4]: https://github.com/langchain-ai/langchainjs/discussions/3070?utm_source=chatgpt.com "PlanAndExecuteAgentExecutor calling dynamic function multiple ... - GitHub"
[5]: https://js.langchain.com/v0.1/docs/modules/agents/agent_types/plan_and_execute/?utm_source=chatgpt.com "Plan and execute | ️ Langchain"
