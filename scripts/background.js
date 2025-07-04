// background.js

const BLOCKED_DOMAINS = [
  "youtube.com",
  "reddit.com",
  "instagram.com",
  "facebook.com",
  "linkedin.com"
];

// Extract domain from tab URL (strips www. and normalizes case)
function getDomainFromTab(tab) {
  try {
    const url = new URL(tab.url);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Redirect logic for hardcoded blacklisted domains
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (tab.url.startsWith("chrome-extension://")) return;

  const domain = getDomainFromTab(tab);
  if (!domain) return;

  if (BLOCKED_DOMAINS.some(blocked => domain === blocked || domain.endsWith("." + blocked))) {
    // Already on reminder.html? Don't redirect again.
    if (!tab.url.endsWith("reminder.html")) {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
    }
  }
});
