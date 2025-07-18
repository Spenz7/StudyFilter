import { AI_PROVIDER } from './config.js';
import { callOpenAI } from './providers/openai.js';
import { callOpenRouter } from './providers/openrouter.js';

export async function callAI(prompt) {
  switch (AI_PROVIDER) {
    case 'openai':
      return callOpenAI(prompt);
    case 'openrouter':
      return callOpenRouter(prompt);
    default:
      console.error("Unsupported AI_PROVIDER:", AI_PROVIDER);
      return null;
  }
}
