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

// Check if a domain is in a list (exact match)
function domainInList(domain, list) {
  return list.includes(domain);
}

// Redirect logic for blacklisted domains (only if not whitelisted)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  // Prevent redirect loops — skip internal extension pages
  if (tab.url.startsWith("chrome-extension://")) return;

  const domain = getDomainFromTab(tab);
  if (!domain) return;

  // Get lists and apply logic
  chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    if (domainInList(domain, whitelist)) return;

    if (domainInList(domain, blacklist)) {
      console.log(`Redirecting blacklisted domain: ${domain}`);
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL("reminder.html") });
    }
  });
});

// Add domain to a list
function addToList(domain, listName) {
  chrome.storage.local.get([listName], (data) => {
    let list = Array.isArray(data[listName]) ? data[listName] : [];
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

// Remove domain from a list
function removeFromList(domain, listName) {
  chrome.storage.local.get([listName], (data) => {
    let list = Array.isArray(data[listName]) ? data[listName] : [];
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

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const tab = tabs[0];
    const domain = getDomainFromTab(tab);
    if (!domain) {
      console.warn("Could not extract domain from tab URL.");
      return;
    }

    switch (command) {
      case "add-to-blacklist":
        addToList(domain, "blacklist");
        chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("reminder.html") });
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
