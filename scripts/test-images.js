const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');
const urls = [...new Set([...content.matchAll(/https:\/\/[^\s'",]+/g)].map(m => m[0]))];

console.log('Total unique HTTPS URLs in mockData.ts:', urls.length);

let pending = urls.length;
const results = { ok: [], failed: [] };

urls.forEach(url => {
  const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 }, res => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      results.ok.push({ url, status: res.statusCode });
    } else {
      results.failed.push({ url, status: res.statusCode });
    }
    checkDone();
  });
  req.on('error', err => {
    results.failed.push({ url, error: err.message });
    checkDone();
  });
  req.on('timeout', () => {
    req.destroy();
    results.failed.push({ url, error: 'Timeout' });
    checkDone();
  });
});

function checkDone() {
  pending--;
  if (pending === 0) {
    console.log('OK count:', results.ok.length);
    console.log('Failed count:', results.failed.length);
    if (results.failed.length > 0) {
      console.log('Failed URLs:', results.failed);
    }
  }
}
