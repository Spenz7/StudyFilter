import { setupRedditHandlers } from "./redditui.js";
import { setupYouTubeHandlers } from "./youtubeui.js";

document.addEventListener("DOMContentLoaded", () => {
  setupRedditHandlers();
  setupYouTubeHandlers();

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
