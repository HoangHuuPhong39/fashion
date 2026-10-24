const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(productsFilePath)) {
  console.error(`Error: ${productsFilePath} not found.`);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
console.log(`Checking images for ${products.length} products...`);

const missingList = [];

products.forEach(p => {
  const images = p.images || [];
  if (images.length === 0) {
    missingList.push({
      id: p.id,
      name: p.name,
      reason: 'No images defined',
      images: []
    });
    return;
  }

  const missingForProduct = [];
  images.forEach(img => {
    if (!img) {
      missingForProduct.push('(empty string)');
    } else if (img.startsWith('http://') || img.startsWith('https://')) {
      // Remote image URL
    } else {
      // Local image in public folder
      const cleanPath = img.startsWith('/') ? img.slice(1) : img;
      const fullPath = path.join(publicDir, cleanPath);
      if (!fs.existsSync(fullPath)) {
        missingForProduct.push(img);
      }
    }
  });

  if (missingForProduct.length > 0) {
    missingList.push({
      id: p.id,
      name: p.name,
      reason: 'Missing image files',
      missingImages: missingForProduct
    });
  }
});

console.log('--------------------------------------------------');
if (missingList.length === 0) {
  console.log('✅ All product images are present!');
} else {
  console.log(`⚠️ Found ${missingList.length} product(s) with missing images:\n`);
  missingList.forEach((item, index) => {
    console.log(`${index + 1}. [${item.id}] ${item.name}`);
    if (item.missingImages) {
      item.missingImages.forEach(img => console.log(`   - Missing file: ${img}`));
    } else {
      console.log(`   - Reason: ${item.reason}`);
    }
  });
}
console.log('--------------------------------------------------');
