// tools/weather.js
import { FunctionTool } from "@langchain/core/tools";
import fetch from "node-fetch";

export const getWeather = new FunctionTool({
  name: "getWeather",
  description: "Get the current weather for a city",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City name, e.g., Lahore",
      },
    },
    required: ["city"],
  },
  func: async ({ city }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");

    const data = await res.json();
    return `The current weather in ${city} is ${data.weather[0].description} with ${data.main.temp}°C.`;
  },
});
