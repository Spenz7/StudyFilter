// scripts/background.js
import { handleReddit } from './handlers/reddithandler.js';
import { handleYouTube } from './handlers/youtubehandler.js';
import { handleGoogle } from './handlers/googlehandler.js';

import { checkUrlAgainstLists } from './utils/urlaccessmanager.js';

console.log('[Background] Service worker loaded');

// Cache whitelist and blacklist in memory for faster access
let whitelist = [];
let blacklist = [];

// Load lists from storage initially and on change
async function loadLists() {
  const data = await chrome.storage.local.get(['whitelist', 'blacklist']);
  whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
  blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
  console.log('[Background] Loaded whitelist and blacklist:', whitelist, blacklist);
}
loadLists();

chrome.storage.onChanged.addListener((changes) => {
  if (changes.whitelist) {
    whitelist = Array.isArray(changes.whitelist.newValue) ? changes.whitelist.newValue : [];
    console.log('[Background] Updated whitelist:', whitelist);
  }
  if (changes.blacklist) {
    blacklist = Array.isArray(changes.blacklist.newValue) ? changes.blacklist.newValue : [];
    console.log('[Background] Updated blacklist:', blacklist);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url || !tab.url.startsWith('http')) return;

  try {
    // Normalize and check blacklist/whitelist first
    const decision = checkUrlAgainstLists(tab.url, whitelist, blacklist);
    if (decision === 'block') {
      console.log(`[Background] Blocking tab ${tabId} URL: ${tab.url}`);
      await chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
      return;
    }

    // Then handle platform-specific logic
    const urlObj = new URL(tab.url);
    const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

    if (domain.includes('reddit.com')) {
      await handleReddit(tabId, tab.url);
      return;
    }

    if (domain.includes('youtube.com')) {
      await handleYouTube(tabId, tab.url);
      return;
    }

    if (domain.startsWith('google.')) {
      await handleGoogle(tabId, tab.url);
      return;
    }

    // Other URLs: no action needed
  } catch (e) {
    console.error('[Background] Error handling tab URL:', tab.url, e);
  }
});
