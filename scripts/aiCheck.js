// scripts/aiCheck.js
import { OPENAI_API_KEY } from "../config.js";

export async function checkContentRelevance(phrase, allowedTopics) {
  if (!phrase || allowedTopics.length === 0) return true; // Default allow if no topics

  // Compose prompt to get yes/no answer
  const prompt = `Given the allowed topics: ${allowedTopics.join(", ")}, is the following phrase relevant to any of these topics? Answer only "Yes" or "No". Phrase: "${phrase}"`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_API_KEY"  // Replace with your key securely
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 3
      })
    });

    if (!response.ok) {
      console.error("OpenAI API error", response.statusText);
      return false; // Fail safe block
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content.trim().toLowerCase();

    return answer === "yes";
  } catch (error) {
    console.error("Failed to call OpenAI API", error);
    return false; // Fail safe block
  }
}
