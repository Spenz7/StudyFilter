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

  // Prefill reminder text
  chrome.storage.local.get(['reminderTextLines'], ({ reminderTextLines }) => {
    if (Array.isArray(reminderTextLines)) {
      const textarea = document.getElementById('reminder-textarea');
      if (textarea) {
        textarea.value = reminderTextLines.join('\n');
      }
    }
  });
});

// Export settings (with image and reminder text)
document.getElementById('export-settings').addEventListener('click', async () => {
  const data = await chrome.storage.local.get([
    'whitelist',
    'blacklist',
    'allowedTopics',
    'filterLevel',
    'reminderImage',
    'reminderTextLines'
  ]);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'studyfilter-settings.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import settings (with image and reminder text)
document.getElementById('import-settings').addEventListener('click', () => {
  document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);
    const {
      whitelist,
      blacklist,
      allowedTopics,
      filterLevel,
      reminderImage,
      reminderTextLines
    } = json;

    await chrome.storage.local.set({
      ...(Array.isArray(whitelist) && { whitelist }),
      ...(Array.isArray(blacklist) && { blacklist }),
      ...(Array.isArray(allowedTopics) && { allowedTopics }),
      ...(typeof filterLevel === 'string' && { filterLevel }),
      ...(typeof reminderImage === 'string' && { reminderImage }),
      ...(Array.isArray(reminderTextLines) && { reminderTextLines })
    });

    alert('Settings imported successfully.');
    location.reload();
  } catch (e) {
    alert('Invalid settings file.');
  }
});

// Helper: convert file to base64
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Unified handler for image upload
document.getElementById('upload-reminder-image').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const fileNameSpan = document.getElementById('file-name');
  const imageStatus = document.getElementById('imageStatus');

  if (file) {
    fileNameSpan.textContent = file.name;
    try {
      const dataUrl = await readFileAsDataURL(file);
      await chrome.storage.local.set({ reminderImage: dataUrl });
      if (imageStatus) imageStatus.textContent = "Image uploaded successfully.";
    } catch (error) {
      console.error("Failed to upload image", error);
      if (imageStatus) imageStatus.textContent = "Failed to upload image.";
    }
  } else {
    fileNameSpan.textContent = 'No file chosen';
  }
});

// Save reminder text
document.getElementById('save-reminder-text').addEventListener('click', async () => {
  const textarea = document.getElementById('reminder-textarea');
  const status = document.getElementById('textStatus');
  const lines = textarea.value.split('\n').slice(0, 3);
  await chrome.storage.local.set({ reminderTextLines: lines });
  if (status) status.textContent = "Reminder text saved.";
});
