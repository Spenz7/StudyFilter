Tutorial link: https://developer.chrome.com/docs/extensions/get-started

Workflow:
GitHub repo ←→ Cloned folder on your PC ←→ Chrome extension (unpacked)

Update methods:
1) Edit Cloned folder -> Reload Chrome Extension & push changes onto Github repo (to avoid conflicts)
2) Edit Github repo -> Cloned folder to pull changes -> Reload Chrome Extension

| Term                  | Meaning                                                              |
| --------------------- | -------------------------------------------------------------------- |
| **Popup**             | The small UI window that shows when you click your extension’s icon. |
| **popup.html**        | The HTML page that renders inside this popup.                        |
| **popup.js**          | The JavaScript file that runs inside the popup page. Currently no use but may need in the future.|
| **Background script** | Runs independently in the background, not visible to user.           |

# Permissions Needed

For full details, see:  
https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions

> **Note:** All permissions required will, by default, be warned to the user upon installation.
> **Note:** As of now, chrome.storage technically isn't needed as there's no option to save one's custom white/blacklist. There is currently only a hardcoded blacklist which
> will have to be modified manually via background.js
---

## 🛡️ Extension Permissions Breakdown

### Two main types of permissions in `manifest.json`

- `"permissions"` → access to Chrome **APIs** (tabs, storage, scripting, etc.)
- `"host_permissions"` → access to **websites** (e.g., youtube.com, reddit.com)

---

### `"tabs"`

Grants access to the **tab object**, allowing you to:

- See which tabs are open
- Access their URLs
- Get tab titles
- Get tab IDs

**Note:** You still need `"host_permissions"` to reliably access full URLs on some sites (e.g. `https://` sites due to security restrictions).

---

### `"storage"`

Allows use of `chrome.storage.local` to:

- Store the whitelist/blacklist
- Save user settings

_Alternative:_ `localStorage` (currently not in use).

---

### `"scripting"`

Grants permission to **inject JavaScript** into web pages.

Useful for:

- Changing appearance (e.g., darkening the page)
- Adding banners or overlays

**Note:** Loading a static page like `reminder.html` **does not** require the `"scripting"` permission.

---

### `"host_permissions"`

Grants permission to **match and interact with specific websites** based on their URL.

> **"Match"** means:  
> “Does the tab’s URL fit one of the patterns I’m allowed to work on?”  
> Patterns are defined with `"host_permissions"` in `manifest.json`.  
> For example:  
> ```json
> "host_permissions": ["<all_urls>"]
> ```
> which allows the extension to operate on all URLs.

Tells Chrome:  
> “I want to access or act on sites like `youtube.com`, `reddit.com`, etc.”

Allows you to:

- Monitor when a tab navigates to specific sites
- Redirect tabs based on their URL

Without this, Chrome will block actions like:

- Injecting scripts into those sites
- Redirecting tabs targeting those domains
- Reading full `tab.url` in background/service workers

---

## What is `"web_accessible_resources"` for?

It makes certain files inside your extension (like `reminder.html`, images, scripts) accessible to web pages or tabs.

By default, files inside your extension are private and can only be used internally by the extension (e.g., popup, background scripts).

If you want to redirect a tab to an internal extension page (like `reminder.html`), Chrome requires that page to be declared as a **web accessible resource**.

In other words,  
`web_accessible_resources` =  
> “Can web pages (which are external by nature) load files inside my extension like `reminder.html`?”

---


