import { callAI } from './providers/index.js';

export async function isRelevantToTopics(phrase, allowedTopics) {
  if (!Array.isArray(allowedTopics) || allowedTopics.length === 0) {
    return true;  // Allow if no topics specified
  }

  const { filterLevel = 'lenient' } = await new Promise(resolve =>
    chrome.storage.local.get({ filterLevel: 'lenient' }, resolve)
  );

  const prompt =
    filterLevel === 'lenient'
      ? `Is the phrase below at least loosely related to any of these topics? Answer only "Yes" or "No". Ignore minor typos or spacing errors.\n\nPhrase: "${phrase}"\nTopics: ${allowedTopics.join(", ")}`
      : `Is the phrase below clearly related to any of these topics? Answer only "Yes" or "No". Ignore minor typos or spacing errors.\n\nPhrase: "${phrase}"\nTopics: ${allowedTopics.join(", ")}`;

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
