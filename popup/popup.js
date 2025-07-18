import { setupRedditHandlers } from "./redditUI.js";
import { setupYouTubeHandlers } from "./youtubeUI.js";

document.addEventListener("DOMContentLoaded", () => {
  setupRedditHandlers();
  setupYouTubeHandlers();

  // 1) Initialize filterLevel in storage (default to 'lenient'),
  //    then update the UI toggle/radio buttons accordingly.
  chrome.storage.local.get({ filterLevel: 'lenient' }, ({ filterLevel }) => {
    // ensure the key is set
    chrome.storage.local.set({ filterLevel });

    // update UI state (assumes these are radio inputs or toggles)
    const strictBtn = document.getElementById("strictFilter");
    const lenientBtn = document.getElementById("lenientFilter");
    if (filterLevel === 'strict') {
      strictBtn.checked = true;
    } else {
      lenientBtn.checked = true;
    }
  });

  // 2) Click handlers to change mode
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
});

document.querySelectorAll('.dropdown-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const list = document.getElementById(targetId);
    list.classList.toggle('show');
    button.textContent = button.textContent.includes('▼')
      ? button.textContent.replace('▼', '▲')
      : button.textContent.replace('▲', '▼');
  });
});
