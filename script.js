(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('diary-form');
    const entriesList = document.getElementById('entries-list');

    form.addEventListener('submit', handleSubmit);
    renderEntries();

    function handleSubmit(e) {
      e.preventDefault();
      const textInput = document.getElementById('entry-text');
      const fileInput = document.getElementById('entry-image');
      const text = textInput.value.trim();
      if (!text) {
        alert('Tulis sesuatu sebelum menyimpan!');
        return;
      }
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          processEntry(text, ev.target.result);
        };
        reader.onerror = function(err) {
          console.error('Gagal membaca file:', err);
          processEntry(text, null);
        };
        reader.readAsDataURL(file);
      } else {
        processEntry(text, null);
      }
    }

    function processEntry(text, imageData) {
      saveEntry(text, imageData);
      form.reset();
      renderEntries();
    }

    function saveEntry(text, imageData) {
      let entries = [];
      try {
        entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
      } catch (err) {
        console.error('Gagal parse localStorage:', err);
        entries = [];
      }
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleString('id-ID'),
        text,
        image: imageData
      };
      entries.unshift(entry);
      localStorage.setItem('diaryEntries', JSON.stringify(entries));
    }

    function renderEntries() {
      entriesList.innerHTML = '';
      let entries = [];
      try {
        entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
      } catch (err) {
        console.error('Gagal parse localStorage:', err);
        entries = [];
      }
      if (!entries.length) {
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
          img.alt = 'Diary Image';
          card.appendChild(img);
        }
        entriesList.appendChild(card);
      });
    }
  });
})();
