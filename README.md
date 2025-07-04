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

"tabs" -> gain access to the tab object, which allows one to see:
    a)which tabs are open
    b)their URLs
    c)their titles
    d)their IDs
    Note: Still need host_permissions to see some URLs fully (e.g. due to security reasons on https:// sites)

"host_permissions" -> to match and interact with web pages based on URL
-->Tells Chrome:
“I want to access or act on youtube.com, reddit.com, etc.”
-->monitor when a tab goes to e.g. youtube.com
-->redirect based on its URL
-->Without it, Chrome blocks actions like:
    a)Injecting scripts into that site
    b)Redirecting tabs targeting that site
    c)Even seeing full tab.url reliably in service workers

"storage" -> to allow usage of chrome.storage.local to store whitelist/blacklist and user settings, alternative is local storage (currently not in use)

"scripting" -> to inject JS code into pages e.g. darken the page, add a banner.
--> Note: loading static pages i.e. reminder.html does NOT require scripting permission

