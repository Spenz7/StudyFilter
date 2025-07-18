import { setupRedditHandlers } from "./redditUI.js";
import { setupYouTubeHandlers } from "./youtubeUI.js";

document.addEventListener("DOMContentLoaded", () => {
  setupRedditHandlers();
  setupYouTubeHandlers();
});
