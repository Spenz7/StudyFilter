# StudyFilter – AI-Powered Distraction Blocking Chrome Extension

A Chrome extension designed to improve focus by blocking distracting content across Reddit, YouTube, Google, and other websites using a combination of URL filtering and AI-based relevance detection.

---

## Demo & Links

Quick demo: https://youtu.be/bleLz4FqFiM  
Full tutorial: https://youtu.be/BGrRMCJ_-5o  
Chrome Web Store: https://chromewebstore.google.com/detail/gbnlpahokjogkedhaofipdeihbglaned?utm_source=item-share-cb  

Recommended to pin the extension for easier access.

---

## Key Features

Reddit Filtering  
- Whitelist specific subreddits to allow access  
- All other Reddit pages (e.g. homepage, unlisted subreddits) are blocked  
- Implemented via URL matching (no AI involved)

YouTube + Google Filtering  
- AI-based topic filtering applied to search queries and video titles  
- Filters content based on user-defined allowed topics  
- Supports strict and lenient filtering modes  

Other Websites  
- Simple blacklist-based blocking for distracting sites  

Customizable Reminder Page  
- Upload your own images/GIFs  
- Add custom text messages  
- Can also be customized by editing HTML/CSS when loaded as an unpacked extension  

---

## Architecture

The extension is designed to balance real-time filtering, accuracy, and API security.

Client (Chrome Extension)  
- Handles URL interception, content extraction (e.g. YouTube titles), and UI interactions  
- Sends relevance-check requests for YouTube and Google content  

Cloudflare Worker (API Proxy)  
- Acts as a secure intermediary between the extension and AI providers  
- Prevents exposing API keys in client-side code  
- Can cache responses to reduce repeated API calls and latency  

AI Filtering Layer  
- Evaluates whether a query or video title is relevant to user-defined topics  
- Supports strict and lenient modes via prompt design  

Fallback Behavior  
- If the AI service is unavailable, filtering is bypassed to avoid breaking user experience  

---

## How It Works (Technical Overview)

Filtering Logic  
- Reddit: URL whitelist/blacklist matching only  
- YouTube: AI checks on search queries and video titles  
- Google: AI checks on search queries  
- Other sites: URL blacklist  

AI Optimization  
- For search queries longer than 35 characters, only the first 35 characters are sent for evaluation to reduce API usage  

Failure Handling  
- If the AI service is unavailable, YouTube filtering is bypassed  
- Users can temporarily blacklist youtube.com as a fallback  

User Feedback System  
- After selecting strict or lenient mode, users can vote on preference to improve filtering  

Poll link: https://strawpoll.com/bVg8BmwNryY  

---

## Setup & Usage Notes

Reminder Page Customization (Important)  
If editing manually, keep the following elements intact:  
- Image tag with id="reminder-image"  
- Container div with id="reminder-messages"  
- Script tag loading reminder.js  

---

## Tips to Improve Relevance Detection

Use Broader or Related Topics  
- If valid content is blocked, include more general topics  
- Example: instead of only “C”, add “programming” or “computer science”  

Include More Context in Queries  
- Longer queries improve AI understanding  
- Example: “C++ sorting algorithm tutorial” vs “sorting”  

Avoid Overly Short or Ambiguous Terms  
- Short phrases may be misclassified  
- Rephrase with more detail if needed  

---

## YouTube Recommendation Control (UnHook Integration)

With UnHook Installed  
- Enable watch history for better recommendations based on relevant viewing  
- Or disable watch history to minimize homepage distractions  

Without UnHook  
- Recommended to disable watch history to keep homepage clean  
- Enable only if disciplined enough to maintain relevant viewing behavior  

---

## Version Overview

v1  
- Customizable reminder page  

v2  
- v1 + general website blocking + Reddit filtering  

v3 (under maintenance)  
- v2 + YouTube filtering (personal use via own OpenAI/OpenRouter API key)  

v4  
- v2 + YouTube filtering (public use) + Google filtering  

---

## Important Notes

- AI filtering is only applied to YouTube and Google  
- Reddit filtering is purely rule-based (URL matching)  
- Filtering accuracy depends on topic selection and query clarity  

---

## License

This project is released for personal, non-commercial use.  
See LICENSE for full terms.
