// scripts/providers/getworkerurl.js
// Maps extension IDs to worker URLs
const PRODUCTION_ID = 'your_production_extension_id';  // Replace with your real Chrome Web Store ID
const DEVELOPMENT_ID = 'mjgaobnicecibpidlocbcpejjclknljf';

const WORKER_URL_MAP = {
  [PRODUCTION_ID]: 'https://youtube-filter-worker-production.spenz.workers.dev',
  [DEVELOPMENT_ID]: 'https://youtube-filter-worker-development.spenz.workers.dev'
};

// Fallback URL for all other (unpacked/custom) extension IDs
const UNPACKED_WORKER_URL = 'https://youtube-filter-worker-unpacked.spenz.workers.dev';

export const getWorkerUrl = () => {
  try {
    const currentId = chrome.runtime.id;

    // Return mapped URL for known IDs
    if (WORKER_URL_MAP[currentId]) {
      return WORKER_URL_MAP[currentId];
    }

    // Any other extension ID gets the unpacked worker
    console.info(`[Worker URL] Using unpacked worker for extension ID: ${currentId}`);
    return UNPACKED_WORKER_URL;
  } catch (e) {
    console.error('[Worker URL] Failed to resolve runtime ID, defaulting to unpacked worker:', e);
    return UNPACKED_WORKER_URL;
  }
};
