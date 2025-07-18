import { callAI } from './providers/index.js';

export async function isRelevantToTopics(phrase, allowedTopics, filterLevel = 'strict') {
  if (!Array.isArray(allowedTopics) || allowedTopics.length === 0) return true;

  const prompt = filterLevel === 'lenient'
    ? `Does the phrase below relate even remotely to any of the following topics? Be generous in interpretation. Answer with only "Yes" or "No".

Phrase: "${phrase}"
Topics: ${allowedTopics.join(", ")}`
    : `Is the following phrase related to any of these topics, even if it contains minor typos or misspellings? Answer with only "Yes" or "No".

Phrase: "${phrase}"
Topics: ${allowedTopics.join(", ")}`;

  try {
    const aiAnswer = await callAI(prompt);
    if (!aiAnswer || typeof aiAnswer !== 'string') return false;

    const cleaned = aiAnswer.trim().toLowerCase();
    if (cleaned === "yes") return true;
    if (cleaned === "no") return false;

    console.warn("Unexpected AI answer:", cleaned);
    return false;
  } catch (error) {
    console.error("AI API error:", error);
    return false;
  }
}
