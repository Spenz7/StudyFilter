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

// Command listener for shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "add-to-blacklist") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const tab = tabs[0];
      try {
        const url = new URL(tab.url);
        const domain = url.hostname.replace(/^www\./, "");

        if (!blacklist.includes(domain)) {
          blacklist.push(domain);
          console.log(`Blacklisted: ${domain}`);
          chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("reminder.html") });
        } else {
          console.log(`Already blacklisted: ${domain}`);
        }
      } catch (e) {
        console.warn("Invalid URL", tab.url);
      }
    });
  }
});
