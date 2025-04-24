document.addEventListener('DOMContentLoaded', init);

function init() {
  document.getElementById('diary-form').addEventListener('submit', handleSubmit);
  renderEntries();
}

function handleSubmit(e) {
  e.preventDefault();
  const text = document.getElementById('entry-text').value.trim();
  if (!text) return;
  const fileInput = document.getElementById('entry-image');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const imageData = ev.target.result;
      saveEntry(text, imageData);
      resetForm();
      renderEntries();
    };
    reader.readAsDataURL(file);
  } else {
    saveEntry(text, null);
    resetForm();
    renderEntries();
  }
}

function saveEntry(text, imageData) {
  const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    text,
    image: imageData
  };
  entries.unshift(entry);
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

function resetForm() {
  document.getElementById('diary-form').reset();
}

function renderEntries() {
  const entriesList = document.getElementById('entries-list');
  entriesList.innerHTML = '';
  const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
  if (entries.length === 0) {
    entriesList.innerHTML = '<p>Belum ada entri.</p>';
    return;
  }
  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    const dateEl = document.createElement('div');
    dateEl.className = 'entry-date';
    dateEl.textContent = entry.date;
    const textEl = document.createElement('div');
    textEl.className = 'entry-text';
    textEl.textContent = entry.text;
    card.appendChild(dateEl);
    card.appendChild(textEl);
    if (entry.image) {
      const img = document.createElement('img');
      img.src = entry.image;
      card.appendChild(img);
    }
    entriesList.appendChild(card);
  });
}
