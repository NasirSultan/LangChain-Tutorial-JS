
## Wikipedia Query Script (Node.js and LangChain)

This project demonstrates how to retrieve summarized information from Wikipedia using two approaches:

1. **Using node-fetch with Wikipedia's REST API**
   The script first performs a search query through Wikipedia’s API to identify the most relevant article based on the given input (e.g., "Pakistan"). It then fetches the summary of the top search result and displays it.

2. **Using LangChain's WikipediaQueryRun tool**
   This approach leverages LangChain’s built-in Wikipedia tool to retrieve relevant information for a query. It simplifies access to Wikipedia content and can be integrated directly into LangChain-based agents.

### Features

* Executes search and summary retrieval via Wikipedia’s API
* Supports automatic extraction of the top search result
* Uses LangChain for streamlined tool-based access to Wikipedia content
* Trims long content for concise display

### Sample Output

Best Wikipedia Result for "Pakistan":
Title: Pakistan
Summary: Pakistan, officially the Islamic Republic of Pakistan, is a country in South Asia. It is the world's fifth-most populous country and has the world's second-largest Muslim population.

Wikipedia Result:
Pakistan, officially the Islamic Republic of Pakistan, is a country in South Asia...

### How to Run

Run the script using Node.js after installing dependencies:

* node-fetch
* @langchain/community

