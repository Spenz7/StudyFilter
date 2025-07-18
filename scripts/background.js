// scripts/background.js
import { handleReddit } from './redditHandler.js';
import { handleYouTube } from './youtubeHandler.js';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (tab.url.startsWith("chrome-extension://")) return;

  const url = tab.url;

  chrome.storage.local.get(["whitelist", "blacklist"], async (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    // Whitelist check (prefix)
    if (whitelist.some(prefix => url.startsWith(prefix))) return;

    // Blacklist check (prefix)
    if (blacklist.some(prefix => url.startsWith(prefix))) {
      if (!url.endsWith("reminder.html")) {
        await chrome.storage.local.set({ lastBlockedDomain: url });
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
      }
      return;
    }

    // Delegate based on site
    if (url.includes("reddit.com")) {
      handleReddit(tabId, url);
    } else if (url.includes("youtube.com")) {
      handleYouTube(tabId, url);
    }
  });
});
