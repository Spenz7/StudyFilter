import { handleReddit } from './redditHandler.js';
import { handleYouTube } from './youtubeHandler.js';

console.log("Service worker loaded");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;
  if (tab.url.startsWith("chrome-extension://")) return;

  const domain = new URL(tab.url).hostname.replace(/^www\./, "").toLowerCase();

  if (domain.includes("reddit.com")) {
    handleReddit(tabId, tab.url);
  } else if (domain.includes("youtube.com")) {
    handleYouTube(tabId, tab.url);
  }
});
