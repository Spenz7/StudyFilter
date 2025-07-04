// background.js

let blacklist = [];
let whitelist = [];

// Load blacklist and whitelist from storage or initialize with defaults
function loadLists() {
  chrome.storage.local.get(["blacklist", "whitelist"], (data) => {
    if (Array.isArray(data.blacklist) && data.blacklist.length > 0) {
      blacklist = data.blacklist;
      console.log("Blacklist loaded:", blacklist);
    } else {
      blacklist = ["youtube.com", "facebook.com", "twitter.com", "instagram.com"];
      chrome.storage.local.set({ blacklist }, () => {
        console.log("Blacklist initialized with defaults:", blacklist);
      });
    }

    if (Array.isArray(data.whitelist) && data.whitelist.length > 0) {
      whitelist = data.whitelist;
      console.log("Whitelist loaded:", whitelist);
    } else {
      whitelist = [];
      chrome.storage.local.set({ whitelist }, () => {
        console.log("Whitelist initialized as empty.");
      });
    }
  });
}

// Initial load
loadLists();
chrome.runtime.onInstalled.addListener(loadLists);
chrome.runtime.onStartup.addListener(loadLists);

// Check if URL matches any domain in a list
function domainInList(url, list) {
  return list.some(domain => url.includes(domain));
}

// Redirect tab if blacklisted and NOT whitelisted
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (domainInList(tab.url, whitelist)) {
      // Whitelisted — do nothing
      return;
    }
    if (domainInList(tab.url, blacklist)) {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
    }
  }
});

// Helper to get domain from tab URL
function getDomainFromTab(tab) {
  try {
    const url = new URL(tab.url);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Add domain to list and persist
function addToList(domain, listName) {
  if (domain === null) return;
  let list = listName === "blacklist" ? blacklist : whitelist;
  if (!list.includes(domain)) {
    list.push(domain);
    chrome.storage.local.set({ [listName]: list }, () => {
      console.log(`Added ${domain} to ${listName}`);
    });
  } else {
    console.log(`${domain} already in ${listName}`);
  }
}

// Remove domain from list and persist
function removeFromList(domain, listName) {
  if (domain === null) return;
  let list = listName === "blacklist" ? blacklist : whitelist;
  const index = list.indexOf(domain);
  if (index !== -1) {
    list.splice(index, 1);
    chrome.storage.local.set({ [listName]: list }, () => {
      console.log(`Removed ${domain} from ${listName}`);
    });
  } else {
    console.log(`${domain} not found in ${listName}`);
  }
}

// Keyboard shortcut handlers
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const domain = getDomainFromTab(tabs[0]);
    if (!domain) {
      console.warn("Invalid URL or domain");
      return;
    }

    switch (command) {
      case "add-to-blacklist":
        addToList(domain, "blacklist");
        // Redirect immediately
        chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL("reminder.html") });
        break;

      case "remove-from-blacklist":
        removeFromList(domain, "blacklist");
        break;

      case "add-to-whitelist":
        addToList(domain, "whitelist");
        break;

      case "remove-from-whitelist":
        removeFromList(domain, "whitelist");
        break;

      default:
        console.log("Unknown command:", command);
    }
  });
});
