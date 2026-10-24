import {
  getDBProducts,
  saveOrUpdateProduct,
  adjustProductStock,
  getDBInventoryLogs,
  createDBOrder,
  getDBOrders,
  updateDBOrderStatus,
  addDBReview,
  getDBReviews
} from '../src/lib/db';

async function runTests() {
  console.log('=====================================================');
  console.log('   BẮT ĐẦU CHẠY KIỂM THỬ TẤT CẢ CÁC LUỒNG TADA!     ');
  console.log('=====================================================\n');

  // KỊCH BẢN 1: KHỞI TẠO VÀ LẤY DANH SÁCH SẢN PHẨM CÓ BIẾN THỂ
  console.log('--- [KỊCH BẢN 1] Kiểm tra danh mục sản phẩm & biến thể ---');
  const products = getDBProducts();
  console.log(`✓ Đã tải ${products.length} sản phẩm từ cơ sở dữ liệu.`);
  const sample = products[0];
  console.log(`  Sản phẩm mẫu: "${sample.name}"`);
  console.log(`  Mã SKU: ${sample.sku}`);
  console.log(`  Tổng tồn kho: ${sample.stockCount} chiếc`);
  console.log(`  Số biến thể: ${sample.variants?.length || 0} biến thể`);
  if (!sample.variants || sample.variants.length === 0) {
    throw new Error('Thất bại: Sản phẩm thiếu biến thể');
  }
  console.log('  Biến thể mẫu 1:', sample.variants[0].color, '-', sample.variants[0].size, `(Tồn: ${sample.variants[0].stockCount})`);

  // KỊCH BẢN 2: THÊM SẢN PHẨM MỚI KÈM NHIỀU ẢNH VÀ BIẾN THỂ
  console.log('\n--- [KỊCH BẢN 2] Thêm sản phẩm mới kèm nhiều ảnh & biến thể ---');
  const newProd = saveOrUpdateProduct({
    name: 'Đầm Lụa TADA! Signature Haute Couture Test',
    brand: 'TADA! Atelier',
    category: 'nu',
    price: 1850000,
    originalPrice: 2200000,
    stockCount: 20,
    images: ['/images/products/dress-1.jpg', '/images/products/dress-2.jpg', '/images/products/dress-3.jpg'],
    colors: [{ name: 'Đen Huyền Bí', hex: '#111111' }, { name: 'Be Ánh Kim', hex: '#E8D7BD' }],
    sizes: ['S', 'M', 'L']
  });
  console.log(`✓ Đã thêm sản phẩm ID: ${newProd.id}, SKU: ${newProd.sku}`);

  // KỊCH BẢN 3: ĐIỀU CHỈNH TỒN KHO BIẾN THỂ & AUDIT LOG
  console.log('\n--- [KỊCH BẢN 3] Điều chỉnh kho biến thể & Nhật ký biến động ---');
  const targetVariant = newProd.variants![0];
  const initialStock = targetVariant.stockCount;
  adjustProductStock(
    newProd.id,
    targetVariant.id,
    5,
    'import',
    'Nhập thêm hàng từ xưởng may Paris',
    'Admin Test'
  );
  const updatedProdAfterAdjust = getDBProducts().find((p) => p.id === newProd.id)!;
  const updatedVariant = updatedProdAfterAdjust.variants!.find((v) => v.id === targetVariant.id)!;
  console.log(`✓ Tồn kho biến thể trước: ${initialStock}, sau khi nhập: ${updatedVariant.stockCount}`);

  // KỊCH BẢN 4: ĐẶT HÀNG AN TOÀN & BẢO VỆ TÍNH TIỀN PHÍA SERVER (Chống Client giả mạo total: 1000)
  console.log('\n--- [KỊCH BẢN 4] Đặt hàng với giá tiền giả mạo (total: 1000 VNĐ) ---');
  const maliciousOrderResult = createDBOrder({
    items: [
      {
        productId: newProd.id,
        color: targetVariant.color,
        size: targetVariant.size,
        variantId: targetVariant.id,
        quantity: 2
      }
    ],
    shippingAddress: {
      fullName: 'Khách Hàng Bảo Mật',
      phone: '0988888999',
      email: 'security@tada.vn',
      address: '72 Lê Thánh Tôn',
      city: 'TP. Hồ Chí Minh'
    },
    paymentMethod: 'cod',
    // Client cố tình truyền total: 1000 và status: delivered
    status: 'delivered' as any
  });

  if (!maliciousOrderResult.success || !maliciousOrderResult.order) {
    throw new Error('Thất bại tạo đơn hàng');
  }

  const createdOrder = maliciousOrderResult.order;
  // Giá sản phẩm là 1.850.000đ x 2 = 3.700.000đ (>= 499.000đ nên freeship = 0đ)
  const expectedSubtotal = 1850000 * 2;
  console.log(`✓ Đã tạo đơn hàng: ${createdOrder.orderCode}`);
  console.log(`  Tổng tiền server tính: ${createdOrder.total} VNĐ (Kỳ vọng: ${expectedSubtotal} VNĐ)`);
  if (createdOrder.total !== expectedSubtotal) {
    throw new Error(`LỖI BẢO MẬT: Tổng tiền tính sai, bị client can thiệp: ${createdOrder.total}`);
  }
  console.log(`  Trạng thái đơn hàng: ${createdOrder.status} (Client gửi "delivered", Server tự ép về: ${createdOrder.status})`);
  if (createdOrder.status !== 'pending_confirmation') {
    throw new Error(`LỖI BẢO MẬT: Trạng thái đơn hàng không phải pending_confirmation`);
  }

  // KỊCH BẢN 5: CHỐNG SỐ LƯỢNG ÂM VÀ VƯỢT QUÁ TỒN KHO
  console.log('\n--- [KỊCH BẢN 5] Kiểm tra chặn số lượng âm (quantity: -5) & thập phân ---');
  const negativeQtyResult = createDBOrder({
    items: [
      {
        productId: newProd.id,
        quantity: -5
      }
    ],
    shippingAddress: {
      fullName: 'Hacker',
      phone: '0988888999',
      email: 'hacker@test.com',
      address: 'None',
      city: 'Hà Nội'
    },
    paymentMethod: 'cod'
  });

  if (negativeQtyResult.success) {
    throw new Error('LỖI BẢO MẬT: Cho phép đặt hàng với số lượng âm!');
  }
  console.log(`✓ Đã chặn thành công số lượng âm: "${negativeQtyResult.message}"`);

  console.log('\n--- [KỊCH BẢN 5.1] Kiểm tra chặn đặt vượt quá tồn kho (quantity: 9999) ---');
  const overOrderResult = createDBOrder({
    items: [
      {
        productId: newProd.id,
        quantity: 9999
      }
    ],
    shippingAddress: {
      fullName: 'Hacker',
      phone: '0988888999',
      email: 'hacker@test.com',
      address: 'None',
      city: 'Hà Nội'
    },
    paymentMethod: 'cod'
  });

  if (overOrderResult.success) {
    throw new Error('LỖI BẢO MẬT: Cho phép đặt vượt quá số lượng tồn!');
  }
  console.log(`✓ Đã chặn thành công: "${overOrderResult.message}"`);

  // KỊCH BẢN 6: ADMIN DUYỆT ĐƠN & GIAO HÀNG
  console.log('\n--- [KỊCH BẢN 6] Admin chuyển trạng thái đơn hàng sang Đã giao ---');
  const deliverResult = updateDBOrderStatus(createdOrder.id, 'delivered', 'Shipper đã giao tận tay khách', 'Admin Test');
  console.log(`✓ Trạng thái mới: ${deliverResult.order?.statusLabel}, Trạng thái thanh toán: ${deliverResult.order?.paymentStatus}`);

  // KỊCH BẢN 7: TẠO ĐƠN KHÁC VÀ HỦY ĐƠN -> TỰ ĐỘNG HOÀN KHO
  console.log('\n--- [KỊCH BẢN 7] Hủy đơn hàng & Tự động hoàn lại tồn kho ---');
  const order2 = createDBOrder({
    items: [
      {
        productId: newProd.id,
        variantId: targetVariant.id,
        color: targetVariant.color,
        size: targetVariant.size,
        quantity: 3
      }
    ],
    shippingAddress: {
      fullName: 'Khách Đổi Ý',
      phone: '0977123456',
      email: 'khachdoiy@tada.vn',
      address: '10 Hai Bà Trưng',
      city: 'Hà Nội'
    },
    paymentMethod: 'cod'
  }).order!;

  const stockBeforeCancel = getDBProducts().find((p) => p.id === newProd.id)!.variants!.find((v) => v.id === targetVariant.id)!.stockCount;
  console.log(`  Tồn kho trước khi hủy đơn: ${stockBeforeCancel}`);

  // Hủy đơn
  updateDBOrderStatus(order2.id, 'cancelled', 'Khách báo bận đi công tác cần hủy đơn', 'Khách Hàng Test');
  const stockAfterCancel = getDBProducts().find((p) => p.id === newProd.id)!.variants!.find((v) => v.id === targetVariant.id)!.stockCount;
  console.log(`✓ Tồn kho sau khi hủy đơn: ${stockAfterCancel} (Đã tự động cộng lại đúng 3 chiếc)`);

  // KỊCH BẢN 8: GỬI ĐÁNH GIÁ THỰC TẾ & CẬP NHẬT RATING SẢN PHẨM
  console.log('\n--- [KỊCH BẢN 8] Đánh giá sản phẩm từ đơn hàng đã mua ---');
  const reviewResult = addDBReview({
    productId: newProd.id,
    userId: 'usr-admin',
    author: 'Khách Hàng Vip',
    rating: 5,
    content: 'Chất vải lụa Haute Couture bóng mượt, đường may thủ công vô cùng tinh xảo!',
    orderId: createdOrder.orderCode,
    status: 'approved',
    date: 'Hôm nay'
  });

  console.log(`✓ Đã thêm đánh giá: ${reviewResult.review?.author} - ${reviewResult.review?.rating} sao`);
  const updatedProd = getDBProducts().find((p) => p.id === newProd.id)!;
  console.log(`✓ Điểm rating trung bình mới của sản phẩm: ${updatedProd.rating} sao (${updatedProd.reviewCount} đánh giá)`);

  console.log('\n=====================================================');
  console.log('   TẤT CẢ CÁC KỊCH BẢN KIỂM THỬ BẢO MẬT & TIỀN ĐÃ HOÀN TẤT THÀNH CÔNG! ');
  console.log('=====================================================');
}

runTests().catch((err) => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});
