import { isRelevantToTopics } from './aiCheck.js';

export async function handleYouTube(tabId, url) {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // Check if this is a search results page with a query
    if (params.has('search_query')) {
      const searchQuery = params.get('search_query');

      // Load allowedTopics from storage
      chrome.storage.local.get(['allowedTopics'], async (data) => {
        const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

        const relevant = await isRelevantToTopics(searchQuery, allowedTopics);

        if (!relevant) {
          // Redirect to reminder page if not relevant
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
        }
      });
    }

    // TODO: handle video page (watch?v=...) later

  } catch (e) {
    console.error('Error in handleYouTube:', e);
  }
}
