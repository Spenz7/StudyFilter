Tutorial link: 
# StudyFilter Chrome Extension

## Key Features

- **Reddit Filtering**
  - Whitelist your favorite subreddits (e.g. `r/NTU`)
  - Blacklist `reddit.com` to block the front page and all non-whitelisted subreddits

- **YouTube Topic Filtering**
  - AI-based filtering determines if a video or search query is related to your specified topics
  - Supports both *strict* and *lenient* filtering modes

- **Other Websites**
  - Simple blacklist support for any site (e.g. `twitter.com`, `tiktok.com`)

- **Customizable Reminder Page**
  - Shows up when blocked content is detected
  - Users can customize the image and text easily (see instructions below)

---

## How Filtering Logic Works

- **AI Filtering is applied only on YouTube**
  - Both search queries and video titles are checked against your allowed topics
  - Uses OpenAI’s API (via a secure Cloudflare Worker) for classification
  - If OpenAI is down, **YouTube searches and video clicks are not filtered**  
    → You may temporarily add `youtube.com` to your blacklist to stay focused during downtime

- **Search query handling**
  - YouTube search queries longer than **35 characters** will be truncated to the first 35 characters before filtering

---

## Tips to Improve Relevance Detection

If relevant content is being blocked (or irrelevant content gets through), try the following:

1. **Use Broader or Related Topics**
   - If you're too specific, the AI may fail to match loosely related content.
   - *Example:* Instead of just `C`, add topics like `programming`, `software development`, or `computer science`.

2. **Include More Context in Your Search**
   - The filter performs better with descriptive, detailed phrases.
   - *Example:* Use `C++ sorting algorithm tutorial` instead of just `sorting`.

3. **Watch for Abbreviations and Short-Form Phrases**
   - Vague or very short search queries may be harder to match accurately.
   - If a relevant video is blocked, it may help to rephrase or add more detail.

---

## Filter Mode: Strict vs. Lenient

- Strict Mode: Only allows content that is clearly and directly about your topics
- Lenient Mode: Allows content that is loosely, culturally, or contextually related
- Users can choose a mode and are encouraged to [vote on which works better](https://strawpoll.com/bVg8BmwNryY)

---

## Recommended Setup for Best Results

We recommend installing **both**:

1. [**UnHook**](https://chrome.google.com/webstore/detail/unhook-remove-youtube-reco/khncfooichmfjbepaaaebmommgaepoid)
2. **StudyFilter** (this extension)

### With UnHook:

- You can **completely hide YouTube home/feed/recommendations**.
- You have two options for watch history:
  - **Enable Watch History**  
    → Recommended videos will improve over time based on allowed topics.
  - **Disable Watch History**  
    → Home feed becomes blank (also achievable via UnHook settings).

### Without UnHook:

- We recommend **disabling Watch History** so your homepage stays empty.
- Only enable watch history if you're disciplined enough to click only relevant videos.

---

## Customizing the Reminder Page

You can personalize the blocking reminder page (`reminder.html`) even more by editing the HTML/CSS. To ensure everything works:

### 1. Keep the image container

html

<img id="reminder-image" src="your-image.png" alt="Reminder image">

2\. Keep the messages container

html

Copy

Edit

<div id="reminder-messages">

  <p>Stay focused!</p>

  <p>You said you wanted to study.</p>

</div>

Customize the messages with motivational text, quotes, or goals.

You can include multiple lines inside this container.

3\. Keep the script tag

html

Copy

Edit

<script src="reminder.js"></script>

This script handles loading your custom image and messages dynamically.

Copy

Edit
