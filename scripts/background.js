// scripts/background.js
import { handleReddit } from './handlers/reddithandler.js';
import { handleYouTube } from './handlers/youtubehandler.js';
import { checkUrlAgainstLists } from './utils/urlaccessmanager.js';

console.log('[Background] Service worker loaded');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  if (!tab.url.startsWith('http')) return;

  try {
    const url = new URL(tab.url);
    const domain = url.hostname.replace(/^www\./, '').toLowerCase();

    if (domain.includes('reddit.com')) {
      handleReddit(tabId, tab.url);
    } else if (domain.includes('youtube.com')) {
      handleYouTube(tabId, tab.url);
    } else {
      // General case for all other websites
      chrome.storage.local.get(['whitelist', 'blacklist'], (result) => {
        const decision = checkUrlAgainstLists(tab.url, result.whitelist || [], result.blacklist || []);
        if (decision === 'block') {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
        }
      });
    }
  } catch (e) {
    console.error('[Background] Error parsing tab URL:', tab.url, e);
  }
});
