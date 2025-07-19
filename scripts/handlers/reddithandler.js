// scripts/handlers/reddithandler.js
import { PlatformHandler } from './platformhandler.js';

const redditHandler = new PlatformHandler('Reddit');

export function handleReddit(tabId, url) {
  redditHandler.handle(tabId, url);
}
