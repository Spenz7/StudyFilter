import { setupRedditHandlers, updateLists } from "./redditUI.js";
import { setupYouTubeHandlers } from "./youtubeUI.js";

document.addEventListener("DOMContentLoaded", () => {
  setupRedditHandlers();
  setupYouTubeHandlers();

  // Initialize filter level
  chrome.storage.local.get({ filterLevel: 'lenient' }, ({ filterLevel }) => {
    chrome.storage.local.set({ filterLevel });
    const strictBtn = document.getElementById("strictFilter");
    const lenientBtn = document.getElementById("lenientFilter");
    if (filterLevel === 'strict') {
      strictBtn.checked = true;
    } else {
      lenientBtn.checked = true;
    }
  });

  // Restore dropdown states and then update lists
  restoreDropdownState("whitelist-list", "whitelist-toggle", "whitelistOpen");
  restoreDropdownState("blacklist-list", "blacklist-toggle", "blacklistOpen");

  // Call updateLists to fill dropdowns on popup load
  updateLists();

  // Setup filter mode click handlers
  document.getElementById("strictFilter").addEventListener("click", () => {
    chrome.storage.local.set({ filterLevel: 'strict' }, () => {
      alert("Filter set to strict.");
    });
  });

  document.getElementById("lenientFilter").addEventListener("click", () => {
    chrome.storage.local.set({ filterLevel: 'lenient' }, () => {
      alert("Filter set to lenient.");
    });
  });

  // Dropdown toggle handlers
  document.getElementById("whitelist-toggle").addEventListener("click", () => {
    const list = document.getElementById("whitelist-list");
    const toggle = document.getElementById("whitelist-toggle");
    const isOpen = list.classList.toggle("hidden") === false;
    toggle.textContent = `Whitelist ${isOpen ? "▲" : "▼"}`;
    chrome.storage.local.set({ whitelistOpen: isOpen });
  });

  document.getElementById("blacklist-toggle").addEventListener("click", () => {
    const list = document.getElementById("blacklist-list");
    const toggle = document.getElementById("blacklist-toggle");
    const isOpen = list.classList.toggle("hidden") === false;
    toggle.textContent = `Blacklist ${isOpen ? "▲" : "▼"}`;
    chrome.storage.local.set({ blacklistOpen: isOpen });
  });
});

function restoreDropdownState(id, toggleId, storageKey) {
  chrome.storage.local.get(storageKey, (result) => {
    const isOpen = result[storageKey];
    const content = document.getElementById(id);
    const header = document.getElementById(toggleId);
    if (isOpen) {
      content.classList.remove("hidden");
      header.textContent = header.textContent.replace("▼", "▲");
    } else {
      content.classList.add("hidden");
      header.textContent = header.textContent.replace("▲", "▼");
    }
  });
}
