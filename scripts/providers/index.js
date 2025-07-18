// scripts/providers/index.js
import { AI_PROVIDER } from '../config.js';
import { callOpenAI } from './openai.js';
import { callOpenRouter } from './openrouter.js';

export async function callAI(prompt) {
  switch (AI_PROVIDER) {
    case 'openai':
      return callOpenAI(prompt);
    case 'openrouter':
      return callOpenRouter(prompt);
    default:
      throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
  }
}
