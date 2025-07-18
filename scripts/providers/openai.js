import { OPENAI_API_KEY } from '../config.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key is missing");
    return null;
  }

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 5,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    console.error("OpenAI API error:", response.statusText);
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : null;

}
