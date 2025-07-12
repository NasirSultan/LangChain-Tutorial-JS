import fetch from "node-fetch";

export const WikipediaTool = {
  name: "wikipedia_search",
  description: "Search Wikipedia for general knowledge and information.",
  async call(input) {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      input
    )}&format=json`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.query.search.length) return "No results found.";

    const first = data.query.search[0];
    const pageUrl = `https://en.wikipedia.org/wiki/${first.title.replace(/ /g, "_")}`;

    return ` ${first.title}\n\n${first.snippet.replace(/<\/?[^>]+(>|$)/g, "")}...\n🔗 ${pageUrl}`;
  },
};
