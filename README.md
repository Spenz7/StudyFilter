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
| **popup.js**          | The JavaScript file that runs inside the popup page.                 |
| **Background script** | Runs independently in the background, not visible to user.           |

Permissions Needed:
https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions

All permissions required will by default be warned to the user upon installation

"tabs"
Grants access to the tab object, which allows you to:

See which tabs are open

Access their URLs

Get tab titles

Get tab IDs
Note: You still need host_permissions to reliably access full URLs on some sites (e.g. https:// due to security restrictions).

"host_permissions"
Grants permission to match and interact with specific websites based on URL.

Tells Chrome:

“I want to access or act on sites like youtube.com, reddit.com, etc.”

Allows you to:

Monitor when a tab navigates to specific sites

Redirect tabs based on their URL

Without this, Chrome will block actions like:

Injecting scripts into those sites

Redirecting tabs targeting those domains

Reading full tab.url in background/service workers

"storage"
Allows use of chrome.storage.local to:

Store the whitelist/blacklist

Save user settings
Alternative: localStorage (currently not in use).

"scripting"
Grants permission to inject JavaScript into web pages.

Useful for:

Changing appearance (e.g. darkening the page)

Adding banners or overlays

Note: Loading a static page like reminder.html does not require the scripting permission.

