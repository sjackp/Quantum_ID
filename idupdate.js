// idUpdate.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data/guyj_ids.json');

function updateIDDataFromTxt(txtContent) {
  const lines = txtContent.split('\n');
  const entries = [];

  for (let line of lines) {
    // Skip separator/header lines
    if (line.startsWith('|') && !line.includes(':-')) {
      // Split only into 3 main columns (track name, link, notes)
      const parts = line.split('|', 4).slice(1, 4).map(p => p.trim());
      if (parts.length === 3 && parts[0] !== 'Track') {
        const notes = parts[2];
        const yearMatch = notes.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : null;

        entries.push({
          track_name: parts[0],
          link: parts[1],
          notes,
          year
        });
      }
    }
  }

  try {
    fs.writeFileSync(dataPath, JSON.stringify(entries, null, 2));
    return true;
  } catch (err) {
    console.error('Failed to write data:', err);
    return false;
  }
}

module.exports = {
  updateIDDataFromTxt
};
