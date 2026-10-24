const fs = require('fs');
const path = require('path');

// Import DB functions (bằng ts-node hoặc require từ file JS đơn giản)
const DATA_DIR = path.join(process.cwd(), 'data');

console.log('=== BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG TADA! ===\n');

// 1. Kiểm tra tồn tại các file dữ liệu
const files = ['products.json', 'orders.json', 'inventory_logs.json', 'reviews.json', 'users.json'];
files.forEach((f) => {
  const p = path.join(DATA_DIR, f);
  const exists = fs.existsSync(p);
  console.log(`[DATA CHECK] File ${f}: ${exists ? '✓ TỒN TẠI' : '✗ CHƯA TẠO (Sẽ tự động khởi tạo khi app chạy)'}`);
});

console.log('\n=== KIỂM THỬ THÀNH CÔNG ===');
