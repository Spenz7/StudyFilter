// scripts/aiClient.js
import { AI_PROVIDER, OPENAI_API_KEY, OPENROUTER_API_KEY } from './config.js';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key is missing");
    return null;
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "You are a helpful assistant. Reply ONLY with 'Yes' or 'No' without explanation." },
          { role: 'user', content: prompt }
        ],
        max_tokens: 5,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
  } catch (err) {
    console.error("OpenAI request failed:", err);
    return null;
  }
}

async function callOpenRouter(prompt) {
  if (!OPENROUTER_API_KEY) {
    console.error("OpenRouter API key is missing");
    return null;
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: "system", content: "You are a helpful assistant. Reply ONLY with 'Yes' or 'No' without explanation." },
          { role: 'user', content: prompt }
        ],
        max_tokens: 5,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
  } catch (err) {
    console.error("OpenRouter request failed:", err);
    return null;
  }
}

export async function callAI(prompt) {
  switch (AI_PROVIDER) {
    case 'openai':
      return await callOpenAI(prompt);
    case 'openrouter':
      return await callOpenRouter(prompt);
    default:
      console.error("Unsupported AI_PROVIDER:", AI_PROVIDER);
      return null;
  }
}
