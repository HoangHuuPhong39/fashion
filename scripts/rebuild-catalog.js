const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// 1. Read existing mockData.ts
const mockPath = path.join(__dirname, '../src/data/mockData.ts');
const originalCode = fs.readFileSync(mockPath, 'utf8');

// Transpile to read the existing data structures
const result = ts.transpileModule(originalCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});
const mod = { exports: {} };
new Function('exports', 'require', 'module', result.outputText)(mod.exports, require, mod);

const existingBrands = mod.exports.BRANDS;
const existingCategories = mod.exports.CATEGORIES;
const existingOrders = mod.exports.ORDERS_DATA;
const existingSlides = mod.exports.BANNER_SLIDES;
const existingServices = mod.exports.SERVICE_HIGHLIGHTS;
const existingVipTiers = mod.exports.VIP_TIERS;
const existingEditorial = mod.exports.EDITORIAL_LOOKBOOKS;
const existingReviews = mod.exports.REVIEWS;
const existingCampaigns = mod.exports.CAMPAIGN_DATA;

// 2. Adjust prices of the existing 50 luxury/men/tracksuit products:
// Reduce from tens of millions to realistic boutique retail prices (350k - 2.65m VND)
const existingProducts = mod.exports.PRODUCTS;

const usedImages = new Set();

function registerImage(url) {
  if (usedImages.has(url)) {
    console.error('DUPLICATE IMAGE DETECTED:', url);
    process.exit(1);
  }
  usedImages.add(url);
  return url;
}

// Map old high prices to realistic boutique prices:
function normalizePrice(p) {
  const nameLower = p.name.toLowerCase();
  const brandLower = p.brand.toLowerCase();

  let price = p.price;
  let originalPrice = p.originalPrice;

  // Tracksuits & Sports (Adidas, Nike)
  if (p.category === 'do-bo' || nameLower.includes('tracksuit') || nameLower.includes('track jacket')) {
    price = 650000 + (Math.abs(hashCode(p.id)) % 6) * 50000; // 650.000 - 900.000
    if (p.isSale || Math.abs(hashCode(p.id)) % 2 === 0) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  // Luxury Bombers & Jackets (Loro Piana, LV, Dior, Gucci, Chrome Hearts)
  else if (nameLower.includes('bomber') || nameLower.includes('blazer') || nameLower.includes('măng tô') || nameLower.includes('khoác')) {
    if (['loro piana', 'louis vuitton', 'dior', 'gucci', 'chrome hearts'].includes(brandLower)) {
      price = 1450000 + (Math.abs(hashCode(p.id)) % 7) * 120000; // 1.450.000 - 2.170.000
    } else {
      price = 750000 + (Math.abs(hashCode(p.id)) % 6) * 80000; // 750.000 - 1.150.000
    }
    if (p.isSale || Math.abs(hashCode(p.id)) % 2 === 0) {
      originalPrice = Math.round(price * 1.2 / 10000) * 10000;
    }
  }
  // Cardigans & Knitwear (Burberry, Lacoste, Ralph Lauren)
  else if (nameLower.includes('cardigan') || nameLower.includes('len') || nameLower.includes('knit') || nameLower.includes('sweater')) {
    if (['burberry', 'louis vuitton', 'dior', 'gucci'].includes(brandLower)) {
      price = 850000 + (Math.abs(hashCode(p.id)) % 5) * 80000; // 850.000 - 1.170.000
    } else {
      price = 520000 + (Math.abs(hashCode(p.id)) % 6) * 50000; // 520.000 - 770.000
    }
    if (p.isSale || Math.abs(hashCode(p.id)) % 3 === 0) {
      originalPrice = Math.round(price * 1.22 / 10000) * 10000;
    }
  }
  // Polos & Shirts (Lacoste, Ralph Lauren, Burberry, Gucci)
  else if (nameLower.includes('polo') || nameLower.includes('sơ mi') || nameLower.includes('shirt') || nameLower.includes('tee')) {
    price = 390000 + (Math.abs(hashCode(p.id)) % 6) * 40000; // 390.000 - 590.000
    if (p.isSale || Math.abs(hashCode(p.id)) % 2 === 0) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  // Trousers & Jeans
  else if (p.category === 'quan' || p.subCategory === 'quan' || nameLower.includes('quần') || nameLower.includes('jeans')) {
    price = 450000 + (Math.abs(hashCode(p.id)) % 6) * 50000; // 450.000 - 700.000
    if (p.isSale) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  // Dresses (Váy đầm)
  else if (p.category === 'nu' && (p.subCategory === 'vay-dam' || nameLower.includes('đầm') || nameLower.includes('váy'))) {
    price = 580000 + (Math.abs(hashCode(p.id)) % 6) * 70000; // 580.000 - 930.000
    if (p.isSale) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  // Kids (Trẻ em)
  else if (p.category === 'tre-em') {
    price = 220000 + (Math.abs(hashCode(p.id)) % 5) * 40000; // 220.000 - 380.000
    if (p.isSale) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  // Accessories (Phụ kiện)
  else if (p.category === 'phu-kien') {
    if (nameLower.includes('túi') || nameLower.includes('bag')) {
      price = 550000 + (Math.abs(hashCode(p.id)) % 6) * 80000; // 550.000 - 950.000
    } else if (nameLower.includes('giày') || nameLower.includes('loafer') || nameLower.includes('pump')) {
      price = 490000 + (Math.abs(hashCode(p.id)) % 6) * 60000; // 490.000 - 790.000
    } else {
      price = 280000 + (Math.abs(hashCode(p.id)) % 5) * 40000; // 280.000 - 440.000
    }
    if (p.isSale) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }
  else {
    price = 480000 + (Math.abs(hashCode(p.id)) % 8) * 50000;
    if (p.isSale) {
      originalPrice = Math.round(price * 1.25 / 10000) * 10000;
    }
  }

  // Calculate discount percentage if originalPrice exists
  let discountPercentage = p.discountPercentage;
  if (originalPrice && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  } else {
    originalPrice = undefined;
    discountPercentage = undefined;
  }

  return { price, originalPrice, discountPercentage };
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// 3. Process existing 50 products: Ensure each image is unique
const updatedExisting = [];

existingProducts.forEach(p => {
  // Let's filter only the main items that have local clean images or valid unique images
  const firstImg = p.images[0];
  if (!firstImg) return;

  // Check if image is already used
  if (usedImages.has(firstImg)) {
    // If it's a duplicate, we will skip or provide unique fallback
    console.log('Skipping duplicate existing product:', p.id, p.name);
    return;
  }
  usedImages.add(firstImg);

  const { price, originalPrice, discountPercentage } = normalizePrice(p);

  // Normalize category/subCategory
  let category = p.category;
  let subCategory = p.subCategory;

  if (category === 'ao-khoac') {
    category = 'nam';
    subCategory = 'ao-khoac';
  } else if (category === 'ao-thun') {
    category = 'nam';
    subCategory = 'ao-thun';
  } else if (category === 'quan') {
    category = 'nam';
    subCategory = 'quan';
  }

  // Ensure isSale aligns with originalPrice
  const isSale = !!(originalPrice && originalPrice > price);

  updatedExisting.push({
    ...p,
    category,
    subCategory,
    price,
    originalPrice,
    discountPercentage,
    isSale: isSale || p.isSale || false,
    images: [firstImg]
  });
});

console.log('Retained valid unique existing products:', updatedExisting.length);

// 4. New Hand-Curated Products for Categories that need rich, non-duplicated items:
// - Nữ: Váy đầm, Áo khoác, Áo len, Áo sơ mi/thun, Quần tây & chân váy (Local brands & Order)
// - Trẻ em: Bé gái, Bé trai, Áo len
// - Phụ kiện: Túi xách, Giày dép, Thắt lưng, Kính mắt
// - Local brands: Gia Studios, Subtle Studios, Duc Studio, Nosbyn Studio, Routine, Dottie, LSEOUL
const newProducts = [
  // --- NỮ: VÁY & ĐẦM TIỆC (subCategory: 'vay-dam') ---
  {
    id: 'nu-vay-01',
    name: 'Đầm Lụa Satin Cổ Yếm Dáng Dài Thướt Tha The Aurelia Maxi Dress',
    slug: 'dam-lua-satin-co-yem-the-aurelia-maxi-dress',
    brand: 'Gia Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 980000,
    originalPrice: 1250000,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 15,
    estimatedDelivery: 'Giao nhanh 2-3 ngày toàn quốc',
    images: [registerImage('https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Vàng Champagne', hex: '#E8D7BD' }, { name: 'Đen Tuyển', hex: '#171613' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Chất liệu lụa satin tơ tằm dệt bóng mờ sang trọng, thiết kế cổ yếm khoét lưng quyến rũ cho các buổi tiệc tối và dạ hội cao cấp.',
    material: '100% Silk Satin Tơ Tằm Bảo Lộc',
    careInstructions: ['Giặt khô hoặc giặt hấp chuyên dụng', 'Ủi ở nhiệt độ thấp mặt trái'],
    featured: true,
    isNewArrival: true,
    isSale: true
  },
  {
    id: 'nu-vay-02',
    name: 'Váy Midi Cúp Ngực Phối Ren Thêu Tinh Xảo Corset Lace Midi Dress',
    slug: 'vay-midi-cup-nguc-phoi-ren-corset-lace-midi-dress',
    brand: 'LSEOUL',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'LIMITED'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 890000,
    originalPrice: 1100000,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 42,
    inStock: true,
    stockCount: 18,
    estimatedDelivery: 'Giao nhanh 24-48h',
    images: [registerImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Ngà Ivory', hex: '#FAF8F3' }, { name: 'Hồng Pastel', hex: '#FAD2E1' }],
    sizes: ['S', 'M', 'L'],
    description: 'Thiết kế dáng cúp ngực nâng form kết hợp ren hoa thêu tay điệu đà, phù hợp cho sự kiện, tiệc cưới và hẹn hò lãng mạn.',
    material: 'Ren Cotton cao cấp lót lụa tơ sống',
    careInstructions: ['Giặt tay nhẹ nhàng bằng dầu gội hoặc sữa tắm', 'Không vắt xoắn'],
    featured: true,
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'nu-vay-03',
    name: 'Đầm Lụa Xếp Ly Dáng Xòe Nghệ Thuật The Pleated Silk Evening Gown',
    slug: 'dam-lua-xep-ly-dang-xoe-the-pleated-silk-evening-gown',
    brand: 'Subtle Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 1150000,
    originalPrice: 1450000,
    discountPercentage: 21,
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    stockCount: 12,
    estimatedDelivery: 'Hỏa tốc 2-4h (Nội thành HCM/HN)',
    images: [registerImage('https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xanh Emerald', hex: '#0F5132' }, { name: 'Đỏ Ruby', hex: '#842029' }],
    sizes: ['XS', 'S', 'M'],
    description: 'Kỹ thuật dập ly thủ công tạo hiệu ứng chuyển động gợn sóng mềm mại theo từng bước chân. Đẳng cấp thẩm mỹ Quiet Luxury đương đại.',
    material: 'Lụa Organza cao cấp dập ly',
    careInstructions: ['Giặt khô bảo vệ cấu trúc ly', 'Bảo quản bằng móc treo chuyên dụng'],
    featured: true,
    isSale: true
  },
  {
    id: 'nu-vay-04',
    name: 'Đầm Bodycon Cắt Xẻ Cut-Out Táo Bạo Noir Seduction Dress',
    slug: 'dam-bodycon-cut-out-noir-seduction-dress',
    brand: 'LSEOUL',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 750000,
    originalPrice: 950000,
    discountPercentage: 21,
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Giao hàng 2-3 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Quyền Lực', hex: '#171613' }],
    sizes: ['XS', 'S', 'M'],
    description: 'Form ôm body tôn trọn đường cong cơ thể với đường cắt xẻ hông tinh tế, chất vải thun nhung co giãn đàn hồi cao cấp.',
    material: 'Vải nhung tuyết co giãn 4 chiều',
    careInstructions: ['Giặt máy chế độ nhẹ trong túi giặt'],
    isSale: true
  },
  {
    id: 'nu-vay-05',
    name: 'Váy Sơ Mi Thắt Đai Eo Tối Giản Belted Linen Shirtdress',
    slug: 'vay-so-mi-that-dai-eo-belted-linen-shirtdress',
    brand: 'Nosbyn Studio',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 680000,
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    stockCount: 25,
    estimatedDelivery: 'Hàng có sẵn - Giao ngay',
    images: [registerImage('https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Sữa', hex: '#FAF8F3' }, { name: 'Xanh Navy', hex: '#1E293B' }],
    sizes: ['S', 'M', 'L'],
    description: 'Thiết kế sơ mi thanh lịch cho nàng công sở hiện đại, kèm đai thắt eo tạo tỷ lệ cơ thể hoàn hảo và sự chỉn chu tuyệt đối.',
    material: '100% Organic Linen dệt thoáng khí',
    careInstructions: ['Giặt nước lạnh', 'Ủi khi vải còn hơi ẩm'],
    isNewArrival: true
  },
  {
    id: 'nu-vay-06',
    name: 'Váy Hoa Nhí Vintage Phối Ren Cổ Vuông French Romantic Dress',
    slug: 'vay-hoa-nhi-french-romantic-dress',
    brand: 'Dottie',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'vay-dam',
    price: 490000,
    originalPrice: 650000,
    discountPercentage: 25,
    rating: 4.8,
    reviewCount: 68,
    inStock: true,
    stockCount: 30,
    estimatedDelivery: 'Hàng có sẵn - Giao 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Hoa Nhí Vàng', hex: '#E5A93C' }, { name: 'Hoa Nhí Xanh', hex: '#94A3B8' }],
    sizes: ['S', 'M', 'L'],
    description: 'Họa tiết hoa nhí phong cách đồng quê Pháp nhẹ nhàng, tay phồng bo chun đáng yêu cùng cổ vuông khoe trọn xương quai xanh.',
    material: 'Vải Chiffon tơ mềm mại thoáng mát',
    careInstructions: ['Giặt máy nhẹ', 'Không phơi trực tiếp dưới nắng gắt'],
    isBestSeller: true,
    isSale: true
  },

  // --- NỮ: ÁO KHOÁC & BLAZER (subCategory: 'ao-khoac') ---
  {
    id: 'nu-khoac-01',
    name: 'Áo Khoác Dạ Tweed Tiểu Thư Viền Kim Tuyến Parisian Tweed Jacket',
    slug: 'ao-khoac-da-tweed-parisian-tweed-jacket',
    brand: 'Chanel',
    origin: 'international_order',
    originCountry: 'Pháp',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'nu',
    subCategory: 'ao-khoac',
    price: 1350000,
    originalPrice: 1750000,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 47,
    inStock: true,
    stockCount: 14,
    estimatedDelivery: 'Dự kiến 7-10 ngày (Order Pháp)',
    depositRequired: true,
    depositPercentage: 50,
    images: [registerImage('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Phối Trắng', hex: '#171613' }, { name: 'Kem Vanilla', hex: '#FAF8F3' }],
    sizes: ['S', 'M', 'L'],
    description: 'Biểu tượng kinh điển của nhà mốt Paris với kỹ thuật dệt sợi Tweed đan xen ánh kim sa lấp lánh và hàng cúc kim loại mạ vàng chạm khắc.',
    material: 'Dạ Tweed len dệt thủ công lót lụa Camisole',
    careInstructions: ['Giặt khô cao cấp', 'Ủi hơi nước đứng'],
    featured: true,
    isSale: true
  },
  {
    id: 'nu-khoac-02',
    name: 'Áo Trench Coat Dáng Dài Thắt Đai Cổ Điển Heritage Trench Coat',
    slug: 'ao-trench-coat-dang-dai-heritage-trench-coat',
    brand: 'Burberry',
    origin: 'international_order',
    originCountry: 'Vương quốc Anh',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'nu',
    subCategory: 'ao-khoac',
    price: 1650000,
    originalPrice: 2100000,
    discountPercentage: 21,
    rating: 5.0,
    reviewCount: 36,
    inStock: true,
    stockCount: 10,
    estimatedDelivery: 'Order 7-12 ngày trực tiếp từ London',
    depositRequired: true,
    depositPercentage: 50,
    images: [registerImage('https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Kaki Be Honey', hex: '#E8D7BD' }, { name: 'Đen Jet Black', hex: '#171613' }],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Chất vải Gabardine trượt nước bền bỉ, lót họa tiết kẻ ca-rô Vintage Check hoàng gia Anh Quốc. Phom dáng dài sang trọng bất chấp thời tiết.',
    material: '100% Cotton Gabardine chống thấm nước',
    careInstructions: ['Giặt khô chuyên dụng'],
    featured: true,
    isSale: true
  },
  {
    id: 'nu-khoac-03',
    name: 'Blazer May Đo Phom Hộp Minimalist Structured Tailored Blazer',
    slug: 'blazer-may-do-phom-hop-minimalist-blazer',
    brand: 'Subtle Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'ao-khoac',
    price: 950000,
    rating: 4.8,
    reviewCount: 28,
    inStock: true,
    stockCount: 22,
    estimatedDelivery: 'Hàng có sẵn - Giao 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xám Than Chì', hex: '#334155' }, { name: 'Nâu Mocha', hex: '#8A7158' }],
    sizes: ['S', 'M', 'L'],
    description: 'Đường cắt may tối giản với cầu vai độn định hình cấu trúc sắc nét. Dễ dàng phối cùng quần tây hoặc chân váy lụa cho vẻ ngoài quyền lực.',
    material: 'Len pha Viscose cao cấp đứng phom',
    careInstructions: ['Giặt khô hoặc giặt tay nhẹ'],
    isNewArrival: true
  },
  {
    id: 'nu-khoac-04',
    name: 'Áo Khoác Dạ Ép Lông Cừu Phom Ngắn Cropped Wool Coat',
    slug: 'ao-khoac-da-ep-long-cuu-cropped-wool-coat',
    brand: 'Gia Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'nu',
    subCategory: 'ao-khoac',
    price: 1190000,
    originalPrice: 1550000,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 33,
    inStock: true,
    stockCount: 15,
    estimatedDelivery: 'Giao nhanh toàn quốc 2-3 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Nâu Lạc Đà Camel', hex: '#C78238' }, { name: 'Kem Yến Mạch', hex: '#E8D7BD' }],
    sizes: ['XS', 'S', 'M'],
    description: 'Chất liệu dạ ép hai mặt từ lông cừu nguyên chất siêu nhẹ nhưng giữ ấm tuyệt vời. Phom dáng lửng trẻ trung hack dáng chân dài.',
    material: '90% Wool Lông Cừu, 10% Cashmere',
    careInstructions: ['Giặt khô chuyên dụng lông thú'],
    isBestSeller: true,
    isSale: true
  },

  // --- NỮ: ÁO LEN & CARDIGAN (subCategory: 'ao-len') ---
  {
    id: 'nu-len-01',
    name: 'Áo Len Cổ Lọ Dệt Vặn Thừng Cashmere Cable-Knit Turtleneck',
    slug: 'ao-len-co-lo-det-van-thung-cashmere-turtleneck',
    brand: 'COS',
    origin: 'international_order',
    originCountry: 'Vương quốc Anh',
    badges: ['ORDER QUỐC TẾ'],
    category: 'nu',
    subCategory: 'ao-len',
    price: 650000,
    originalPrice: 850000,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 45,
    inStock: true,
    stockCount: 25,
    estimatedDelivery: 'Giao nhanh 3-5 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Kem Bơ', hex: '#FAF8F3' }, { name: 'Xanh Rêu Olive', hex: '#4B5563' }],
    sizes: ['S', 'M', 'L'],
    description: 'Chất len mềm mịn không dính dặm, họa tiết dệt vặn thừng kinh điển đem lại hơi thở ấm áp chuẩn phong cách Nordic Thu Đông.',
    material: 'Len Merino pha Cashmere hữu cơ',
    careInstructions: ['Giặt tay bằng nước lạnh', 'Phơi nằm ngang trên mặt phẳng'],
    isSale: true
  },
  {
    id: 'nu-len-02',
    name: 'Cardigan Dệt Kim Cúc Xà Cừ Artisanal Pearl Button Cardigan',
    slug: 'cardigan-det-kim-cuc-xa-cu-pearl-cardigan',
    brand: 'Dottie',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'ao-len',
    price: 450000,
    originalPrice: 580000,
    discountPercentage: 22,
    rating: 4.7,
    reviewCount: 52,
    inStock: true,
    stockCount: 30,
    estimatedDelivery: 'Giao hàng 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Hồng Phấn Mơ', hex: '#FAD2E1' }, { name: 'Be Khói', hex: '#E8D7BD' }],
    sizes: ['S', 'M', 'L'],
    description: 'Sợi len lông thỏ nhân tạo mềm mại bồng bềnh như mây, điểm xuyết dàn cúc ngọc trai xà cừ óng ánh tinh xảo.',
    material: 'Len sợi lông mềm mại cao cấp',
    careInstructions: ['Giặt tay nhẹ nhàng', 'Tránh vắt xoắn'],
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'nu-len-03',
    name: 'Áo Sweater Dệt Kim Cổ Chữ V Oversize Relaxed V-Neck Knit',
    slug: 'ao-sweater-det-kim-co-v-oversize',
    brand: 'Zara',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ'],
    category: 'nu',
    subCategory: 'ao-len',
    price: 520000,
    rating: 4.8,
    reviewCount: 34,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Order 5-7 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Ghi Xám Nhạt', hex: '#CBD5E1' }, { name: 'Nâu Cà Phê', hex: '#8A7158' }],
    sizes: ['S', 'M', 'L'],
    description: 'Phom dáng thụng lười biếng phóng khoáng, cổ chữ V gợi cảm giúp thon gọn gương mặt và dễ dàng layering với áo sơ mi bên trong.',
    material: 'Sợi Cotton Dệt Kim hỗn hợp len',
    careInstructions: ['Giặt máy chế độ len nhẹ'],
    isNewArrival: true
  },
  {
    id: 'nu-len-04',
    name: 'Áo Cardigan Họa Tiết Quả Trám Vintage Argyle Knit Cardigan',
    slug: 'ao-cardigan-hoa-tiet-qua-tram-argyle-cardigan',
    brand: 'Mango',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ'],
    category: 'nu',
    subCategory: 'ao-len',
    price: 580000,
    originalPrice: 750000,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 39,
    inStock: true,
    stockCount: 18,
    estimatedDelivery: 'Giao nhanh 3-5 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Nâu Xanh Vintage', hex: '#8A7158' }],
    sizes: ['S', 'M'],
    description: 'Họa tiết quả trám cổ điển đậm chất nữ sinh đại học Anh Quốc, mang đến nét hoài niệm và thanh lịch cho ngày se lạnh.',
    material: 'Len sợi hữu cơ dệt mật độ cao',
    careInstructions: ['Giặt tay nước lạnh'],
    isSale: true
  },

  // --- NỮ: ÁO SƠ MI & BLOUSE (subCategory: 'ao-thun') ---
  {
    id: 'nu-somi-01',
    name: 'Áo Sơ Mi Lụa Tơ Tằm Cổ Bèo Thắt Nơ Tie-Neck Silk Blouse',
    slug: 'ao-so-mi-lua-to-tam-co-beo-that-no-silk-blouse',
    brand: 'Gia Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'nu',
    subCategory: 'ao-thun',
    price: 690000,
    originalPrice: 890000,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    stockCount: 16,
    estimatedDelivery: 'Giao nhanh 24-48h',
    images: [registerImage('https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Ngọc Trai', hex: '#FAF8F3' }, { name: 'Xanh Pastel', hex: '#93C5FD' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Thiết kế dải nơ dài duyên dáng thả rơi trước ngực, tay áo xếp ly nhẹ nhàng khẳng định phong cách quý cô tri thức.',
    material: '100% Lụa Habotai cao cấp',
    careInstructions: ['Ủi mặt trái ở nhiệt độ thấp'],
    featured: true,
    isSale: true
  },
  {
    id: 'nu-somi-02',
    name: 'Áo Blouse Ren Tay Bồng Tiểu Thư Victorian Lace Blouse',
    slug: 'ao-blouse-ren-tay-bong-victorian-lace-blouse',
    brand: 'Dottie',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'ao-thun',
    price: 420000,
    originalPrice: 550000,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 63,
    inStock: true,
    stockCount: 35,
    estimatedDelivery: 'Hàng có sẵn - Giao 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1551799517-eb8f03cb5e6a?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Tinh Khôi', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L'],
    description: 'Chất ren thêu họa tiết hoa nổi 3D, cổ áo đính ngọc trai tinh tế và tay áo phồng xếp ly mang hơi thở quý tộc châu Âu.',
    material: 'Ren Cotton mềm lót vải thun lụa mát',
    careInstructions: ['Giặt tay nhẹ trong nước lạnh'],
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'nu-somi-03',
    name: 'Áo Thun Gân Ôm Body Cổ Vuông Tôn Dáng Ribbed Square-Neck Tee',
    slug: 'ao-thun-gan-om-body-co-vuong-ribbed-square-neck-tee',
    brand: 'Routine',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'ao-thun',
    price: 290000,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    stockCount: 50,
    estimatedDelivery: 'Giao ngay trong 24h',
    images: [registerImage('https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Basic', hex: '#171613' }, { name: 'Nâu Cacao', hex: '#8A7158' }, { name: 'Trắng Bơ', hex: '#FAF8F3' }],
    sizes: ['S', 'M', 'L'],
    description: 'Vải cotton tăm co giãn 4 chiều ôm sát tôn eo thon, thiết kế cổ vuông hiện đại khoe trọn xương quai xanh quyến rũ.',
    material: '95% Cotton Spandex cao cấp',
    careInstructions: ['Giặt máy bình thường'],
    isNewArrival: true
  },

  // --- NỮ: QUẦN TÂY & CHÂN VÁY (subCategory: 'quan') ---
  {
    id: 'nu-quan-01',
    name: 'Quần Âu Nữ Cạp Cao Xếp Ly Ống Suông High-Waisted Pleated Trousers',
    slug: 'quan-au-nu-cap-cao-xep-ly-high-waisted-pleated-trousers',
    brand: 'Nosbyn Studio',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'nu',
    subCategory: 'quan',
    price: 590000,
    originalPrice: 750000,
    discountPercentage: 21,
    rating: 4.9,
    reviewCount: 54,
    inStock: true,
    stockCount: 28,
    estimatedDelivery: 'Giao nhanh 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1551803091-e20673f15770?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Be Cát Sáng', hex: '#E8D7BD' }, { name: 'Đen Tuyển', hex: '#171613' }],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Phom dáng suông rộng thời thượng tạo hiệu ứng kéo dài chân, chi tiết xếp ly đôi trước bụng giúp che khuyết điểm khéo léo.',
    material: 'Vải Tuyết Mưa dệt mật độ cao chống nhăn',
    careInstructions: ['Giặt máy ở chế độ nhẹ'],
    featured: true,
    isSale: true
  },
  {
    id: 'nu-quan-02',
    name: 'Chân Váy Lụa Satin Dáng Dài Xẻ Tà Midi Silk Slip Skirt',
    slug: 'chan-vay-lua-satin-dang-dai-midi-silk-slip-skirt',
    brand: 'Gia Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND'],
    category: 'nu',
    subCategory: 'quan',
    price: 520000,
    originalPrice: 680000,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 46,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Giao hàng 2-3 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xanh Rêu Bạc', hex: '#64748B' }, { name: 'Champagne Ánh Kim', hex: '#E8D7BD' }],
    sizes: ['S', 'M', 'L'],
    description: 'Chất vải lụa tơ bóng bẩy chuyển màu theo góc sáng, độ rủ tuyệt đối ôm nhẹ hông và xòe nhẹ đuôi cá uyển chuyển.',
    material: 'Lụa Satin dệt sợi mịn chống xước',
    careInstructions: ['Ủi nhiệt độ thấp mặt trong'],
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'nu-quan-03',
    name: 'Quần Jeans Ống Suông Rộng Cạp Cao Vintage Wash Denim Trousers',
    slug: 'quan-jeans-ong-suong-vintage-wash-denim',
    brand: 'Routine',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'nu',
    subCategory: 'quan',
    price: 490000,
    rating: 4.8,
    reviewCount: 72,
    inStock: true,
    stockCount: 40,
    estimatedDelivery: 'Hàng có sẵn - Giao 24h',
    images: [registerImage('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xanh Denim Nhạt', hex: '#60A5FA' }, { name: 'Xanh Indigo Cổ Điển', hex: '#1E3A8A' }],
    sizes: ['26', '27', '28', '29', '30'],
    description: 'Chất liệu Denim 100% cotton dệt chéo dày dặn chuẩn form, kỹ thuật mài wash màu loang vintage thời thượng tôn vòng 3.',
    material: '100% Heavyweight Cotton Denim',
    careInstructions: ['Giặt lộn trái, tránh ngâm chất tẩy'],
    isNewArrival: true
  },

  // --- TRẺ EM (category: 'tre-em') ---
  {
    id: 'treem-gai-01',
    name: 'Váy Xòe Công Chúa Bèo Nhún Phối Ren Thêu Little Rose Princess Dress',
    slug: 'vay-xoe-cong-chua-beo-nhun-little-rose-princess-dress',
    brand: 'Zara',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ'],
    category: 'tre-em',
    subCategory: 'be-gai',
    price: 360000,
    originalPrice: 480000,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 27,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Order 5-7 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Hồng Phấn Pastel', hex: '#FAD2E1' }, { name: 'Trắng Tinh', hex: '#FAF8F3' }],
    sizes: ['90 (1-2T)', '100 (2-3T)', '110 (3-4T)', '120 (5-6T)'],
    description: 'Chất liệu voan lưới mềm lót 100% cotton kháng khuẩn bảo vệ làn da non nớt của bé, tầng váy phồng bồng bềnh công chúa.',
    material: 'Lớp ngoài Voan lưới mỏng nhẹ, lót 100% Organic Cotton',
    careInstructions: ['Giặt tay nhẹ nhàng trong túi giặt'],
    featured: true,
    isSale: true
  },
  {
    id: 'treem-gai-02',
    name: 'Set Váy Yếm Kẻ Ca Rô Kèm Áo Tiểu Thư Tay Phồng Bé Gái',
    slug: 'set-vay-yem-ke-ca-ro-ao-tay-phong-be-gai',
    brand: 'Uniqlo',
    origin: 'international_order',
    originCountry: 'Nhật Bản',
    badges: ['ORDER QUỐC TẾ', 'HÀNG CÓ SẴN'],
    category: 'tre-em',
    subCategory: 'be-gai',
    price: 320000,
    originalPrice: 420000,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 38,
    inStock: true,
    stockCount: 25,
    estimatedDelivery: 'Hàng có sẵn - Giao 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Ca Rô Nâu Vintage', hex: '#8A7158' }],
    sizes: ['90', '100', '110', '120', '130'],
    description: 'Set đồ phối hoàn hảo gồm áo sơ mi cổ bèo tiểu thư và váy yếm dạ len ca rô xinh xắn cho bé dạo phố hay đi tiệc cùng ba mẹ.',
    material: 'Vải dạ len pha cotton không kích ứng',
    careInstructions: ['Giặt máy nước ấm'],
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'treem-gai-03',
    name: 'Váy Đầm Dệt Kim Xòe Tầng Cotton Hữu Cơ Bé Gái Soft Organic Knit',
    slug: 'vay-dam-det-kim-cotton-huu-co-be-gai',
    brand: 'Mango',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ'],
    category: 'tre-em',
    subCategory: 'be-gai',
    price: 290000,
    rating: 4.7,
    reviewCount: 21,
    inStock: true,
    stockCount: 18,
    estimatedDelivery: 'Giao nhanh 3-4 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Vàng Mù Tạt', hex: '#E5A93C' }, { name: 'Cam Đất', hex: '#EA580C' }],
    sizes: ['100', '110', '120', '130'],
    description: 'Sợi len cotton tự nhiên dệt mịn, độ co giãn thoải mái cho bé thỏa sức nô đùa hoạt động cả ngày dài.',
    material: '100% Certified Organic Cotton',
    careInstructions: ['Giặt máy chế độ nhẹ'],
    isNewArrival: true
  },
  {
    id: 'treem-trai-01',
    name: 'Set Đồ Vest Công Tử Bé Trai Lịch Lãm Kèm Nơ Cổ Gentleman Suit Set',
    slug: 'set-do-vest-cong-tu-be-trai-gentleman-suit',
    brand: 'Zara',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'tre-em',
    subCategory: 'be-trai',
    price: 450000,
    originalPrice: 590000,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 32,
    inStock: true,
    stockCount: 15,
    estimatedDelivery: 'Order 5-7 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xanh Navy Hoàng Gia', hex: '#1E293B' }, { name: 'Ghi Xám Lịch Lãm', hex: '#64748B' }],
    sizes: ['90', '100', '110', '120', '130'],
    description: 'Gồm áo vest form chuẩn, quần âu lưng thun co giãn thoải mái và nơ cổ bảnh bao, hoàn hảo cho bé chụp hình thôi nôi và dự tiệc.',
    material: 'Vải Kaki Tuyết Mưa pha Cotton cao cấp mềm êm',
    careInstructions: ['Giặt khô hoặc giặt tay'],
    featured: true,
    isSale: true
  },
  {
    id: 'treem-trai-02',
    name: 'Set Áo Polo & Quần Short Năng Động Bé Trai Summer Sporty Set',
    slug: 'set-ao-polo-quan-short-be-trai-summer-sporty',
    brand: 'Uniqlo',
    origin: 'international_order',
    originCountry: 'Nhật Bản',
    badges: ['ORDER QUỐC TẾ', 'HÀNG CÓ SẴN'],
    category: 'tre-em',
    subCategory: 'be-trai',
    price: 280000,
    rating: 4.8,
    reviewCount: 45,
    inStock: true,
    stockCount: 30,
    estimatedDelivery: 'Giao ngay 24h',
    images: [registerImage('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Phối Xanh Dương', hex: '#3B82F6' }, { name: 'Vàng Kem Phối Ghi', hex: '#FDE047' }],
    sizes: ['100', '110', '120', '130', '140'],
    description: 'Chất liệu thun cá sấu mắt chim thấm hút mồ hôi tối ưu, quần short cạp chun co giãn cho bé thoải mái chạy nhảy.',
    material: '100% Piqué Cotton mềm mại',
    careInstructions: ['Giặt máy thoải mái'],
    isBestSeller: true
  },
  {
    id: 'treem-trai-03',
    name: 'Bộ Quần Áo Thể Thao Nỉ Bông Bé Trai Khủng Long Dino Active Tracksuit',
    slug: 'bo-the-thao-ni-bong-be-trai-dino-active',
    brand: 'Adidas Originals',
    origin: 'international_order',
    originCountry: 'Đức',
    badges: ['ORDER QUỐC TẾ'],
    category: 'tre-em',
    subCategory: 'be-trai',
    price: 350000,
    originalPrice: 450000,
    discountPercentage: 22,
    rating: 4.8,
    reviewCount: 36,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Giao 2-4 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Xanh Lá Rừng', hex: '#15803D' }, { name: 'Xanh Thép', hex: '#475569' }],
    sizes: ['100', '110', '120', '130'],
    description: 'Bộ thể thao nỉ da cá ấm áp với chi tiết 3 sọc kinh điển bên hông và hình in khủng long ngộ nghĩnh mà các bé trai cực kỳ yêu thích.',
    material: 'Nỉ Cotton lót bông giữ ấm cao cấp',
    careInstructions: ['Giặt máy chế độ thường'],
    isSale: true
  },
  {
    id: 'treem-len-01',
    name: 'Áo Len Dệt Kim Họa Tiết Gấu Bắc Cực Bé Gái & Bé Trai Unisex',
    slug: 'ao-len-det-kim-hoa-tiet-gau-tre-em',
    brand: 'Uniqlo',
    origin: 'international_order',
    originCountry: 'Nhật Bản',
    badges: ['ORDER QUỐC TẾ'],
    category: 'tre-em',
    subCategory: 'ao-len',
    price: 260000,
    originalPrice: 350000,
    discountPercentage: 26,
    rating: 4.9,
    reviewCount: 50,
    inStock: true,
    stockCount: 35,
    estimatedDelivery: 'Giao nhanh 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đỏ Noel', hex: '#B83A3A' }, { name: 'Trắng Bông Tuyết', hex: '#FAF8F3' }],
    sizes: ['90', '100', '110', '120', '130'],
    description: 'Chất len sợi mềm mịn kháng khuẩn, dệt hình gấu đáng yêu mang lại cảm giác ấm áp và tươi vui cho mùa lễ hội cuối năm.',
    material: 'Len Acrylic pha Cotton sợi mềm không ngứa',
    careInstructions: ['Giặt máy ở túi giặt len'],
    isSale: true
  },

  // --- PHỤ KIỆN (category: 'phu-kien') ---
  {
    id: 'pk-tui-01',
    name: 'Túi Xách Da Kẹp Nách Dáng Bán Nguyệt The Crescent Leather Shoulder Bag',
    slug: 'tui-xach-da-kep-nach-the-crescent-leather-shoulder-bag',
    brand: 'Gia Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'PREMIUM'],
    category: 'phu-kien',
    subCategory: 'tui-xach',
    price: 790000,
    originalPrice: 990000,
    discountPercentage: 20,
    rating: 4.9,
    reviewCount: 48,
    inStock: true,
    stockCount: 15,
    estimatedDelivery: 'Giao nhanh 24-48h',
    images: [registerImage('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Nâu Bò Cổ Điển', hex: '#8A7158' }, { name: 'Đen Jet Black', hex: '#171613' }],
    sizes: ['One Size (24x15x7 cm)'],
    description: 'Kiệt tác túi xách kẹp nách phong cách tối giản với đường cong bán nguyệt trứ danh, da bê tự nhiên dập nổi logo thương hiệu mạ vàng.',
    material: '100% Da bê Nappa nguyên tấm lót nhung',
    careInstructions: ['Lau nhẹ bằng khăn ẩm mềm, tránh dính nước'],
    featured: true,
    isSale: true
  },
  {
    id: 'pk-tui-02',
    name: 'Túi Tote Da Bò Sáp Cỡ Lớn Đựng Vừa Laptop Minimalist Work Tote',
    slug: 'tui-tote-da-bo-sap-co-lon-minimalist-work-tote',
    brand: 'Subtle Studios',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND'],
    category: 'phu-kien',
    subCategory: 'tui-xach',
    price: 680000,
    rating: 4.8,
    reviewCount: 39,
    inStock: true,
    stockCount: 20,
    estimatedDelivery: 'Giao hàng 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Tuyển', hex: '#171613' }, { name: 'Nâu Espresso', hex: '#4B3621' }],
    sizes: ['One Size (38x28x12 cm)'],
    description: 'Túi tote công sở chứa trọn laptop 14-15 inch và tài liệu, quai đeo vai trợ lực êm ái thích hợp cho người đi làm và doanh nhân.',
    material: 'Da tổng hợp PU sáp cao cấp chống trầy xước',
    careInstructions: ['Vệ sinh bằng xi dưỡng da chuyên dụng'],
    isBestSeller: true
  },
  {
    id: 'pk-tui-03',
    name: 'Túi Đeo Chéo Chần Quả Trám Khóa Xoay Kim Loại Mạ Vàng The Quilted Crossbody',
    slug: 'tui-deo-cheo-chan-qua-tram-the-quilted-crossbody',
    brand: 'Chanel',
    origin: 'international_order',
    originCountry: 'Pháp',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'phu-kien',
    subCategory: 'tui-xach',
    price: 1150000,
    originalPrice: 1450000,
    discountPercentage: 21,
    rating: 5.0,
    reviewCount: 42,
    inStock: true,
    stockCount: 10,
    estimatedDelivery: 'Order 7-10 ngày từ Paris',
    depositRequired: true,
    depositPercentage: 50,
    images: [registerImage('https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Huyền Bí', hex: '#171613' }, { name: 'Trắng Kem Ivory', hex: '#FAF8F3' }],
    sizes: ['One Size (20x13x6 cm)'],
    description: 'Họa tiết chần bông hình quả trám kinh điển, dây xích luồn da thanh mảnh cùng khóa xoay kim loại mạ vàng 18K sang trọng bất hủ.',
    material: 'Da cừu Caviar chống trầy xước bền bỉ',
    careInstructions: ['Bảo quản trong túi dustbag khi không sử dụng'],
    featured: true,
    isSale: true
  },
  {
    id: 'pk-giay-01',
    name: 'Giày Cao Gót Mũi Nhọn Da Bóng Gót Mảnh Stiletto Pumps 7cm',
    slug: 'giay-cao-got-mui-nhon-stiletto-pumps-7cm',
    brand: 'Zara',
    origin: 'international_order',
    originCountry: 'Tây Ban Nha',
    badges: ['ORDER QUỐC TẾ'],
    category: 'phu-kien',
    subCategory: 'giay-dep',
    price: 590000,
    originalPrice: 750000,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 65,
    inStock: true,
    stockCount: 22,
    estimatedDelivery: 'Giao nhanh 2-3 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Bóng Quyền Lực', hex: '#171613' }, { name: 'Nude Tôn Chân', hex: '#E8D7BD' }],
    sizes: ['35', '36', '37', '38', '39'],
    description: 'Mũi giày vuốt nhọn thanh thoát kéo dài bàn chân, độ cao 7cm chuẩn tỷ lệ cân đối giúp bước đi tự tin, êm chân suốt cả ngày.',
    material: 'Da bóng lót đệm cao su non êm ái',
    careInstructions: ['Lau sạch bằng khăn mềm sau khi sử dụng'],
    featured: true,
    isSale: true
  },
  {
    id: 'pk-giay-02',
    name: 'Giày Loafer Da Thật Khóa Kim Loại Horsebit Penny Loafers Nam & Nữ',
    slug: 'giay-loafer-da-that-horsebit-penny-loafers',
    brand: 'Gucci',
    origin: 'international_order',
    originCountry: 'Ý',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'phu-kien',
    subCategory: 'giay-dep',
    price: 850000,
    originalPrice: 1100000,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 38,
    inStock: true,
    stockCount: 16,
    estimatedDelivery: 'Order 7-10 ngày từ Milan',
    depositRequired: true,
    depositPercentage: 50,
    images: [registerImage('https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Nâu Cà Phê Cháy', hex: '#4B3621' }, { name: 'Đen Jet Black', hex: '#171613' }],
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    description: 'Di sản giày lười phong cách Sartorial Ý với chi tiết móng ngựa khóa kim loại Horsebit kinh điển, đế cao su khâu viền chắc chắn.',
    material: 'Da bò Calfskin thuộc thảo mộc thủ công',
    careInstructions: ['Đánh xi thường xuyên giữ độ bóng mềm'],
    isBestSeller: true,
    isSale: true
  },
  {
    id: 'pk-giay-03',
    name: 'Giày Sneaker Thể Thao Da Lộn Phối Màu Retro Vintage Runner',
    slug: 'giay-sneaker-da-lon-retro-vintage-runner',
    brand: 'Adidas Originals',
    origin: 'international_order',
    originCountry: 'Đức',
    badges: ['ORDER QUỐC TẾ', 'HÀNG CÓ SẴN'],
    category: 'phu-kien',
    subCategory: 'giay-dep',
    price: 720000,
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    stockCount: 30,
    estimatedDelivery: 'Giao ngay trong 24h',
    images: [registerImage('https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Phối Xám Khói', hex: '#E2E8F0' }, { name: 'Xanh Vintage', hex: '#3B82F6' }],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    description: 'Phong cách Terrace cổ điển thập niên 80 với thân giày da lộn cao cấp, đế kẹo cao su gum bám đường êm ái cho mọi trang phục.',
    material: 'Da lộn tự nhiên kết hợp vải dệt lưới thoáng khí',
    careInstructions: ['Dùng bàn chải da lộn chuyên dụng'],
    isNewArrival: true
  },
  {
    id: 'pk-thatlung-01',
    name: 'Thắt Lưng Da Bò Nguyên Miếng Khóa Kim Loại Classic Leather Belt',
    slug: 'that-lung-da-bo-nguyen-mieng-classic-belt',
    brand: 'Polo Ralph Lauren',
    origin: 'international_order',
    originCountry: 'Hoa Kỳ',
    badges: ['ORDER QUỐC TẾ'],
    category: 'phu-kien',
    subCategory: 'that-lung',
    price: 380000,
    originalPrice: 480000,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 46,
    inStock: true,
    stockCount: 25,
    estimatedDelivery: 'Hàng có sẵn - Giao 1-2 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Nâu Bò Cổ Điển', hex: '#8A7158' }, { name: 'Đen Jet Black', hex: '#171613' }],
    sizes: ['95cm', '105cm', '115cm'],
    description: 'Gia công từ da bò mộc tự nhiên nguyên tấm dày 3.8mm không bong tróc, mặt khóa kim loại đúc nguyên khối chống gỉ sét bền bỉ.',
    material: '100% Da bò nguyên miếng Top-Grain',
    careInstructions: ['Tránh ngâm nước và tiếp xúc hóa chất'],
    isSale: true
  },
  {
    id: 'pk-thatlung-02',
    name: 'Thắt Lưng Nữ Bản Nhỏ Mặt Khóa Tròn Mạ Vàng Dainty Waist Belt',
    slug: 'that-lung-nu-ban-nho-mat-khoa-tron-dainty-belt',
    brand: 'Nosbyn Studio',
    origin: 'vietnam_local_brand',
    originCountry: 'Việt Nam',
    badges: ['LOCAL BRAND', 'HÀNG CÓ SẴN'],
    category: 'phu-kien',
    subCategory: 'that-lung',
    price: 260000,
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    stockCount: 35,
    estimatedDelivery: 'Giao hàng 24h',
    images: [registerImage('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen', hex: '#171613' }, { name: 'Nâu Caramel', hex: '#D97706' }],
    sizes: ['One Size (95cm, có lỗ điều chỉnh)'],
    description: 'Bản dây 1.5cm thanh mảnh lý tưởng để thắt váy đầm, áo blazer hoặc quần tây công sở, tạo điểm nhấn eo thon quyến rũ.',
    material: 'Da nhân tạo mềm mịn không nứt gãy',
    careInstructions: ['Lau sạch bằng khăn khô'],
    isNewArrival: true
  },
  {
    id: 'pk-kinh-01',
    name: 'Kính Râm Mắt Mèo Gọng Acetate Chống Tia UV400 Cat-Eye Sunglasses',
    slug: 'kinh-ram-mat-meo-gong-acetate-cat-eye-sunglasses',
    brand: 'Jacquemus',
    origin: 'international_order',
    originCountry: 'Pháp',
    badges: ['ORDER QUỐC TẾ', 'PREMIUM'],
    category: 'phu-kien',
    subCategory: 'phu-kien',
    price: 490000,
    originalPrice: 650000,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 55,
    inStock: true,
    stockCount: 18,
    estimatedDelivery: 'Giao nhanh 2-3 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Đen Bóng', hex: '#171613' }, { name: 'Đồi Mồi Tortoiseshell', hex: '#8A7158' }],
    sizes: ['One Size'],
    description: 'Phom kính mắt mèo góc cạnh thời thượng chuẩn phong cách Parisian Chic, tròng kính phân cực polarized chống chói và tia UV400 tuyệt đối.',
    material: 'Gọng Acetate cao cấp, tròng kính Polycarbonate chống xước',
    careInstructions: ['Vệ sinh bằng khăn lau microfiber chuyên dụng kèm hộp'],
    featured: true,
    isSale: true
  },
  {
    id: 'pk-kinh-02',
    name: 'Vòng Cổ Ngọc Trai Nước Ngọt Phối Mặt Dây Bạc .925 Pearl Pendant Necklace',
    slug: 'vong-co-ngoc-trai-nuoc-ngot-pearl-necklace',
    brand: 'Chrome Hearts',
    origin: 'international_order',
    originCountry: 'Hoa Kỳ',
    badges: ['ORDER QUỐC TẾ'],
    category: 'phu-kien',
    subCategory: 'phu-kien',
    price: 450000,
    originalPrice: 590000,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 37,
    inStock: true,
    stockCount: 12,
    estimatedDelivery: 'Giao hàng 3-4 ngày',
    images: [registerImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1000&auto=format&fit=crop&q=85')],
    colors: [{ name: 'Trắng Ánh Ngọc Trai', hex: '#FAF8F3' }],
    sizes: ['Dây 45cm + 5cm mắt nối'],
    description: 'Sự kết hợp giữa nét quý phái của ngọc trai tự nhiên và nét cá tính của mặt dây chữ thập bạc Sterling, xu hướng trang sức Unisex được săn đón nhất.',
    material: 'Ngọc trai nước ngọt nuôi tự nhiên, khóa Bạc S925',
    careInstructions: ['Tránh xịt nước hoa trực tiếp lên ngọc trai'],
    isBestSeller: true,
    isSale: true
  }
];

// Combine all products
const allProducts = [...updatedExisting, ...newProducts];

console.log('Total combined products:', allProducts.length);

// Verify that EVERY image in allProducts is unique
const checkSet = new Set();
let dupCount = 0;
allProducts.forEach(p => {
  p.images.forEach(img => {
    if (checkSet.has(img)) {
      console.error(`Duplicate detected in final list! ID: ${p.id}, Img: ${img}`);
      dupCount++;
    }
    checkSet.add(img);
  });
});

if (dupCount > 0) {
  console.error(`Found ${dupCount} duplicate images! Stopping.`);
  process.exit(1);
}

console.log('Verification PASSED: 100% of images are unique!');

// Check categories distribution
const catBreakdown = {};
const subCatBreakdown = {};
const brandBreakdown = {};
let saleCount = 0;
allProducts.forEach(p => {
  catBreakdown[p.category] = (catBreakdown[p.category] || 0) + 1;
  const k = `${p.category} -> ${p.subCategory}`;
  subCatBreakdown[k] = (subCatBreakdown[k] || 0) + 1;
  brandBreakdown[p.brand] = (brandBreakdown[p.brand] || 0) + 1;
  if (p.isSale) saleCount++;
});

console.log('\n--- Final Category Breakdown ---', catBreakdown);
console.log('\n--- Final SubCategory Breakdown ---', subCatBreakdown);
console.log('\n--- Sale items count ---', saleCount);

// Generate new mockData.ts content
const fileHeader = `import { Product, Brand, Category, Order, LookbookItem, Review, VIPBenefit, CampaignBanner } from '@/types';\n\n`;

const brandsOutput = `export const BRANDS: Brand[] = ${JSON.stringify(existingBrands, null, 2)};\n\n`;
const categoriesOutput = `export const CATEGORIES: Category[] = ${JSON.stringify(existingCategories, null, 2)};\n\n`;
const productsOutput = `export const PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};\n\n`;
const ordersOutput = `export const ORDERS_DATA: Order[] = ${JSON.stringify(existingOrders, null, 2)};\n\n`;
const slidesOutput = `export const BANNER_SLIDES = ${JSON.stringify(existingSlides, null, 2)};\n\n`;
const servicesOutput = `export const SERVICE_HIGHLIGHTS = ${JSON.stringify(existingServices, null, 2)};\n\n`;
const vipOutput = `export const VIP_TIERS: VIPBenefit[] = ${JSON.stringify(existingVipTiers, null, 2)};\n\n`;
const editorialOutput = `export const EDITORIAL_LOOKBOOKS: LookbookItem[] = ${JSON.stringify(existingEditorial, null, 2)};\n\n`;
const reviewsOutput = `export const REVIEWS: Review[] = ${JSON.stringify(existingReviews, null, 2)};\n\n`;
const campaignsOutput = `export const CAMPAIGN_DATA: CampaignBanner[] = ${JSON.stringify(existingCampaigns, null, 2)};\n`;

const finalFileContent = fileHeader + brandsOutput + categoriesOutput + productsOutput + ordersOutput + slidesOutput + servicesOutput + vipOutput + editorialOutput + reviewsOutput + campaignsOutput;

fs.writeFileSync(mockPath, finalFileContent, 'utf8');
console.log('Successfully updated src/data/mockData.ts with clean, synchronized, reasonable prices and unique images!');
