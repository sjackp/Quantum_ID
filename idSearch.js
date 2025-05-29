// idSearch.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data/guyj_ids.json');

function loadData() {
  try {
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading ID data:', err);
    return [];
  }
}

function searchIDs(keyword) {
  const data = loadData();
  keyword = keyword.toLowerCase();

  return data.filter(entry => {
    const combined = [
      entry.track_name,
      entry.notes,
      entry.link,
      entry.artist || 'Guy J' // default fallback
    ].join(' ').toLowerCase();
    
    return combined.includes(keyword);
  });
}

module.exports = {
  searchIDs,
  loadData
};
