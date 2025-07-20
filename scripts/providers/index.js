// scripts/providers/index.js
import { callOpenAI } from './openai.js';
import { callOpenRouter } from './openrouter.js';

// Security parameters (match worker limits)
const SECURITY = {
  MAX_PHRASE_LENGTH: 35,
  MAX_TOPICS: 10,
  ALLOWED_MODES: ['strict', 'lenient'],
  ALLOWED_PROVIDERS: ['openai', 'openrouter']
};

/**
 * Unified AI call with comprehensive validation
 */
export async function callAI(phrase, topics, mode = 'strict', provider = 'openai') {
  // Input validation - first line of defense
  if (typeof phrase !== 'string' || phrase.length === 0) {
    console.warn('Invalid phrase - failing open');
    return 'yes';
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    console.warn('Empty topics - failing open');
    return 'yes';
  }

  // Apply security constraints
  const safePhrase = phrase.slice(0, SECURITY.MAX_PHRASE_LENGTH);
  const safeTopics = topics.slice(0, SECURITY.MAX_TOPICS);
  const safeMode = SECURITY.ALLOWED_MODES.includes(mode) ? mode : 'strict';
  const safeProvider = SECURITY.ALLOWED_PROVIDERS.includes(provider) ? provider : 'openai';

  try {
    // Route to selected provider
    switch (safeProvider) {
      case 'openai':
        return await callOpenAI(safePhrase, safeTopics, safeMode);
      case 'openrouter':
        return await callOpenRouter(safePhrase, safeTopics, safeMode);
      default:
        return await callOpenAI(safePhrase, safeTopics, safeMode);
    }
  } catch (error) {
    console.error(`[${safeProvider} call failed]:`, error);
    return 'yes'; // Critical fail-open
  }
}
