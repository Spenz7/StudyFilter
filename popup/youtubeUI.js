function createTopicListItem(topic, allowedTopics, updateCallback) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = topic;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.style.marginLeft = "8px";
  removeBtn.onclick = () => {
    const updated = allowedTopics.filter(t => t !== topic);
    chrome.storage.local.set({ allowedTopics: updated }, updateCallback);
  };

  li.appendChild(span);
  li.appendChild(removeBtn);

  return li;
}

function updateAllowedTopicsList() {
  chrome.storage.local.get(["allowedTopics"], (data) => {
    const list = document.getElementById("allowedTopicsList");
    if (!list) return;

    list.innerHTML = "";

    const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

    allowedTopics.forEach(topic => {
      const li = createTopicListItem(topic, allowedTopics, updateAllowedTopicsList);
      list.appendChild(li);
    });
  });
}

function setupTopicInputHandlers() {
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

    if (topic.length > 20) {
      status.textContent = "Topic must be 20 characters or less.";
      return;
    }

    chrome.storage.local.get(["allowedTopics"], (data) => {
      const allowedTopics = Array.isArray(data.allowedTopics) ? data.allowedTopics : [];

      if (allowedTopics.includes(topic)) {
        status.textContent = "Topic already exists.";
        return;
      }

      if (allowedTopics.length >= 10) {
        status.textContent = "You can only add up to 10 topics.";
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
}

function setupYouTubeHandlers() {
  setupTopicInputHandlers();
  updateAllowedTopicsList();
}

export { setupYouTubeHandlers };
