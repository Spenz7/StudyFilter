document.addEventListener("DOMContentLoaded", () => {
  const addWhitelistBtn = document.getElementById("add-whitelist");
  const removeWhitelistBtn = document.getElementById("remove-whitelist");
  const addBlacklistBtn = document.getElementById("add-blacklist");
  const removeBlacklistBtn = document.getElementById("remove-blacklist");
  const status = document.getElementById("status");

  // Get current tab's URL (not just domain)
  function getCurrentUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return callback(null);
      try {
        const url = tabs[0].url;
        if (url.endsWith("reminder.html") || url.startsWith("chrome-extension://")) {
          // If on reminder.html, get lastBlockedDomain from storage
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

  function showStatus(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? "red" : "green";
  }

  function isReminderUrl(url) {
    // Prevent adding reminder.html or extension pages
    return url && (url.endsWith("reminder.html") || url.startsWith("chrome-extension://"));
  }

  function updateLists() {
  chrome.storage.local.get(["whitelist", "blacklist"], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
    const whitelistList = document.getElementById("whitelist-list");
    const blacklistList = document.getElementById("blacklist-list");

    // Whitelist with remove buttons (show URLs as hyperlinks)
  whitelistList.innerHTML = "";
  whitelist.forEach(url => {
    const li = document.createElement("li");
  
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    link.target = "_blank";  // Open in new tab
    link.rel = "noopener noreferrer"; // Security best practice
    link.style.marginRight = "8px";
  
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.style.marginLeft = "8px";
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


    // Blacklist with remove buttons
    blacklistList.innerHTML = "";
    blacklist.forEach(url => {
      const li = document.createElement("li");
      li.textContent = url + " ";
      const btn = document.createElement("button");
      btn.textContent = "Remove";
      btn.style.marginLeft = "8px";
      btn.onclick = () => {
        const newBlacklist = blacklist.filter(d => d !== url);
        chrome.storage.local.set({ blacklist: newBlacklist }, () => {
          showStatus(`Removed ${url} from blacklist`);
          updateLists();
        });
      };
      li.appendChild(btn);
      blacklistList.appendChild(li);
    });
  });
}

  // Call updateLists when popup loads
  updateLists();

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

  removeWhitelistBtn.onclick = () => {
    getCurrentUrl((url) => {
      if (!url || isReminderUrl(url)) return showStatus("Cannot remove reminder.html", true);
      chrome.storage.local.get(["whitelist"], (data) => {
        let whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
        if (!whitelist.includes(url)) {
          showStatus("Not in whitelist", true);
        } else {
          whitelist = whitelist.filter(d => d !== url);
          chrome.storage.local.set({ whitelist }, () => {
            showStatus("Removed from whitelist");
            updateLists();
          });
        }
      });
    });
  };

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
  
            // Immediately redirect current tab to reminder.html
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs.length === 0) return;
              const currentTabId = tabs[0].id;
              chrome.tabs.update(currentTabId, { url: chrome.runtime.getURL('reminder.html') });
            });
          });
        }
      });
    });
  };


  removeBlacklistBtn.onclick = () => {
    getCurrentUrl((url) => {
      if (!url || isReminderUrl(url)) return showStatus("Cannot remove reminder.html", true);
      chrome.storage.local.get(["blacklist"], (data) => {
        let blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];
        if (!blacklist.includes(url)) {
          showStatus("Not in blacklist", true);
        } else {
          blacklist = blacklist.filter(d => d !== url);
          chrome.storage.local.set({ blacklist }, () => {
            showStatus("Removed from blacklist");
            updateLists();
          });
        }
      });
    });
  };
});
