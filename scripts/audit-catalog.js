const fs = require('fs');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Match products
const productRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?images:\s*\[([\s\S]*?)\][\s\S]*?\}/g;

let count = 0;
let remoteCount = 0;
let localCount = 0;
const remoteList = [];

let m;
while ((m = productRegex.exec(content)) !== null) {
  count++;
  const id = m[1];
  const name = m[2];
  const cat = m[3];
  const rawImages = m[4];
  const images = rawImages.split(',').map(s => s.trim().replace(/['"`]/g, '')).filter(Boolean);
  const first = images[0] || '';
  if (first.startsWith('http')) {
    remoteCount++;
    remoteList.push({ id, name, cat, img: first });
  } else {
    localCount++;
  }
}

console.log(`Total products parsed: ${count}`);
console.log(`Using remote images: ${remoteCount}`);
console.log(`Using local images: ${localCount}`);
console.log('\nRemote products list:');
remoteList.forEach(p => console.log(`[${p.id}] (${p.cat}) ${p.name}: ${p.img}`));
