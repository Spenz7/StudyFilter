# Developer Guide

**Guide I used to learn from:**  
https://developer.chrome.com/docs/extensions/get-started

## Workflow

GitHub repo ←→ Cloned folder on your PC ←→ Chrome extension (unpacked)

## Methods I Use to Implement New Changes

- Edit cloned folder → Reload Chrome Extension & push changes onto GitHub repo (to avoid conflicts)  
- Edit GitHub repo → Pull changes to cloned folder → Reload Chrome Extension

## Term Meaning

- **Popup:** The small UI window that shows when you click your extension’s icon.  
- **popup.html:** The HTML page that renders inside this popup.  
- **popup.js:** The JavaScript file that runs inside the popup page. Currently not used but may be needed in the future.  
- **Background script:** Runs independently in the background, not visible to the user.

## Permissions Needed

For full details, see: https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions

> Note: All permissions required will, by default, be warned to the user upon installation.

### Extension Permissions Breakdown

There are two main types of permissions in `manifest.json`:

- `"permissions"` → access to Chrome APIs (tabs, storage, scripting, etc.)  
- `"host_permissions"` → access to websites (e.g., youtube.com, reddit.com)

#### Common Permissions Explained

- `"tabs"`  
  Grants access to the tab object, allowing you to:  
  - See which tabs are open  
  - Access their URLs  
  - Get tab titles  
  - Get tab IDs  

  > Note: You still need `"host_permissions"` to reliably access full URLs on some sites (e.g., https sites) due to security restrictions.

- `"storage"`  
  Allows use of `chrome.storage.local` to:  
  - Store the whitelist/blacklist  
  - Save user settings  
  
  > Alternative: `localStorage` (currently not in use).

- `"scripting"`  
  Grants permission to inject JavaScript into web pages. Useful for:  
  - Changing appearance (e.g., darkening the page)  
  - Adding banners or overlays  
  
  > Note: Loading a static page like `reminder.html` does **not** require the `"scripting"` permission.

- `"host_permissions"`  
  Grants permission to match and interact with specific websites based on their URL.  
  
  "Match" means:  
  - “Does the tab’s URL fit one of the patterns I’m allowed to work on?”  
  
  Patterns are defined with `"host_permissions"` in `manifest.json`. For example:

  ```json
  "host_permissions": ["<all_urls>"]
