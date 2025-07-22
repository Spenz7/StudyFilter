// scripts/providers/getworkerurl.js
// Maps extension IDs to worker URLs
const WORKER_URL_MAP = {
  // Production ID (from Chrome Web Store)
  'your_production_extension_id': 'https://youtube-filter-worker-production.spenz.workers.dev',
  // Development ID (unpacked extension)
  'mjgaobnicecibpidlocbcpejjclknljf': 'https://youtube-filter-worker-development.spenz.workers.dev'
};

// Security: Default to production URL
const DEFAULT_WORKER_URL = WORKER_URL_MAP['your_production_extension_id'];

export const getWorkerUrl = () => {
  try {
    const currentId = chrome.runtime.id;
    
    // Security: Only return known URLs
    if (WORKER_URL_MAP[currentId]) {
      return WORKER_URL_MAP[currentId];
    }
    
    console.warn('Unknown extension ID, using production worker');
    return DEFAULT_WORKER_URL;
  } catch (e) {
    console.error('Failed to get runtime ID, using production worker:', e);
    return DEFAULT_WORKER_URL;
  }
};
