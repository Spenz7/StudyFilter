export function handleReddit(tabId, url) {
  chrome.storage.local.get(['whitelist', 'blacklist'], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    // Debug logs - check these in background service worker console (chrome://extensions, enable "service worker" devtools)
    console.log('Checking Reddit URL:', url);
    console.log('Whitelist:', whitelist);
    console.log('Blacklist:', blacklist);

    // If URL matches any whitelist prefix, allow
    if (whitelist.some(prefix => url.startsWith(prefix))) {
      console.log('URL whitelisted, allowing:', url);
      return;
    }

    // If URL matches any blacklist prefix, block
    if (blacklist.some(prefix => url.startsWith(prefix))) {
      if (!url.endsWith('reminder.html')) {
        console.log('URL blacklisted, redirecting to reminder:', url);
        chrome.storage.local.set({ lastBlockedDomain: url }, () => {
          // Use setTimeout to avoid race condition
          setTimeout(() => {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL('reminder.html') });
          }, 50);
        });
      }
    }
  });
}
