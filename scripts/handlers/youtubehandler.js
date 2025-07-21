// scripts/handlers/youtubehandler.js

import { isRelevantToTopics } from '../aicheck.js';

/**
 * Normalizes and sanitizes search queries
 * - Truncates to 35 characters
 * - Removes all emojis
 * - Preserves letters, numbers, whitespace, common symbols (- + # $ % & * .)
 * - Converts to lowercase and trims whitespace
 */
function sanitizeQuery(query) {
  return query
    .slice(0, 35)                          // Truncate to max length
    .replace(/\p{Emoji}/gu, '')            // Remove all emojis
    .replace(/[^\w\s\-\+#\$%&*\.\.]/gi, '')// Allow . along with - + # $ % & *
    .replace(/\s+/g, ' ')                  // Collapse multiple spaces
    .toLowerCase()                         // Lowercase
    .trim();                               // Trim ends
}

/**
 * Validates topics array meets security requirements
 * - Ensures it's an array
 * - Limits to maximum 10 topics
 * - Checks each topic is a string
 */
function validateTopics(topics) {
  if (!Array.isArray(topics)) return false;
  if (topics.length > 10) return false;
  return topics.every(topic => typeof topic === 'string');
}

export async function handleYouTube(tabId, url) {
  try {
    const urlObj = new URL(url);
    if (!urlObj.searchParams.has('search_query')) return;

    // Sanitize input while preserving key symbols
    const rawQuery = urlObj.searchParams.get('search_query');
    const searchQuery = sanitizeQuery(rawQuery);
    
    // Validate input before processing
    if (!searchQuery || searchQuery.length < 2) {
      console.warn('Invalid search query - too short or empty');
      return;
    }

    // Get stored configuration
    const data = await chrome.storage.local.get(['allowedTopics', 'filterLevel']);
    const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];
    const filterLevel = ['strict', 'lenient'].includes(data.filterLevel) 
      ? data.filterLevel 
      : 'strict';

    // Validate topics before sending to AI
    if (!validateTopics(allowedTopics) || allowedTopics.length === 0) {
      console.warn('Invalid topics configuration - skipping check', allowedTopics);
      return;
    }

    // Perform AI relevance check with sanitized inputs
    const relevant = await isRelevantToTopics(
      searchQuery, 
      allowedTopics, 
      filterLevel
    );

    // Redirect if not relevant
    if (!relevant) {
      await chrome.tabs.update(tabId, { 
        url: chrome.runtime.getURL('reminder.html') 
      });
    }

  } catch (e) {
    console.error('YouTube handler error:', e);
    // Fail-open: Do not redirect on error
  }
}
