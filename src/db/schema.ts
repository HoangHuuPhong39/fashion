import { pgTable, varchar, integer, real, boolean, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. BẢNG USERS
export const users = pgTable('users', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 32 }).notNull(),
  role: varchar('role', { length: 32 }).notNull().default('customer'),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  membershipTier: varchar('membership_tier', { length: 32 }).notNull().default('bronze'),
  totalSpent: integer('total_spent').notNull().default(0),
  points: integer('points').notNull().default(0),
  isVip: boolean('is_vip').notNull().default(false),
  avatar: text('avatar'),
  coverImage: text('cover_image'),
  addresses: jsonb('addresses'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 2. BẢNG SESSIONS
export const sessions = pgTable('sessions', {
  tokenHash: varchar('token_hash', { length: 128 }).primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 32 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull()
});

// 3. BẢNG PRODUCTS
export const products = pgTable('products', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 128 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  subCategory: varchar('sub_category', { length: 64 }),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  discountPercentage: integer('discount_percentage').default(0),
  stockCount: integer('stock_count').notNull().default(0),
  inStock: boolean('in_stock').notNull().default(true),
  rating: real('rating').notNull().default(5.0),
  reviewCount: integer('review_count').notNull().default(0),
  soldCount: integer('sold_count').notNull().default(0),
  description: text('description').notNull(),
  material: text('material'),
  origin: varchar('origin', { length: 64 }).notNull().default('vietnam_local_brand'),
  originCountry: varchar('origin_country', { length: 64 }),
  depositRequired: boolean('deposit_required').default(false),
  depositPercentage: integer('deposit_percentage').default(50),
  estimatedDelivery: varchar('estimated_delivery', { length: 128 }),
  images: jsonb('images').$type<string[]>(),
  colors: jsonb('colors').$type<Array<{ name: string; hex: string; image?: string }>>(),
  sizes: jsonb('sizes').$type<string[]>(),
  tags: jsonb('tags').$type<string[]>(),
  careInstructions: jsonb('care_instructions').$type<string[]>(),
  status: varchar('status', { length: 32 }).notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 4. BẢNG VARIANTS
export const variants = pgTable('variants', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  color: varchar('color', { length: 64 }).notNull(),
  size: varchar('size', { length: 32 }).notNull(),
  price: integer('price'),
  stockCount: integer('stock_count').notNull().default(0),
  inStock: boolean('in_stock').notNull().default(true),
  sku: varchar('sku', { length: 128 })
});

// 5. BẢNG ORDERS
export const orders = pgTable('orders', {
  id: varchar('id', { length: 64 }).primaryKey(),
  orderCode: varchar('order_code', { length: 64 }).notNull().unique(),
  userId: varchar('user_id', { length: 64 }),
  status: varchar('status', { length: 64 }).notNull().default('pending_confirmation'),
  statusLabel: varchar('status_label', { length: 128 }).notNull().default('Chờ xác nhận'),
  shippingAddress: jsonb('shipping_address').notNull(),
  subtotal: integer('subtotal').notNull(),
  shippingFee: integer('shipping_fee').notNull().default(0),
  discountAmount: integer('discount_amount').notNull().default(0),
  appliedCoupon: varchar('applied_coupon', { length: 64 }),
  total: integer('total').notNull(),
  paymentMethod: varchar('payment_method', { length: 32 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 32 }).notNull().default('pending'),
  holdExpiresAt: timestamp('hold_expires_at'),
  statusHistory: jsonb('status_history'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 6. BẢNG ORDER_ITEMS
export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 64 }).primaryKey(),
  orderId: varchar('order_id', { length: 64 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 64 }).notNull(),
  variantId: varchar('variant_id', { length: 64 }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 128 }).notNull(),
  image: text('image').notNull(),
  color: varchar('color', { length: 64 }).notNull(),
  size: varchar('size', { length: 32 }).notNull(),
  price: integer('price').notNull(),
  quantity: integer('quantity').notNull(),
  origin: varchar('origin', { length: 64 }),
  sku: varchar('sku', { length: 128 })
});

// 7. BẢNG REVIEWS
export const reviews = pgTable('reviews', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 64 }),
  orderId: varchar('order_id', { length: 64 }),
  author: varchar('author', { length: 128 }).notNull(),
  rating: real('rating').notNull(),
  content: text('content').notNull(),
  images: jsonb('images').$type<string[]>(),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 8. BẢNG INVENTORY_LOGS
export const inventoryLogs = pgTable('inventory_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).notNull(),
  variantId: varchar('variant_id', { length: 64 }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantDesc: varchar('variant_desc', { length: 128 }).notNull(),
  change: integer('change').notNull(),
  qtyBefore: integer('qty_before').notNull(),
  qtyAfter: integer('qty_after').notNull(),
  type: varchar('type', { length: 64 }).notNull(),
  reason: text('reason').notNull(),
  performedBy: varchar('performed_by', { length: 128 }).notNull().default('System'),
  orderId: varchar('order_id', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 9. BẢNG BANK_SETTINGS
export const bankSettings = pgTable('bank_settings', {
  id: varchar('id', { length: 64 }).primaryKey().default('primary'),
  bankName: varchar('bank_name', { length: 64 }).notNull(),
  accountNumber: varchar('account_number', { length: 64 }).notNull(),
  accountHolder: varchar('account_holder', { length: 128 }).notNull(),
  branch: varchar('branch', { length: 128 }),
  hotline: varchar('hotline', { length: 32 }),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 10. BẢNG SEARCH_EVENTS
export const searchEvents = pgTable('search_events', {
  id: varchar('id', { length: 64 }).primaryKey(),
  query: varchar('query', { length: 255 }).notNull(),
  resultsCount: integer('results_count').notNull().default(0),
  userId: varchar('user_id', { length: 64 }),
  ipHash: varchar('ip_hash', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 11. BẢNG PRODUCT_VIEWS
export const productViews = pgTable('product_views', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).notNull(),
  userId: varchar('user_id', { length: 64 }),
  ipHash: varchar('ip_hash', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 12. BẢNG CONTACT_MESSAGES (Tin nhắn liên hệ khách hàng)
export const contactMessages = pgTable('contact_messages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  fullName: varchar('full_name', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 32 }).notNull().default('new'),
  ipHash: varchar('ip_hash', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 13. BẢNG SIZE_GUIDES (Hướng dẫn thông số chọn size)
export const sizeGuides = pgTable('size_guides', {
  id: varchar('id', { length: 64 }).primaryKey(),
  categoryId: varchar('category_id', { length: 64 }),
  productId: varchar('product_id', { length: 64 }),
  title: varchar('title', { length: 255 }).notNull(),
  measurementsJson: jsonb('measurements_json').notNull(),
  fitTips: text('fit_tips'),
  modelStats: varchar('model_stats', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 14. BẢNG PASSWORD_RESET_TOKENS (Mã đặt lại mật khẩu)
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: varchar('id', { length: 64 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 15. BẢNG EMAIL_VERIFICATION_TOKENS (Mã xác minh email tài khoản)
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 16. BẢNG PAYMENT_TRANSACTIONS (Lịch sử giao dịch webhook VietQR)
export const paymentTransactions = pgTable('payment_transactions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  transactionId: varchar('transaction_id', { length: 128 }).notNull().unique(),
  provider: varchar('provider', { length: 32 }).notNull().default('sepay'),
  orderId: varchar('order_id', { length: 64 }),
  orderCode: varchar('order_code', { length: 64 }),
  amount: integer('amount').notNull(),
  content: text('content').notNull(),
  gateway: varchar('gateway', { length: 64 }),
  accountNumber: varchar('account_number', { length: 64 }),
  status: varchar('status', { length: 32 }).notNull().default('success'),
  rawData: jsonb('raw_data'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 17. BẢNG CONCIERGE_REQUESTS (Yêu cầu đặt may / order quốc tế)
export const conciergeRequests = pgTable('concierge_requests', {
  id: varchar('id', { length: 64 }).primaryKey(),
  requestCode: varchar('request_code', { length: 64 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 32 }).notNull(),
  productLink: text('product_link'),
  imagesJson: jsonb('images_json'),
  size: varchar('size', { length: 64 }),
  color: varchar('color', { length: 64 }),
  budget: integer('budget'),
  notes: text('notes'),
  status: varchar('status', { length: 32 }).notNull().default('received'),
  quoteAmount: integer('quote_amount'),
  depositAmount: integer('deposit_amount'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// 18. BẢNG STOCK_NOTIFICATIONS (Đăng ký báo khi có hàng)
export const stockNotifications = pgTable('stock_notifications', {
  id: varchar('id', { length: 64 }).primaryKey(),
  productId: varchar('product_id', { length: 64 }).notNull(),
  variantId: varchar('variant_id', { length: 64 }),
  email: varchar('email', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// 19. BẢNG ADMIN_AUDIT_LOGS (Nhật ký thao tác quản trị bất biến)
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  action: varchar('action', { length: 64 }).notNull(),
  targetType: varchar('target_type', { length: 64 }).notNull(),
  targetId: varchar('target_id', { length: 64 }).notNull(),
  beforeValue: jsonb('before_value'),
  afterValue: jsonb('after_value'),
  ipHash: varchar('ip_hash', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  orders: many(orders),
  reviews: many(reviews)
}));

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
  reviews: many(reviews),
  orderItems: many(orderItems)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  })
}));
