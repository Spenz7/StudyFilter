import { setupRedditHandlers } from "./redditUI.js";
import { setupYouTubeHandlers } from "./youtubeUI.js";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function initFilterLevelUI(filterLevel) {
  const currentLabel = document.getElementById("current-filter-mode");
  if (currentLabel) {
    currentLabel.textContent = capitalize(filterLevel);
  }
}

function setupFilterLevelListeners() {
  const currentLabel = document.getElementById("current-filter-mode");

  document.getElementById("strictFilter").addEventListener("click", () => {
    chrome.storage.local.set({ filterLevel: 'strict' }, () => {
      if (currentLabel) currentLabel.textContent = `Strict`;
    });
  });

  document.getElementById("lenientFilter").addEventListener("click", () => {
    chrome.storage.local.set({ filterLevel: 'lenient' }, () => {
      if (currentLabel) currentLabel.textContent = `Lenient`;
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
    chrome.storage.local.set({ filterLevel }); // Ensure key exists
    initFilterLevelUI(filterLevel);
  });

  setupFilterLevelListeners();
  setupDropdownToggles();
});

document.getElementById('export-settings').addEventListener('click', async () => {
  const data = await chrome.storage.local.get(['whitelist', 'blacklist', 'allowedTopics', 'filterLevel']);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'studyfilter-settings.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-settings').addEventListener('click', () => {
  document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  try {
    const json = JSON.parse(text);
    const { whitelist, blacklist, allowedTopics, filterLevel } = json;

    await chrome.storage.local.set({
      ...(Array.isArray(whitelist) && { whitelist }),
      ...(Array.isArray(blacklist) && { blacklist }),
      ...(Array.isArray(allowedTopics) && { allowedTopics }),
      ...(typeof filterLevel === 'string' && { filterLevel }),
    });

    alert('Settings imported successfully.');
    location.reload();
  } catch (e) {
    alert('Invalid settings file.');
  }
});
