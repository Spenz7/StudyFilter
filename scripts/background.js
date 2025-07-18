import { handleReddit } from './reddithandler.js';
import { handleYouTube } from './youtubehandler.js';

console.log("Background script loaded");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  try {
    // Ignore internal extension pages
    if (tab.url.startsWith("chrome-extension://")) return;

    const url = new URL(tab.url);
    const domain = url.hostname.replace(/^www\./, "").toLowerCase();

    if (domain.includes("reddit.com")) {
      handleReddit(tabId, tab.url);
    } else if (domain.includes("youtube.com")) {
      // Don't await since this listener must remain synchronous
      handleYouTube(tabId, tab.url);
    }
  } catch (e) {
    console.error("Error parsing tab URL:", tab.url, e);
  }
});
