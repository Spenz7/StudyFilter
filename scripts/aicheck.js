// scripts/aicheck.js
import { callAI } from './providers/index.js';

const SECURITY = {
  MAX_PHRASE_LENGTH: 35,
  MAX_TOPICS: 10
};

/**
 * Determines if a given phrase is relevant to the allowed topics.
 * Returns true if relevant, false otherwise.
 */
export async function isRelevantToTopics(phrase, allowedTopics, filterLevel) {
  // 1. Skip check when no topics are defined
  if (!Array.isArray(allowedTopics) || allowedTopics.length === 0) {
    return true;
  }

  // 2. Sanitize inputs
  const cleanPhrase = typeof phrase === 'string'
    ? phrase.slice(0, SECURITY.MAX_PHRASE_LENGTH)
    : '';

  const cleanTopics = Array.isArray(allowedTopics)
    ? [...new Set(allowedTopics)].slice(0, SECURITY.MAX_TOPICS)
    : [];

  if (!cleanPhrase || cleanTopics.length === 0) {
    return true; // Fail-open on bad inputs
  }

  try {
    const aiAnswer = await callAI(cleanPhrase, cleanTopics, filterLevel);

    const normalizedAnswer = String(aiAnswer || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');

    return normalizedAnswer.startsWith('yes');
  } catch (err) {
    console.error('AI check failed:', err);
    return true; // Fail-open on network or logic errors
  }
}
