const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images/mau');
const files = fs.readdirSync(srcDir);

console.log('Total files found:', files.length);
files.forEach((f, idx) => {
  const stat = fs.statSync(path.join(srcDir, f));
  console.log(`${idx + 1}: ${f} (${(stat.size / 1024).toFixed(0)} KB)`);
});
