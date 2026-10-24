const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
const reportsDir = path.join(__dirname, '..', 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const headers = [
  'Mã sản phẩm (ID)',
  'Tên sản phẩm',
  'Thương hiệu',
  'Giá bán hiện tại (VND)',
  'Giá gốc niêm yết (VND)',
  'Phần trăm giảm (%)',
  'Trạng thái hiện tại',
  'Hành động đề xuất cho Chủ shop'
];

const rows = [];
let countGte50 = 0;
let countGte70 = 0;

// Duyệt và kiểm tra
for (const p of products) {
  const price = p.price || 0;
  const originalPrice = p.originalPrice || 0;
  let discountPct = p.discountPercentage || 0;

  if (originalPrice > price) {
    discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  if (discountPct >= 50) {
    countGte50++;
    const isOver70 = discountPct >= 70;
    if (isOver70) countGte70++;

    rows.push([
      `"${p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      price,
      originalPrice,
      `${discountPct}%`,
      `"${isOver70 ? 'Tạm ẩn khỏi trang công khai (giảm >= 70%)' : 'Đang hiển thị (giảm 50-69%)'}"`,
      `"${isOver70 ? 'Cần xác nhận lại giá gốc thật để mở bán lại' : 'Kiểm tra hóa đơn boutique để xác nhận giá niêm yết'}"`
    ]);

    // Tạm ẩn khỏi trang công khai các sản phẩm giảm >= 70% cho tới khi được xác nhận
    if (isOver70) {
      p.status = 'pending_price_review';
    }
  }
}

// Lưu lại file data/products.json sau khi cập nhật status cho các món >= 70%
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');

// Xuất file CSV UTF-8 BOM
const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
const csvPath = path.join(reportsDir, 'bao_cao_san_pham_giam_gia_cao.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`Đã xuất báo cáo CSV: ${csvPath}`);
console.log(`Tổng số sản phẩm giảm >= 50%: ${countGte50}`);
console.log(`Số sản phẩm giảm >= 70% (đã tạm ẩn chờ xác nhận): ${countGte70}`);
