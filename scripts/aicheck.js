import { callAI } from './providers/index.js';

export async function isRelevantToTopics(phrase, allowedTopics) {
  // if no topics defined, always allow
  if (!Array.isArray(allowedTopics) || allowedTopics.length === 0) {
    return true;
  }

  // 1) Retrieve the current filterLevel from storage (default to 'lenient')
  const { filterLevel = 'lenient' } = await new Promise(resolve =>
    chrome.storage.local.get({ filterLevel: 'lenient' }, resolve)
  );

  // 2) Build the appropriate prompt
  const prompt = filterLevel === 'lenient'
    ? `Does the phrase below relate even remotely to any of the following topics? Be generous in interpretation. Answer with only "Yes" or "No".\n\nPhrase: "${phrase}"\nTopics: ${allowedTopics.join(", ")}`
    : `Is the following phrase related to any of these topics, even if it contains minor typos or misspellings? Answer with only "Yes" or "No".\n\nPhrase: "${phrase}"\nTopics: ${allowedTopics.join(", ")}`;

  // 3) Call the AI and interpret
  try {
    const aiAnswer = await callAI(prompt);
    if (typeof aiAnswer !== 'string') {
      console.warn("Unexpected AI response:", aiAnswer);
      return false;
    }
    const cleaned = aiAnswer.trim().toLowerCase();
    return cleaned === 'yes';
  } catch (error) {
    console.error("AI API error:", error);
    return false;
  }
}
