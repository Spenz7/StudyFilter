**GETTING STARTED**

-   Guide used: <https://developer.chrome.com/docs/extensions/get-started>

-   Basic workflow:

    -   GitHub repo ↔ Cloned local folder ↔ Chrome (unpacked extension)

**Development Flow**

1.  Make edits in local folder → Reload extension in Chrome → Push to GitHub.

2.  If editing directly on GitHub, remember to pull before testing locally.

* * * * *

**MANIFEST PERMISSIONS**

Main categories in `manifest.json`:

-   `"permissions"` → e.g. tabs, scripting, storage

-   `"host_permissions"` → domains like `youtube.com`, `reddit.com`

Common permissions:

-   `tabs` → Read tab info (title, URL, ID).

-   `storage` → Save user settings like whitelist, blacklist, etc.

-   `scripting` → Inject JS into pages.

-   `host_permissions` → Allow matching specific websites.

* * * * *

**REDDIT URL FILTERING**

Logic:

-   If tab URL matches an entry in `chrome.storage.local.whitelist`, allow.

-   Else, if it matches an entry in `blacklist`, redirect to `reminder.html`.

-   If in neither list, allow access.

Example:

-   Whitelist: `https://www.reddit.com/r/NTU/`

-   Blacklist: `https://www.reddit.com`

-   Result:

    -   `https://www.reddit.com/r/NTU/comments/...` → allowed

    -   `https://www.reddit.com/popular/` → blocked

* * * * *

**POPUP MENU FUNCTIONS**

Whitelist / Blacklist Management:

-   Add:

    -   Reject duplicates or cross-conflicts.

    -   Save to `chrome.storage.local`.

-   Remove:

    -   Each has a "Remove" button.

-   Display:

    -   Whitelist: hyperlinks

    -   Blacklist: plain text

    -   Both: collapsible lists

Reminder Features:

-   Upload image:

    -   Stored via `chrome.storage.local`.

    -   Used in `reminder.html`.

-   Custom reminder message:

    -   Text area input → saved to storage → injected safely using `.textContent` (never `.innerHTML` with raw input).

-   Import/Export:

    -   Allow export of all settings (whitelist, blacklist, allowedTopics, filterLevel) to JSON.

    -   Allow JSON import to restore settings.

* * * * *

**YOUTUBE FILTERING**

1.  **Topic Preferences**

-   Add:

    -   Max 10 topics

    -   Each max 20 characters

    -   No duplicates

    -   Auto-sorted alphabetically (for cache matching only, popup list stays unsorted)

    -   Stored in `chrome.storage.local.allowedTopics`

-   Remove:

    -   Remove button per topic

1.  **Filter Level**

-   Stored in `chrome.storage.local.filterLevel`

-   Defaults to `strict` (saves API calls)

-   Options:

    -   `strict`: requires clear match

    -   `lenient`: allows broader relation

1.  **Search Query Filtering**

-   Triggered when `search_query` in URL

-   Input sanitized and truncated (max 35 characters)

-   Sanitization allows:

    -   Letters, numbers, underscores

    -   Spaces and selected symbols: - + # $ % & * . / ? ! ' ,

    -   All other characters removed

-   If no allowed topics, AI check is skipped

-   Otherwise:

    -   AI call is made via Cloudflare Worker (proxy)

    -   AI response must be "yes" or "no"

    -   "no" → redirect to `reminder.html`

* * * * *

**AI CHECK FLOW (via Cloudflare Worker)**

-   `aicheck.js` handles request:

    -   `callAI(cleanPhrase, cleanTopics, filterLevel)`

-   `cleanPhrase`: trimmed/sanitized query

-   `cleanTopics`: sorted, deduped array (up to 10)

-   `filterLevel`: "strict" or "lenient"

-   Worker returns "yes" or "no" only

-   If "no", redirect user

* * * * *

**WHAT TO TELL USERS IF FILTER FAILS OR IS TOO STRICT**

If something gets blocked that shouldn't be:

1.  Try using broader topics (e.g. "academics" instead of "c++").

2.  Add more context to your search queries.

3.  Be aware that short or informal phrases may get filtered incorrectly.
