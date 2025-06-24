

# Using LLM Model for Action Definition

This project demonstrates how to use a large language model (LLM) from Google Generative AI via the LangChain JavaScript SDK. It shows how to define a system prompt that sets the behavior and tone of the model, and how to provide sequential user inputs (messages) to simulate a dynamic conversation.

## Overview

The model used in this project is Gemini 1.5 Flash, known for its speed and high-quality responses. The setup configures the model to behave like a witty but professional teacher who replies in fluent English with a light touch of humor.

## Features

* Uses LangChain's message-based API to structure prompts.
* Sends both system-level instructions and human-like messages.
* Demonstrates context handling by the model over multiple messages.
* Prints model responses for analysis and debugging.

## Purpose

This setup is useful for defining clear AI behavior in teaching, support, or chatbot scenarios where tone and clarity are important. It can also serve as a foundation for more advanced agents or multi-step reasoning applications.

## Requirements

To run this project, you'll need:

* Node.js
* LangChain packages (`@langchain/core`, `@langchain/google-genai`)
* A valid Google Generative AI API key

## Notes

* Be mindful of your API usage limits and token budget.
* You can modify the system prompt to adapt the personality or tone of the model to suit different use cases.

