// scripts/background.js
import { handleReddit } from './handlers/reddithandler.js';
import { handleYouTube } from './handlers/youtubehandler.js';

console.log('[Background] Service worker loaded');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  // Skip non-web protocols (e.g., chrome://, file://, about:, etc.)
  if (!tab.url.startsWith('http')) return;

  try {
    const url = new URL(tab.url);
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();

    if (domain.includes('reddit.com')) {
      handleReddit(tabId, tab.url);
    } else if (domain.includes('youtube.com')) {
      handleYouTube(tabId, tab.url); // non-blocking
    }
  } catch (e) {
    console.error('[Background] Error parsing tab URL:', tab.url, e);
  }
});

