// scripts/redditHandler.js

export function handleRedditTab(tabId, url) {
  chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    // 1. Whitelist check (prefix match)
    if (whitelist.some(prefix => url.startsWith(prefix))) return;

    // 2. Blacklist check (prefix match)
    if (blacklist.some(prefix => url.startsWith(prefix))) {
      if (!url.endsWith("reminder.html")) {
        chrome.storage.local.set({ lastBlockedDomain: url }, () => {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
        });
      }
    }
    // 3. Otherwise, do nothing (allow page)
  });
}
