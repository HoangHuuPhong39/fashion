const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const productsFile = path.join(DATA_DIR, 'products.json');
const ordersFile = path.join(DATA_DIR, 'orders.json');
const reviewsFile = path.join(DATA_DIR, 'reviews.json');

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
const reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));

console.log(`Ban đầu: ${products.length} sản phẩm, ${orders.length} đơn hàng, ${reviews.length} đánh giá.`);

// 1. Xóa sản phẩm có chữ "Test" hoặc ID chứa test
const cleanedProducts = products.filter((p) => {
  const isTest = p.id.toLowerCase().includes('test') || (p.name && p.name.toLowerCase().includes('test'));
  return !isTest;
});

// 2. Tính số lượng bán thực tế "Đã bán" từ các đơn hàng ĐÃ GIAO THẬT (status === 'delivered')
const actualDeliveredSalesMap = {};
for (const order of orders) {
  if (order.status === 'delivered' && Array.isArray(order.items)) {
    for (const item of order.items) {
      if (item.productId) {
        actualDeliveredSalesMap[item.productId] = (actualDeliveredSalesMap[item.productId] || 0) + (item.quantity || 1);
      }
    }
  }
}

// 3. Tính reviewCount và rating từ bảng reviews ĐÃ DUYỆT (status === 'approved')
const approvedReviewsByProduct = {};
for (const r of reviews) {
  if (r.status === 'approved') {
    if (!approvedReviewsByProduct[r.productId]) {
      approvedReviewsByProduct[r.productId] = [];
    }
    approvedReviewsByProduct[r.productId].push(r);
  }
}

// Chuẩn hóa từng sản phẩm
for (const p of cleanedProducts) {
  // Cập nhật lượt bán từ đơn giao thật
  p.salesCount = actualDeliveredSalesMap[p.id] || 0;
  p.soldCount = p.salesCount;

  // Cập nhật rating và reviewCount từ reviews đã duyệt
  const prodReviews = approvedReviewsByProduct[p.id] || [];
  p.reviewCount = prodReviews.length;
  if (prodReviews.length > 0) {
    const sum = prodReviews.reduce((acc, cur) => acc + (cur.rating || 5), 0);
    p.rating = Number((sum / prodReviews.length).toFixed(1));
  } else {
    p.rating = 0; // Không có review thì để 0 để ẩn sao và số đánh giá
  }

  // Viết hoa đúng chuẩn tên nước xuất xứ
  if (p.originCountry && typeof p.originCountry === 'string') {
    p.originCountry = p.originCountry
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}

// Lưu lại
fs.writeFileSync(productsFile, JSON.stringify(cleanedProducts, null, 2), 'utf8');

console.log(`Sau khi làm sạch: Còn lại ${cleanedProducts.length} sản phẩm.`);
console.log(`Đã cập nhật doanh số từ đơn giao thật và đánh giá từ review đã duyệt.`);
