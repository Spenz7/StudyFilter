import { isRelevantToTopics } from './aiCheck.js';

export async function handleYouTube(tabId, url) {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // Handle YouTube search query filtering
    if (params.has('search_query')) {
      const searchQuery = params.get('search_query');

      chrome.storage.local.get(['allowedTopics'], async (data) => {
        const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

        const isRelevant = await isRelevantToTopics(searchQuery, allowedTopics);

        if (!isRelevant) {
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL('reminder.html'),
          });
        }
      });

      return; // Early return; we don’t want to continue to video handler if already handled
    }

    // TODO: Step 6 — Handle YouTube video titles (watch?v=...)
    
  } catch (e) {
    console.error('Error in handleYouTube:', e);
  }
}
