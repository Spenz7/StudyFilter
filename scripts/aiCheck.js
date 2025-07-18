// scripts/aiCheck.js
import { callAI } from './providers/index.js';

export async function isRelevantToTopics(phrase, allowedTopics) {
  const prompt = `Is the following phrase related to any of these topics, even if it contains minor typos or misspellings? Answer with only "Yes" or "No".

Phrase: "${phrase}"
Topics: ${allowedTopics.join(", ")}`;

  try {
    const aiAnswer = await callAI(prompt);

    if (!aiAnswer || typeof aiAnswer !== 'string') return false;

    const cleaned = aiAnswer.trim().toLowerCase();

    if (cleaned === "yes") {
      return true;
    } else if (cleaned === "no") {
      return false;
    } else {
      console.warn("Unexpected AI answer:", cleaned);
      return false;
    }
  } catch (error) {
    console.error("AI API error:", error);
    return false;
  }
}
