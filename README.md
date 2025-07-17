## Usage

- The extension blocks or allows websites based on your whitelist and blacklist.
- Customize your lists through the popup UI.
- When a site is blocked, a customizable reminder page will be shown.

**Logic:**

- Whenever you visit a website:
  - Check if the URL is in the whitelist first.
    - If yes, stop checking and allow the site.
  - If no, check if it’s in the blacklist.
    - If yes, block the site and display `reminder.html`.
    - If no, display the page normally.
  - While visiting any website, you can click on the extension popup to add or remove that website from the whitelist or blacklist.

**Customizing the Reminder Page:**

- To change the design of the reminder webpage, modify the `reminder.html` file. (You can use AI tools to help with editing.)
- To use your own custom image:
  - Upload your image to the `image` folder.
  - Name it `reminder.png`.
  - Make sure to delete the existing `reminder.png` in that folder before uploading, as you cannot have two files with the same name.

**Disclaimer:**

- I am still working on a method to restrict YouTube content to only academic-related videos, possibly using keyword filtering or AI—this may require funding.
- This extension works well with Reddit. For example, if you want to only view posts from [https://www.reddit.com/r/NTU/](https://www.reddit.com/r/NTU/), whitelist that URL and blacklist [https://www.reddit.com/](https://www.reddit.com/) to block all other subreddits.
