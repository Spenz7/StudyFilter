import { OPENROUTER_API_KEY } from '../config.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouter(prompt) {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing");
    return null;
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 5,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter API error:", response.statusText);
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : null;

}
