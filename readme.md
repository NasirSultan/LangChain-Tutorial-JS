

# Conversational Agent: Zero-Shot ReAct

This project showcases how to create a conversational agent using **LangChain's built-in Zero-Shot ReAct agent**, combined with a custom Wikipedia search integration powered by the Mistral model.

## Overview

The agent utilizes:

* The `mistral-large-latest` model from Mistral via `@langchain/mistralai`
* A custom Wikipedia integration for external data retrieval
* LangChain’s built-in **Zero-Shot ReAct** agent to reason and act using tools dynamically

## Features

* Automatically chooses when to invoke Wikipedia to answer user questions
* Provides structured, thoughtful answers with chain-of-thought reasoning
* Easily extendable with new tools for additional capabilities

## Input Example

Who was Nikola Tesla and what did he invent?

## Output Example

The agent:

1. Determines that it needs external information
2. Uses the Wikipedia integration to gather data
3. Returns a clear and concise answer about Tesla’s life and inventions

## Getting Started

1. Clone the repository
2. Install dependencies
3. Create a `.env` file with any required environment variables
4. Run the script to interact with the agent

## Dependencies

* Node.js (18+ recommended)
* dotenv
* LangChain
* Mistral SDK
* Custom search modules (e.g., Wikipedia)

## Use Cases

* General-purpose Q\&A systems
* Research and learning assistants
* AI-enhanced educational platforms


