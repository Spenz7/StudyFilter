Tutorial link:

**Version History:**

-   **v1:** Customizable reminder page

-   **v2:** v1 + General website blocking + Reddit filtering

-   **UNDER MAINTENANCE v3:** v2 + YouTube filtering (personal use using your own OPENAI/OPENROUTER API key) 

-   **v4:** v2 + YouTube filtering (public use)


**Key Features:**

-   **Reddit Filtering:**\
    Use a whitelist of your favorite subreddits to allow only those. All other Reddit pages (e.g., `reddit.com` or unlisted subreddits) are blocked.

-   **YouTube Filtering:**\
    Uses AI-based topic filtering on search queries and video titles. Only YouTube uses AI filtering.

-   **Other Websites:**\
    A simple blacklist blocks distracting websites outside of Reddit and YouTube.

-   **Customizable Reminder Page:**\
    You can use the upload file button to upload images/GIFs and the textbox to enter your custom text \
    Or you can download this as an unpacked extension and customize your reminder page by editing the HTML/CSS.\
    Important: Keep the following elements intact so custom images and texts load correctly:

    -   The image tag with `id="reminder-image"`

    -   The container div with `id="reminder-messages"`

    -   The script tag that loads `reminder.js`

* * * * *

**How Filtering Logic Works:**

-   AI filtering is applied only on YouTube, checking if the search query or video title matches your allowed topics.

-   For YouTube search queries longer than 35 characters, only the first 35 characters are sent to the AI for evaluation (to optimize API usage).

-   Reddit uses URL matching with whitelist/blacklist, no AI involved.

-   Other sites are blocked simply by matching URLs on a blacklist.

* * * * *

**Tips to Improve Relevance Detection:**

1.  **Use Broader or Related Topics:**\
    If content you want is blocked, try adding more general or related topics to your allowed list.\
    *Example:* Instead of only `C`, add `programming` or `computer science` to capture more relevant content.

2.  **Include More Context in Your Search Queries:**\
    Longer, descriptive queries help the AI better understand your intent.\
    *Example:* Instead of searching just `sorting`, try `C++ sorting algorithm tutorial`.

3.  **Be Aware of Short-Form or Abbreviations:**\
    Very short or vague phrases can be ambiguous for the AI. If a valid video is blocked, it might be due to lack of context. Try adding more detail or rephrasing.

* * * * *

**Important Notes:**

-   If the OpenAI service is down or unavailable, **all YouTube searches will bypass filtering**.\
    As a precaution, you might want to temporarily blacklist `youtube.com` to avoid distractions during downtime.

-   After selecting a filtering mode (`strict` or `lenient`), users will be able to vote on their preference to help improve the filter.

-   You can participate in the mode preference poll here:\
    <https://strawpoll.com/bVg8BmwNryY>

-   For best YouTube filtering results, **install both UnHook and StudyFilter**.

* * * * *

**Guide for Using UnHook and StudyFilter:**

-   **With UnHook installed:**

    -   Enable watch history if you want YouTube to recommend content related to your viewing habits.

    -   Or disable watch history if you want no influence on recommendations (the homepage will show fewer or no results).

-   **Without UnHook:**

    -   It is recommended to disable watch history to keep your YouTube homepage blank and free from distractions.

    -   Enable watch history only if you are disciplined enough to only watch relevant content, so YouTube recommendations improve over time.
