import { isRelevantToTopics } from '../aicheck.js';

/**
 * Normalizes and sanitizes Google search queries
 * Mirrors YouTube sanitization for consistency
 */
function sanitizeQuery(query) {
  return query
    .slice(0, 35)
    .replace(/\p{Emoji}/gu, '')
    .replace(/[^\w\s\-\+#\$%&*\.\/\?\!',]/gi, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function validateTopics(topics) {
  if (!Array.isArray(topics)) return false;
  if (topics.length > 10) return false;
  return topics.every(topic => typeof topic === 'string');
}

export async function handleGoogle(tabId, url) {
  try {
    const urlObj = new URL(url);

    // Only intercept actual Google searches
    if (urlObj.pathname !== '/search') return;

    const rawQuery = urlObj.searchParams.get('q');
    if (!rawQuery) return;

    const searchQuery = sanitizeQuery(rawQuery);

    if (!searchQuery || searchQuery.length < 2) {
      console.warn('Google handler: invalid or short query');
      return;
    }

    const data = await chrome.storage.local.get(['allowedTopics', 'filterLevel']);
    const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];
    const filterLevel = ['strict', 'lenient'].includes(data.filterLevel)
      ? data.filterLevel
      : 'strict';

    if (!validateTopics(allowedTopics) || allowedTopics.length === 0) {
      return; // fail-open, same as YouTube
    }

    const relevant = await isRelevantToTopics(
      searchQuery,
      allowedTopics,
      filterLevel
    );

    if (!relevant) {
      await chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('reminder.html')
      });
    }

  } catch (e) {
    console.error('Google handler error:', e);
    // Fail-open on error
  }
}
