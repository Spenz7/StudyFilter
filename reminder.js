document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(['reminderImage', 'reminderTextLines'], ({ reminderImage, reminderTextLines }) => {
    const img = document.getElementById('reminder-image');
    // Use custom image if available, else fallback to default
    img.src = reminderImage || 'images/reminder.png';

    const container = document.getElementById('reminder-messages');
    container.innerHTML = '';

    const lines = Array.isArray(reminderTextLines) && reminderTextLines.length > 0
      ? reminderTextLines
      : [
          "1) Study now so you can study less later — you need to do it anyway.",
          "2) If you play now, you won't enjoy as much.",
          "3) Exchange gpa MIN 4.6"
        ];

    lines.forEach(line => {
      const div = document.createElement('div');
      div.className = 'message';
      div.textContent = line;
      container.appendChild(div);
    });
  });
});
