// scripts/utils/urlaccessmanager.js

/**
 * Checks the current URL against the provided whitelist and blacklist.
 * 
 * @param {string} url - The full URL of the current page/tab.
 * @param {string[]} whitelist - Array of URL prefixes allowed.
 * @param {string[]} blacklist - Array of URL prefixes blocked.
 * @returns {"allow" | "block" | "neutral"} - Result of the check.
 */
export function checkUrlAgainstLists(url, whitelist, blacklist) {
  if (!url || typeof url !== "string") return "neutral";

  // Normalize to lower-case to prevent casing inconsistencies
  const normalizedUrl = url.toLowerCase();

  if (Array.isArray(whitelist) && whitelist.some(prefix => normalizedUrl.startsWith(prefix.toLowerCase()))) {
    return "allow";
  }

  if (Array.isArray(blacklist) && blacklist.some(prefix => normalizedUrl.startsWith(prefix.toLowerCase()))) {
    return "block";
  }

  return "neutral";
}
