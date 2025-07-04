let blacklist = [];
let whitelist = [];

// Load from storage
function loadLists(callback) {
  chrome.storage.local.get(["blacklist", "whitelist"], (data) => {
    blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
    whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    console.log("Lists loaded:", { blacklist, whitelist });
    if (callback) callback();
  });
}

// Normalize domain
function getDomainFromTab(tab) {
  try {
    const url = new URL(tab.url);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// Check if domain is in list
function domainInList(url, list) {
  return list.some(domain => url.includes(domain));
}

// Redirect logic
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const currentUrl = tab.url;
    const domain = getDomainFromTab(tab);
    if (!domain) return;

    chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
      const whitelist = data.whitelist || [];
      const blacklist = data.blacklist || [];

      if (whitelist.includes(domain)) return; // allowed
      if (blacklist.includes(domain)) {
        chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
      }
    });
  }
});

// Add domain
function addToList(domain, listName) {
  chrome.storage.local.get([listName], (data) => {
    const list = Array.isArray(data[listName]) ? data[listName] : [];
    if (!list.includes(domain)) {
      list.push(domain);
      chrome.storage.local.set({ [listName]: list }, () => {
        console.log(`Added ${domain} to ${listName}`);
      });
    } else {
      console.log(`${domain} already in ${listName}`);
    }
  });
}

// Remove domain
function removeFromList(domain, listName) {
  chrome.storage.local.get([listName], (data) => {
    const list = Array.isArray(data[listName]) ? data[listName] : [];
    const index = list.indexOf(domain);
    if (index !== -1) {
      list.splice(index, 1);
      chrome.storage.local.set({ [listName]: list }, () => {
        console.log(`Removed ${domain} from ${listName}`);
      });
    } else {
      console.log(`${domain} not found in ${listName}`);
    }
  });
}

// Handle shortcut commands
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const domain = getDomainFromTab(tabs[0]);
    if (!domain) return;

    switch (command) {
      case "add-to-blacklist":
        addToList(domain, "blacklist");
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

// Load lists on startup
chrome.runtime.onInstalled.addListener(() => loadLists());
chrome.runtime.onStartup.addListener(() => loadLists());
