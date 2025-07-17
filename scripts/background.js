// background.js

// Extract domain from tab URL (strips www. and normalizes case)
function getDomainFromTab(tab) {
  try {
    const url = new URL(tab.url);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Check if domain is in a list (exact match or subdomain)
function domainInList(domain, list) {
  return list.some(blocked => domain === blocked || domain.endsWith("." + blocked));
}

// Main redirect logic
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (tab.url.startsWith("chrome-extension://")) return;

  const url = tab.url;
  if (!url) return;

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
});
