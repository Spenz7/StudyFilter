// background.js

// List of blacklisted domains (example)
const blacklist = [
  "youtube.com",
  "facebook.com",
  "twitter.com"
];

// Helper: check if URL contains any blacklisted domain
function isBlacklisted(url) {
  return blacklist.some(domain => url.includes(domain));
}

// Listen for when a tab is updated (like URL change)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (isBlacklisted(tab.url)) {
      // Redirect to the reminder page
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
    }
  }
});
