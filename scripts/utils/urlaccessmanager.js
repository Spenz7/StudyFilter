// scripts/utils/urlaccessmanager.js

/**
 * Checks the current URL against the provided whitelist and blacklist.
 * 
 * @param {string} url - The full URL of the current page/tab.
 * @param {string[]} whitelist - Array of URL prefixes allowed.
 * @param {string[]} blacklist - Array of URL prefixes blocked.
 * @returns {"allow" | "block" | "neutral"} - Result of the check.
 */
export function checkUrlAgainstLists(url, whitelist = [], blacklist = []) {
  if (!url || typeof url !== "string") return "neutral";

  try {
    const urlObj = new URL(url);
    // Normalize hostname (remove www) + pathname, lowercase
    const normalizedUrl = `${urlObj.hostname.replace(/^www\./, '')}${urlObj.pathname}`.toLowerCase();

    // Helper: normalize prefixes same way (support full URLs or just domains)
    function normalizePrefix(prefix) {
      try {
        // Try parsing prefix as URL, relative to given url if needed
        const p = new URL(prefix, url);
        return `${p.hostname.replace(/^www\./, '')}${p.pathname}`.toLowerCase();
      } catch {
        // If prefix is not full URL, just lowercase and trim
        return prefix.toLowerCase().trim();
      }
    }

    // Check whitelist first — if any prefix matches start of normalizedUrl, allow
    if (Array.isArray(whitelist) && whitelist.some(prefix => {
      const normPrefix = normalizePrefix(prefix);
      return normalizedUrl.startsWith(normPrefix);
    })) {
      return "allow";
    }

    // Check blacklist next — if any prefix matches start of normalizedUrl, block
    if (Array.isArray(blacklist) && blacklist.some(prefix => {
      const normPrefix = normalizePrefix(prefix);
      return normalizedUrl.startsWith(normPrefix);
    })) {
      return "block";
    }

    // Otherwise neutral
    return "neutral";

  } catch (e) {
    console.error('[URLAccessManager] Invalid URL:', url, e);
    return "neutral";
  }
}
