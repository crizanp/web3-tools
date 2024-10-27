const fs = require('fs');

// Read the file containing words (one word per line)
const words = fs.readFileSync('nepaliWords.txt', 'utf-8').split('\n');

// Create a JSON object
const jsonData = {
  nepaliWords: words.map(word => word.trim()).filter(Boolean)
};

// Write to a JSON file
fs.writeFileSync('nepaliWords.json', JSON.stringify(jsonData, null, 2));

console.log('nepaliWords.json has been created successfully!');
