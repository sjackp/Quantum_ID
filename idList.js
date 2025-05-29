const { loadData } = require('./idSearch');

// Define the function before exporting it
function getAllIDs() {
  return loadData();
}

module.exports = {
  getAllIDs
};
