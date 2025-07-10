
# LangChain with Tools – Tool Binding and Runtime Context

This project demonstrates how to use **LangChain tools** with **Google Gemini** and **Mistral AI** models. It shows how to bind tools, handle streaming output, and pass values at runtime using LangChain context.

---

##  File: `index.js`

### **Topic: Using Tools with Gemini + Streaming**

This file shows how to:

* Create tools (`add` and `multiply`) using `zod` for schema validation.
* Bind tools to the **Gemini 1.5 Flash** model.
* Use `stream()` to get Gemini's response gradually (in chunks).
* Handle tool calls by invoking the appropriate function.

###  How It Works:

1. **Define Tools**
   Two tools are defined:

   * `add`: Adds two numbers.
   * `multiply`: Multiplies two numbers.

2. **Bind Tools to Model**
   The tools are bound using `model.bindTools(tools)` so the LLM can decide when to use them.

3. **Ask a Multi-Part Question**
   A natural question is sent:
   `"What is 3 * 12? Also, what is 11 + 49?"`

4. **Use `stream()`**
   Instead of waiting for the full response, the model sends back chunks.
   Each chunk is gathered using the `concat()` method.

5. **Check for Tool Calls**
   After gathering the full response, if the model decided to use a tool (like `multiply` or `add`), it will list them in `tool_calls`.

6. **Run the Tool Manually**
   Loop through `tool_calls`, and invoke the matching tool with the given arguments.

###  Purpose:

This setup shows **how Gemini can stream output** and **automatically call tools** if the tools are relevant to the question.

---

##  File: `value.js`

### **Topic: Passing Runtime Values to Tools (with Mistral)**

This file shows how to:

* Use `setContextVariable` and `getContextVariable` to pass **userId** at runtime.
* Create a tool (`updateFavoritePets`) that updates a user's favorite pets.
* Use `RunnableLambda` to run the model and tool logic dynamically.
* Call tools **automatically via LLM** or **manually**.

###  How It Works:

1. **Create Tool with Runtime Context**
   The tool `updateFavoritePets` uses `getContextVariable("userId")` to identify the user.
   It updates a global `userToPets` object.

2. **Bind Tool to Mistral Model**
   The tool is bound to `ChatMistralAI`, which supports tool usage but not streaming.

3. **Use `RunnableLambda` for AI Call**
   A wrapper (`handleRunTimeRequestRunnable`) sets `userId`, binds the tool, and invokes the model with the query.
   If a tool call is returned, it's executed with the model-provided values.

4. **Manual Tool Call**
   A second `RunnableLambda` shows how to manually call a tool by setting the user context and passing values like `["dog", "owl"]`.

###  Purpose:

This demonstrates how to **pass values at runtime** (like `userId`) to tools and **let the AI handle user-specific logic** such as updating preferences.


