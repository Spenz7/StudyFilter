// redditUI.js
// This module works for general blacklisting of any site AND also 
// as a Reddit subreddit filter (only view certain subreddits) where you whitelist subreddits and blacklist reddit.com.

function getCurrentUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return callback(null);
    try {
      const url = tabs[0].url;
      if (isReminderUrl(url)) {
        chrome.storage.local.get(["lastBlockedDomain"], (data) => {
          callback(data.lastBlockedDomain || null);
        });
      } else {
        callback(url);
      }
    } catch {
      callback(null);
    }
  });
}

function isReminderUrl(url) {
  return url && (url.endsWith("reminder.html") || url.startsWith("chrome-extension://"));
}

function showStatus(msg, isError = false) {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = msg;
    status.style.color = isError ? "red" : "green";
  }
}

function updateLists() {
  chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    const whitelistList = document.getElementById("whitelist-list");
    const blacklistList = document.getElementById("blacklist-list");

    if (!whitelistList || !blacklistList) return;

    whitelistList.innerHTML = "";
    whitelist.forEach(url => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = url;
      link.textContent = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.marginRight = "8px";

      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.onclick = () => removeFromList('whitelist', url);

      li.appendChild(link);
      li.appendChild(btn);
      whitelistList.appendChild(li);
    });

    blacklistList.innerHTML = "";
    blacklist.forEach(url => {
      const li = document.createElement("li");

      const textNode = document.createTextNode(url + " ");
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.onclick = () => removeFromList('blacklist', url);

      li.appendChild(textNode);
      li.appendChild(btn);
      blacklistList.appendChild(li);
    });
  });
}

function addToList(type) {
  getCurrentUrl((url) => {
    if (!url || isReminderUrl(url)) return showStatus("Cannot add reminder.html", true);

    chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
      const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
      const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

      const list = type === 'whitelist' ? whitelist : blacklist;
      const otherList = type === 'whitelist' ? blacklist : whitelist;

      if (list.includes(url)) {
        showStatus(`Already in ${type}`, true);
      } else if (otherList.includes(url)) {
        showStatus(`Remove from ${type === 'whitelist' ? 'blacklist' : 'whitelist'} first`, true);
      } else {
        list.push(url);
        chrome.storage.local.set({ [type]: list }, () => {
          showStatus(`Added to ${type}`);
          updateLists();

          if (type === 'blacklist') {
            // Redirect to reminder.html after adding to blacklist
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs.length === 0) return;
              chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL("reminder.html") });
            });
          }
        });
      }
    });
  });
}

function removeFromList(type, urlToRemove = null) {
  if (urlToRemove) {
    // Remove specific URL passed as argument (used for list remove buttons)
    performRemove(type, urlToRemove);
  } else {
    // Remove current tab URL (used for remove button linked to current tab)
    getCurrentUrl((url) => {
      if (!url || isReminderUrl(url)) return showStatus("Cannot remove reminder.html", true);
      performRemove(type, url);
    });
  }
}

function performRemove(type, url) {
  chrome.storage.local.get([type], (data) => {
    const list = Array.isArray(data[type]) ? data[type] : [];
    if (!list.includes(url)) {
      showStatus(`Not in ${type}`, true);
    } else {
      const newList = list.filter(d => d !== url);
      chrome.storage.local.set({ [type]: newList }, () => {
        showStatus(`Removed from ${type}`);
        updateLists();
      });
    }
  });
}

function setupSiteHandlers() {
  const addWhitelistBtn = document.getElementById("add-whitelist");
  const removeWhitelistBtn = document.getElementById("remove-whitelist");
  const addBlacklistBtn = document.getElementById("add-blacklist");
  const removeBlacklistBtn = document.getElementById("remove-blacklist");

  if (addWhitelistBtn) addWhitelistBtn.onclick = () => addToList('whitelist');
  if (removeWhitelistBtn) removeWhitelistBtn.onclick = () => removeFromList('whitelist');
  if (addBlacklistBtn) addBlacklistBtn.onclick = () => addToList('blacklist');
  if (removeBlacklistBtn) removeBlacklistBtn.onclick = () => removeFromList('blacklist');

  updateLists();
}

export { setupRedditHandlers };
