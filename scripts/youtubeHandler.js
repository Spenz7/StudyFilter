// youtubehandler.js
import { isRelevantToTopics } from './aicheck.js';

function getStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => resolve(result));
  });
}

export async function handleYouTube(tabId, url) {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    if (params.has('search_query')) {
      const searchQuery = params.get('search_query');

      // Await storage retrieval
      const data = await getStorage(['allowedTopics', 'filterLevel']);
      const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];
      const filterLevel = data.filterLevel || 'strict';

      if (allowedTopics.length === 0) {
        // No topics set, skip filtering
        return;
      }

      const relevant = await isRelevantToTopics(searchQuery, allowedTopics, filterLevel);

      if (!relevant) {
        await chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
      }
    }

    // TODO: handle video page (watch?v=...) later

  } catch (e) {
    console.error('Error in handleYouTube:', e);
  }
}
