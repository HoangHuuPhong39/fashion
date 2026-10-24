const fs = require('fs');

const content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Parse products
const prods = [];
const pRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'(?:[\s\S]*?subCategory:\s*'([^']+)')?[\s\S]*?origin:\s*'([^']+)'[\s\S]*?(?:isSale:\s*(true|false))?[\s\S]*?(?:discountPercentage:\s*(\d+))?[\s\S]*?\}/g;

let m;
const catCounts = {};
const originCounts = {};

// Let's do a more robust parse of PRODUCTS array
const productsStart = content.indexOf('export const PRODUCTS: Product[] = [');
const productsEnd = content.indexOf('export const ORDERS_DATA: Order[] = [');
const productsBlock = content.slice(productsStart, productsEnd > -1 ? productsEnd : undefined);

const items = productsBlock.split(/\n\s*\{\s*\n\s*id:\s*'/).slice(1);
console.log('Total items in PRODUCTS array:', items.length);

items.forEach(item => {
  const catMatch = item.match(/category:\s*'([^']+)'/);
  const subMatch = item.match(/subCategory:\s*'([^']+)'/);
  const originMatch = item.match(/origin:\s*'([^']+)'/);
  const saleMatch = item.match(/isSale:\s*true/);
  const discountMatch = item.match(/discountPercentage:\s*([1-9]\d*)/);

  const cat = catMatch ? catMatch[1] : 'unknown';
  const sub = subMatch ? subMatch[1] : '';
  const origin = originMatch ? originMatch[1] : 'unknown';
  const hasSale = !!(saleMatch || discountMatch);

  catCounts[cat] = (catCounts[cat] || 0) + 1;
  originCounts[origin] = (originCounts[origin] || 0) + 1;
});

console.log('Category breakdown:', catCounts);
console.log('Origin breakdown:', originCounts);

console.log('\n--- Missing Category or Origin ---');
items.forEach((it, idx) => {
  const id = it.slice(0, it.indexOf("'"));
  const cat = it.match(/category:\s*'([^']+)'/);
  const orig = it.match(/origin:\s*'([^']+)'/);
  if (!cat || !orig) {
    console.log(`Item id: [${id}] - Cat: ${cat ? cat[1] : 'MISSING'} - Origin: ${orig ? orig[1] : 'MISSING'}`);
  }
});
