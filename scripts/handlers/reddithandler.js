// scripts/handlers/reddithandler.js
import { checkUrlAgainstLists } from '../utils/urlaccessmanager.js';

export function handleReddit(tabId, url) {
  chrome.storage.local.get(['whitelist', 'blacklist'], (data) => {
    const whitelist = Array.isArray(data.whitelist) ? data.whitelist : [];
    const blacklist = Array.isArray(data.blacklist) ? data.blacklist : [];

    const decision = checkUrlAgainstLists(url, whitelist, blacklist);

    console.log('[RedditHandler] URL:', url);
    console.log('[RedditHandler] Decision:', decision);

    if (decision === 'block' && !url.endsWith('reminder.html')) {
      chrome.storage.local.set({ lastBlockedDomain: url }, () => {
        setTimeout(() => {
          chrome.tabs.update(tabId, {
            url: chrome.runtime.getURL('reminder.html')
          });
        }, 50);
      });
    }
    // 'allow' and 'neutral' do nothing
  });
}
