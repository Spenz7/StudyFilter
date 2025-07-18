// youtubeUI.js

function updateAllowedTopicsList() {
  chrome.storage.local.get(["allowedTopics"], (data) => {
    const list = document.getElementById("allowedTopicsList");
    if (!list) return;
    list.innerHTML = "";

    const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

    allowedTopics.forEach((topic) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = topic;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.style.marginLeft = "8px";
      removeBtn.onclick = () => {
        const updated = allowedTopics.filter(t => t !== topic);
        chrome.storage.local.set({ allowedTopics: updated }, updateAllowedTopicsList);
      };

      li.appendChild(span);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  });
}

function setupYouTubeHandlers() {
  const submitBtn = document.getElementById("submitTopic");
  const topicInput = document.getElementById("topicInput");
  const status = document.getElementById("topicStatus");

  if (!submitBtn || !topicInput || !status) return;

  submitBtn.onclick = () => {
    const topic = topicInput.value.trim();
    if (!topic) {
      status.textContent = "Topic cannot be empty.";
      return;
    }

    chrome.storage.local.get(["allowedTopics"], (data) => {
      const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

      if (allowedTopics.includes(topic)) {
        status.textContent = "Topic already exists.";
        return;
      }

      allowedTopics.push(topic);
      chrome.storage.local.set({ allowedTopics }, () => {
        topicInput.value = "";
        status.textContent = "";
        updateAllowedTopicsList();
      });
    });
  };

  updateAllowedTopicsList();
}

export { setupYouTubeHandlers };
