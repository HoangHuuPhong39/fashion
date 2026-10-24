const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images/mau');
const destDir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

// Mapping from 1-based index (sorted files list) to clean semantic names
const imageMap = {
  1: 'chrome-hearts-raglan-l-tee.jpg',
  2: 'lacoste-hooded-knit-cardigan-navy.jpg',
  3: 'adidas-varsity-bomber-tracksuit.jpg',
  4: 'adidas-germany-training-tracksuit-white.jpg',
  5: 'adidas-windbreaker-sage-green.jpg',
  6: 'lacoste-long-sleeve-polo-white.jpg',
  7: 'chrome-hearts-ma1-bomber-cream.jpg',
  8: 'burberry-ekd-knit-polo-black.jpg',
  9: 'lacoste-long-sleeve-polo-black.jpg',
  10: 'adidas-england-track-jacket-white.jpg',
  11: 'adidas-germany-windbreaker-burgundy.jpg',
  12: 'adidas-spain-track-jacket-hanger.jpg',
  13: 'dior-floral-knit-cardigan-black.jpg',
  14: 'lacoste-oxford-shirt-navy.jpg',
  15: 'dolce-gabbana-tailored-trousers-cream.jpg',
  16: 'lacoste-cable-knit-polo-brown.jpg',
  17: 'louis-vuitton-halfzip-knit-oatmeal.jpg',
  18: 'louis-vuitton-monogram-crewneck-olive.jpg',
  19: 'gucci-gg-jacquard-polo-black.jpg',
  20: 'louis-vuitton-vneck-cardigan-black.jpg',
  21: 'lacoste-baseball-cardigan-green.jpg',
  22: 'lacoste-cable-knit-polo-grey.jpg',
  23: 'ralph-lauren-fullzip-cardigan-grey.jpg',
  24: 'dior-oblique-bomber-black.jpg',
  25: 'ralph-lauren-quarterzip-blue.jpg',
  26: 'louis-vuitton-polo-black.jpg',
  27: 'ralph-lauren-vneck-cardigan-camel.jpg',
  28: 'burberry-knit-polo-espresso.jpg',
  29: 'gucci-harrington-bomber-cream.jpg',
  30: 'louis-vuitton-colorblock-jacket-white.jpg',
  31: 'burberry-vintage-check-cardigan-camel.jpg',
  32: 'louis-vuitton-starlight-galaxy-cardigan.jpg',
  33: 'burberry-ekd-jacquard-cardigan-black.jpg',
  34: 'adidas-spain-tracksuit-flatlay.jpg',
  35: 'adidas-arsenal-tracksuit-burgundy.jpg',
  36: 'adidas-germany-tracksuit-white-black.jpg',
  37: 'adidas-manchester-united-tracksuit-green.jpg',
  38: 'adidas-juventus-tracksuit-black.jpg',
  39: 'adidas-germany-away-tracksuit-mint.jpg',
  40: 'adidas-argentina-tracksuit-navy.jpg',
  41: 'adidas-oasis-tracksuit-skyblue.jpg',
  42: 'nike-psg-strike-tracksuit-navy.jpg',
  43: 'luxury-washed-denim-jeans.jpg',
  44: 'louis-vuitton-kimono-cardigan-black.jpg',
  45: 'loro-piana-zip-knit-bomber-black.jpg',
  46: 'ralph-lauren-oxford-shirt-khaki.jpg',
  47: 'ralph-lauren-oxford-shirt-navy.jpg',
  48: 'ralph-lauren-oxford-shirt-black.jpg',
  49: 'ralph-lauren-oxford-shirt-blue.jpg',
  50: 'gucci-web-bee-polo-black.jpg'
};

let copied = 0;
files.forEach((f, idx) => {
  const index = idx + 1;
  const cleanName = imageMap[index];
  if (cleanName) {
    const srcFile = path.join(srcDir, f);
    const destFile = path.join(destDir, cleanName);
    fs.copyFileSync(srcFile, destFile);
    copied++;
  }
});

console.log(`Copied ${copied} images with clean semantic names to public/images/products/`);
