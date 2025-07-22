// scripts/providers/openai.js

import { getWorkerUrl } from './getworkerurl.js';

/**
 * Sanitizes input before sending to the Worker.
 * - Removes emojis
 * - Allows full stops (.)
 * - Strips other symbols
 * - Deduplicates and truncates topics
 */
function sanitizeInput(phrase, topics) {
  const cleanPhrase = phrase
    .slice(0, 35)
    .replace(/\p{Emoji}/gu, '')          // Remove emojis
    .replace(/[^\w\s.]/gi, '')           // Allow full stops
    .toLowerCase()
    .trim();

  const cleanTopics = [...new Set(topics)]
    .slice(0, 10)
    .map(t => t.slice(0, 20).toLowerCase());

  return { cleanPhrase, cleanTopics };
}

export async function callOpenAI(phrase, topics, mode, provider = 'openai') {
  if (
    typeof phrase !== 'string' || 
    phrase.length === 0 ||
    !Array.isArray(topics) ||
    topics.length > 10 ||
    !['strict', 'lenient'].includes(mode)
  ) {
    console.warn('Invalid input – defaulting to allow');
    return 'yes';
  }

  const { cleanPhrase, cleanTopics } = sanitizeInput(phrase, topics);
  
  try {
    const workerUrl = getWorkerUrl();
    console.log(`Using worker URL: ${workerUrl}`);
    
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Version': chrome.runtime.getManifest().version
      },
      body: JSON.stringify({
        phrase: cleanPhrase,
        topics: cleanTopics,
        mode,
        provider
      })
    });

    if (!response.ok) {
      console.error(`Worker error (${response.status}) – defaulting to allow`);
      return 'yes';
    }

    const result = await response.text();
    return result.trim().toLowerCase() === 'no' ? 'no' : 'yes';

  } catch (err) {
    console.error('AI check failed:', err);
    return 'yes'; // allow utube search to pass if ai check got error
  }
}
