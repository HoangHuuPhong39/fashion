const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images/mau');
const files = fs.readdirSync(srcDir);

// Let's print each file name and index
files.forEach((f, idx) => {
  console.log(`${idx + 1}: ${f}`);
});
