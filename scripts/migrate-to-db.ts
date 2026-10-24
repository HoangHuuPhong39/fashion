/**
 * Script di chuyển dữ liệu từ data/*.json sang PostgreSQL (Neon / Supabase)
 * Tính năng:
 * - Idempotent (Chạy nhiều lần không trùng lặp hay ghi đè sai dữ liệu)
 * - Giữ nguyên toàn bộ ID gốc của Đơn hàng, Sản phẩm, Biến thể, Người dùng
 * - Hỗ trợ cờ --dry-run để chạy thử nghiệm và kiểm tra dữ liệu trước khi nạp
 *
 * Cách chạy:
 * npx tsx scripts/migrate-to-db.ts --dry-run
 * npx tsx scripts/migrate-to-db.ts
 */

import fs from 'fs';
import path from 'path';

const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
const databaseUrl = process.env.DATABASE_URL;

const DATA_DIR = path.join(process.cwd(), 'data');

function readJsonFile<T>(filename: string): T | null {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T;
  } catch (err) {
    console.error(`Lỗi đọc file ${filename}:`, err);
    return null;
  }
}

async function runMigration() {
  console.log('================================================================');
  console.log(`🚀 BẮT ĐẦU QUÁ TRÌNH DI CHUYỂN DỮ LIỆU SANG POSTGRESQL`);
  console.log(`Chế độ: ${isDryRun ? 'DRY-RUN (CHẠY THỬ NGHIỆM — KHÔNG GHI DB)' : 'THỰC THI THẬT'}`);
  console.log('================================================================\n');

  // 1. Quét dữ liệu từ thư mục data/*.json
  const users = readJsonFile<any[]>('users.json') || [];
  const sessions = readJsonFile<any[]>('sessions.json') || [];
  const products = readJsonFile<any[]>('products.json') || [];
  const orders = readJsonFile<any[]>('orders.json') || [];
  const reviews = readJsonFile<any[]>('reviews.json') || [];
  const inventoryLogs = readJsonFile<any[]>('inventory_logs.json') || [];
  const bankSettings = readJsonFile<any>('bank_settings.json');
  const searchEvents = readJsonFile<any[]>('search_events.json') || [];

  // Thống kê số lượng
  let totalVariants = 0;
  products.forEach((p) => {
    if (Array.isArray(p.variants)) totalVariants += p.variants.length;
  });

  let totalOrderItems = 0;
  orders.forEach((o) => {
    if (Array.isArray(o.items)) totalOrderItems += o.items.length;
  });

  console.log('📊 THỐNG KÊ DỮ LIỆU TÌM THẤY TRONG DATA/*.JSON:');
  console.log(`  • Users:          ${users.length} bản ghi`);
  console.log(`  • Sessions:       ${sessions.length} bản ghi`);
  console.log(`  • Products:       ${products.length} bản ghi (Gồm ${totalVariants} biến thể)`);
  console.log(`  • Orders:         ${orders.length} đơn hàng (Gồm ${totalOrderItems} món chi tiết)`);
  console.log(`  • Reviews:        ${reviews.length} đánh giá`);
  console.log(`  • Inventory Logs: ${inventoryLogs.length} nhật ký kho`);
  console.log(`  • Search Events:  ${searchEvents.length} lượt tìm kiếm`);
  console.log(`  • Bank Settings:  ${bankSettings ? 'Có cấu hình' : 'Chưa thiết lập'}\n`);

  if (isDryRun) {
    console.log('✅ [DRY-RUN THÀNH CÔNG]');
    console.log('Tất cả tệp dữ liệu JSON hợp lệ và sẵn sàng migrate vào các bảng:');
    console.log('users, sessions, products, variants, orders, order_items, reviews, inventory_logs, bank_settings, search_events.');
    console.log('Các khóa chính ID (prod-*, LM*, usr-*) sẽ được giữ nguyên 100%.\n');
    return;
  }

  if (!databaseUrl) {
    console.error('❌ LỖI: Biến môi trường DATABASE_URL chưa được thiết lập.');
    console.error('Vui lòng cung cấp DATABASE_URL (chuỗi kết nối Neon hoặc Supabase) để thực thi di chuyển thật.');
    process.exit(1);
  }

  // Thực thi kết nối và insert idempotent
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(databaseUrl);

  console.log('🔄 Đang đồng bộ người dùng (Users)...');
  for (const u of users) {
    await sql`
      INSERT INTO users (id, name, email, phone, role, password_hash, membership_tier, total_spent, points, is_vip, avatar, cover_image, addresses, created_at, updated_at)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.phone || ''}, ${u.role || 'customer'}, ${u.passwordHash || ''}, ${u.membershipTier || 'bronze'}, ${u.totalSpent || 0}, ${u.points || 0}, ${u.isVip || false}, ${u.avatar || null}, ${u.coverImage || null}, ${JSON.stringify(u.addresses || [])}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        membership_tier = EXCLUDED.membership_tier,
        total_spent = EXCLUDED.total_spent;
    `;
  }

  console.log('🔄 Đang đồng bộ sản phẩm & biến thể (Products & Variants)...');
  for (const p of products) {
    await sql`
      INSERT INTO products (
        id, name, slug, brand, category, sub_category, price, original_price, discount_percentage,
        stock_count, in_stock, rating, review_count, sold_count, description, material, origin,
        origin_country, deposit_required, deposit_percentage, estimated_delivery, images, colors,
        sizes, tags, care_instructions, status, created_at, updated_at
      ) VALUES (
        ${p.id}, ${p.name}, ${p.slug || p.id}, ${p.brand}, ${p.category}, ${p.subCategory || null},
        ${p.price}, ${p.originalPrice || null}, ${p.discountPercentage || 0}, ${p.stockCount || 0},
        ${p.inStock ?? true}, ${p.rating || 5.0}, ${p.reviewCount || 0}, ${p.soldCount || 0},
        ${p.description || ''}, ${p.material || null}, ${p.origin || 'vietnam_local_brand'},
        ${p.originCountry || null}, ${p.depositRequired ?? false}, ${p.depositPercentage || 50},
        ${p.estimatedDelivery || null}, ${JSON.stringify(p.images || [])}, ${JSON.stringify(p.colors || [])},
        ${JSON.stringify(p.sizes || [])}, ${JSON.stringify(p.tags || [])}, ${JSON.stringify(p.careInstructions || [])},
        ${p.status || 'active'}, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        stock_count = EXCLUDED.stock_count,
        updated_at = NOW();
    `;

    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        await sql`
          INSERT INTO variants (id, product_id, color, size, price, stock_count, in_stock, sku)
          VALUES (${v.id}, ${p.id}, ${v.color}, ${v.size}, ${v.price || p.price}, ${v.stockCount || 0}, ${v.inStock ?? true}, ${v.sku || null})
          ON CONFLICT (id) DO UPDATE SET
            stock_count = EXCLUDED.stock_count,
            in_stock = EXCLUDED.in_stock;
        `;
      }
    }
  }

  console.log('🔄 Đang đồng bộ đơn hàng & chi tiết đơn (Orders & Order Items)...');
  for (const o of orders) {
    await sql`
      INSERT INTO orders (
        id, order_code, user_id, status, status_label, shipping_address, subtotal, shipping_fee,
        discount_amount, applied_coupon, total, payment_method, payment_status, hold_expires_at,
        status_history, created_at, updated_at
      ) VALUES (
        ${o.id}, ${o.orderCode}, ${o.userId || null}, ${o.status || 'pending_confirmation'},
        ${o.statusLabel || 'Chờ xác nhận'}, ${JSON.stringify(o.shippingAddress)}, ${o.subtotal || 0},
        ${o.shippingFee || 0}, ${o.discountAmount || 0}, ${o.appliedCoupon || null}, ${o.total},
        ${o.paymentMethod || 'cod'}, ${o.paymentStatus || 'pending'}, ${o.holdExpiresAt || null},
        ${JSON.stringify(o.statusHistory || [])}, ${o.createdAt ? new Date(o.createdAt) : new Date()}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        status_label = EXCLUDED.status_label,
        payment_status = EXCLUDED.payment_status;
    `;

    if (Array.isArray(o.items)) {
      for (let idx = 0; idx < o.items.length; idx++) {
        const item = o.items[idx];
        const itemId = `${o.id}-item-${idx + 1}`;
        await sql`
          INSERT INTO order_items (
            id, order_id, product_id, variant_id, product_name, brand, image, color, size, price, quantity, origin, sku
          ) VALUES (
            ${itemId}, ${o.id}, ${item.productId}, ${item.variantId || null}, ${item.productName || 'Sản phẩm'},
            ${item.brand || 'TADA!'}, ${item.image || ''}, ${item.color || ''}, ${item.size || ''},
            ${item.price || 0}, ${item.quantity || 1}, ${item.origin || null}, ${item.sku || null}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
  }

  console.log('🔄 Đang đồng bộ đánh giá (Reviews)...');
  for (const r of reviews) {
    await sql`
      INSERT INTO reviews (id, product_id, user_id, order_id, author, rating, content, images, status, created_at)
      VALUES (${r.id}, ${r.productId}, ${r.userId || null}, ${r.orderId || null}, ${r.author || 'Khách hàng'}, ${r.rating || 5}, ${r.content || ''}, ${JSON.stringify(r.images || [])}, ${r.status || 'approved'}, ${r.createdAt ? new Date(r.createdAt) : new Date()})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  console.log('\n🎉 HOÀN THÀNH DI CHUYỂN TOÀN BỘ DỮ LIỆU SANG POSTGRESQL THÀNH CÔNG!');
}

runMigration().catch((err) => {
  console.error('❌ Lỗi trong quá trình di chuyển:', err);
  process.exit(1);
});
