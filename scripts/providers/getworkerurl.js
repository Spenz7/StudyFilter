const PRODUCTION_ID = 'gbnlpahokjogkedhaofipdeihbglaned';  // Your production extension ID
const DEVELOPMENT_ID = 'mjgaobnicecibpidlocbcpejjclknljf';
const UNPACKED_WORKER_URL = 'https://youtube-filter-worker-unpacked.spenz.workers.dev';

const PRODUCTION_WORKER_URL = 'https://youtube-filter-worker-production.spenz.workers.dev';
const DEVELOPMENT_WORKER_URL = 'https://youtube-filter-worker-development.spenz.workers.dev';

export const getWorkerUrl = () => {
  try {
    const currentId = chrome.runtime.id;

    if (currentId === PRODUCTION_ID) {
      return PRODUCTION_WORKER_URL;
    }

    if (currentId === DEVELOPMENT_ID) {
      return DEVELOPMENT_WORKER_URL;
    }

    // Fallback to unpacked worker for all other IDs
    console.info(`[Worker URL] Using unpacked worker for extension ID: ${currentId}`);
    return UNPACKED_WORKER_URL;
  } catch (e) {
    console.error('[Worker URL] Failed to get runtime ID, defaulting to unpacked worker:', e);
    return UNPACKED_WORKER_URL;
  }
};
