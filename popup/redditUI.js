// redditUI.js

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
      btn.onclick = () => {
        const newWhitelist = whitelist.filter(d => d !== url);
        chrome.storage.local.set({ whitelist: newWhitelist }, () => {
          showStatus(`Removed ${url} from whitelist`);
          updateLists();
        });
      };

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
      btn.onclick = () => {
        const newBlacklist = blacklist.filter(d => d !== url);
        chrome.storage.local.set({ blacklist: newBlacklist }, () => {
          showStatus(`Removed ${url} from blacklist`);
          updateLists();
        });
      };

      li.appendChild(textNode);
      li.appendChild(btn);
      blacklistList.appendChild(li);
    });
  });
}

function setupRedditHandlers() {
  const addWhitelistBtn = document.getElementById("add-whitelist");
  const removeWhitelistBtn = document.getElementById("remove-whitelist");
  const addBlacklistBtn = document.getElementById("add-blacklist");
  const removeBlacklistBtn = document.getElementById("remove-blacklist");

  if (addWhitelistBtn) {
    addWhitelistBtn.onclick = () => {
      getCurrentUrl((url) => {
        if (!url || isReminderUrl(url)) return showStatus("Cannot add reminder.html", true);
        chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
          const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
          const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

          if (whitelist.includes(url)) {
            showStatus("Already in whitelist", true);
          } else if (blacklist.includes(url)) {
            showStatus("Remove from blacklist first", true);
          } else {
            whitelist.push(url);
            chrome.storage.local.set({ whitelist }, () => {
              showStatus("Added to whitelist");
              updateLists();
            });
          }
        });
      });
    };
  }

  if (removeWhitelistBtn) {
    removeWhitelistBtn.onclick = () => {
      getCurrentUrl((url) => {
        if (!url || isReminderUrl(url)) return showStatus("Cannot remove reminder.html", true);
        chrome.storage.local.get(["whitelist"], (data) => {
          const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
          if (!whitelist.includes(url)) {
            showStatus("Not in whitelist", true);
          } else {
            const newWhitelist = whitelist.filter(d => d !== url);
            chrome.storage.local.set({ whitelist: newWhitelist }, () => {
              showStatus("Removed from whitelist");
              updateLists();
            });
          }
        });
      });
    };
  }

  if (addBlacklistBtn) {
    addBlacklistBtn.onclick = () => {
      getCurrentUrl((url) => {
        if (!url || isReminderUrl(url)) return showStatus("Cannot add reminder.html", true);
        chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
          const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
          const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

          if (whitelist.includes(url)) {
            showStatus("Cannot blacklist a whitelisted URL", true);
          } else if (blacklist.includes(url)) {
            showStatus("Already in blacklist", true);
          } else {
            blacklist.push(url);
            chrome.storage.local.set({ blacklist }, () => {
              showStatus("Added to blacklist");
              updateLists();

              // Redirect to reminder.html
              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return;
                chrome.tabs.update(tabs[0].id, { url: chrome.runtime.getURL("reminder.html") });
              });
            });
          }
        });
      });
    };
  }

  if (removeBlacklistBtn) {
    removeBlacklistBtn.onclick = () => {
      getCurrentUrl((url) => {
        if (!url || isReminderUrl(url)) return showStatus("Cannot remove reminder.html", true);
        chrome.storage.local.get(["blacklist"], (data) => {
          const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
          if (!blacklist.includes(url)) {
            showStatus("Not in blacklist", true);
          } else {
            const newBlacklist = blacklist.filter(d => d !== url);
            chrome.storage.local.set({ blacklist: newBlacklist }, () => {
              showStatus("Removed from blacklist");
              updateLists();
            });
          }
        });
      });
    };
  }

  updateLists();
}

export { setupRedditHandlers, updateLists };
