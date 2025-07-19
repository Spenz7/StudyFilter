import { setupRedditHandlers } from "./redditUI.js";
import { setupYouTubeHandlers } from "./youtubeUI.js";

function initFilterLevelUI(filterLevel) {
  const strictBtn = document.getElementById("strictFilter");
  const lenientBtn = document.getElementById("lenientFilter");

  if (filterLevel === 'strict') {
    strictBtn.checked = true;
  } else {
    lenientBtn.checked = true;
  }
}

function setupFilterLevelListeners() {
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
}

function setupDropdownToggles() {
  document.querySelectorAll('.dropdown-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const list = document.getElementById(targetId);
      if (!list) return;
      list.classList.toggle('show');
      button.textContent = button.textContent.includes('▼')
        ? button.textContent.replace('▼', '▲')
        : button.textContent.replace('▲', '▼');
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupRedditHandlers();
  setupYouTubeHandlers();

  chrome.storage.local.get({ filterLevel: 'lenient' }, ({ filterLevel }) => {
    // Make sure storage has the filterLevel key set
    chrome.storage.local.set({ filterLevel });
    initFilterLevelUI(filterLevel);
  });

  setupFilterLevelListeners();
  setupDropdownToggles();
});
