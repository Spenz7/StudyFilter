// scripts/background.js
import { handleReddit } from './handlers/reddithandler.js';
import { handleYouTube } from './handlers/youtubehandler.js';
import { checkUrlAgainstLists } from './utils/urlaccessmanager.js';

console.log('[Background] Service worker loaded');

// Handle non-Reddit/YouTube URLs via whitelist/blacklist
function handleGenericUrl(tabId, url) {
  chrome.storage.local.get(['whitelist', 'blacklist'], ({ whitelist = [], blacklist = [] }) => {
    const decision = checkUrlAgainstLists(url, whitelist, blacklist);
    if (decision === 'block') {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  if (!tab.url.startsWith('http')) return;

  try {
    const urlObj = new URL(tab.url);
    const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

    if (domain.includes('reddit.com')) {
      handleReddit(tabId, tab.url);
    } else if (domain.includes('youtube.com')) {
      handleYouTube(tabId, tab.url);
    } else {
      handleGenericUrl(tabId, tab.url);
    }

  } catch (e) {
    console.error('[Background] Error parsing tab URL:', tab.url, e);
  }
});
