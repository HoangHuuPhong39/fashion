export type ProductOrigin = 'international_order' | 'vietnam_local_brand' | 'in_stock_ready';

export type ProductBadge = 'ORDER QUỐC TẾ' | 'LOCAL BRAND' | 'HÀNG CÓ SẴN' | 'PREMIUM' | 'LIMITED';

export type ProductStatus = 'active' | 'hidden' | 'discontinued';

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex?: string;
  size: string;
  stockCount: number;
  price?: number;
  originalPrice?: number;
  inStock: boolean;
  image?: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantDesc?: string;
  type: 'import' | 'manual_adjust' | 'order_deduct' | 'order_cancel_return';
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  reason: string;
  performedBy: string;
  orderId?: string;
  createdAt: string;
}

export type ProductTag = 'new' | 'bestseller' | 'trending' | 'sale' | 'featured' | 'order';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  barcode?: string;
  brand: string;
  origin: ProductOrigin;
  originCountry?: string; // e.g. "Pháp", "Hàn Quốc", "Ý", "Việt Nam"
  badges: ProductBadge[];
  category: string;
  subCategory?: string;
  categoryId?: string; // ID / slug danh mục cha
  subCategoryId?: string; // ID / slug danh mục con
  additionalCategoryIds?: string[];
  tags?: ProductTag[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  costPrice?: number; // Giá vốn dành cho Admin
  saleStartDate?: string;
  saleEndDate?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  status?: ProductStatus;
  variants?: ProductVariant[];
  estimatedDelivery: string; // e.g. "Hỏa tốc 2-4h (Nội thành HCM)" hoặc "Dự kiến 7-12 ngày (Order Hàn Quốc)"
  depositRequired?: boolean;
  depositPercentage?: number; // e.g. 50% cho hàng order
  images: string[];
  coverImageIndex?: number;
  colors: {
    name: string;
    hex: string;
    image?: string;
  }[];
  sizes: string[];
  shortDescription?: string;
  description: string;
  material: string;
  careInstructions: string[];
  style?: string; // Form áo / dáng: Regular, Oversize, Slim fit...
  pattern?: string; // Họa tiết: Trơn, Kẻ sọc, Caro, Hoa văn...
  gender?: 'nu' | 'nam' | 'unisex' | 'tre-em';
  season?: 'xuan-he' | 'thu-dong' | 'bon-mua';
  fashionStyle?: string; // Phong cách: Quiet Luxury, Minimalist, Thanh lịch công sở, Vintage...
  sizeChartUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  viewsCount?: number;
  salesCount?: number;
  searchCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  description?: string;
  parentId?: string | null; // null nếu là danh mục cha (Nữ, Nam, Trẻ em, Đồ bộ, Phụ kiện)
  order?: number;
  isActive?: boolean;
  displayOnHome?: boolean;
  count?: number;
  subcategories?: Category[];
}

export interface SearchEvent {
  id: string;
  query: string;
  normalizedQuery: string;
  categoryFilter?: string;
  resultsCount: number;
  userId?: string;
  ipHash?: string;
  createdAt: string;
}

export interface ProductViewEvent {
  id: string;
  productId: string;
  userId?: string;
  ipHash?: string;
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  badge?: string;
}

export interface Review {
  id: string;
  productId?: string;
  userId?: string;
  author: string;
  rating: number;
  content: string;
  date?: string;
  avatar?: string;
  images?: string[];
  orderId?: string;
  status?: 'approved' | 'pending' | 'hidden';
  createdAt?: string;
}

export interface VIPBenefit {
  tier: string;
  minSpend: number;
  benefits: string[];
}

export interface CampaignBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  link: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  isLocalBrand: boolean;
  country: string;
  foundedYear?: number;
  story: string;
  aesthetic: string;
  logo: string;
  bannerImage: string;
}

export interface CartItem {
  id: string; // unique item id = productId-color-size
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  variantId?: string;
  sku?: string;
}

export type OrderStatus =
  | 'pending_confirmation' // Chờ xác nhận
  | 'confirmed'            // Đã xác nhận
  | 'preparing'            // Đang chuẩn bị
  | 'shipping'             // Đang vận chuyển
  | 'delivered'            // Đã giao
  | 'cancelled'            // Đã hủy
  | 'return_processing';   // Đang xử lý đổi trả

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  statusLabel: string;
  changedAt: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  origin: ProductOrigin;
  estimatedDelivery?: string;
  variantId?: string;
  sku?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'vietqr' | 'credit_card';

export interface Order {
  id: string;
  orderCode: string;
  userId?: string;
  createdAt: string;
  status: OrderStatus;
  statusLabel: string;
  statusHistory?: OrderStatusHistoryItem[];
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedCoupon?: string;
  total: number;
  depositAmount?: number;
  remainingAmount?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
  trackingNumber?: string;
  carrier?: string;
  holdExpiresAt?: string;
  updatedAt?: string;
}

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type UserRole = 'customer' | 'admin';

export interface LoyaltyTierDetails {
  tier: MembershipTier;
  name: string;
  badge: string;
  minSpent: number;
  minOrders: number;
  discountPercent: number;
  colorScheme: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    gradient: string;
  };
  benefits: string[];
  gifts: string[];
}

export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  qrCodeUrl?: string;
  hotline?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  role: UserRole;
  membershipTier: MembershipTier;
  totalSpent: number;
  points: number;
  isVip: boolean;
  addresses: ShippingAddress[];
  bankInfo?: BankAccountInfo;
  emailVerified?: boolean;
}

// Bảng liên hệ / tin nhắn khách hàng gửi
export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipHash?: string;
  createdAt: string;
}

// Bảng hướng dẫn chọn size
export interface SizeMeasurement {
  size: string; // XS, S, M, L, XL...
  bust?: string; // Vòng ngực (cm)
  waist?: string; // Vòng eo (cm)
  hips?: string; // Vòng mông (cm)
  length?: string; // Chiều dài trang phục (cm)
  weightRange?: string; // Cân nặng phù hợp (kg)
  heightRange?: string; // Chiều cao phù hợp (cm)
}

export interface SizeGuide {
  id: string;
  categoryId?: string; // Áp dụng cho danh mục nào (ao-so-mi, dam-vay...)
  productId?: string; // Hoặc riêng biệt cho 1 sản phẩm bespoke
  title: string;
  measurements: SizeMeasurement[];
  fitTips?: string; // Lời khuyên phom dáng (ôm sát, vừa vặn, rộng rãi)
  modelStats?: string; // Số đo người mẫu mặc mẫu (Cao 1m75, nặng 50kg, mặc size S)
  updatedAt: string;
}

// Webhook thanh toán VietQR (SePay / Casso)
export interface PaymentTransactionRecord {
  id: string;
  transactionId: string; // ID từ bên cung cấp dịch vụ ngân hàng
  provider: 'sepay' | 'casso' | 'manual';
  orderId?: string;
  orderCode?: string;
  amount: number;
  content: string; // Nội dung chuyển khoản
  gateway?: string; // Tên ngân hàng nhận (MBBank, Vietcombank...)
  accountNumber?: string;
  status: 'success' | 'partial' | 'unmatched';
  createdAt: string;
  rawData?: any;
}

// Đăng ký nhận thông báo khi có hàng lại (Back-in-stock)
export interface StockNotification {
  id: string;
  productId: string;
  productName?: string;
  color?: string;
  size?: string;
  email: string;
  status: 'pending' | 'sent';
  sentAt?: string;
  createdAt: string;
}

// Dịch vụ Concierge (May đo Bespoke & Order Quốc Tế)
export type ConciergeStatus =
  | 'received'
  | 'quoted'
  | 'deposit_paid'
  | 'purchased'
  | 'shipping_international'
  | 'in_warehouse'
  | 'delivered'
  | 'cancelled';

export interface ConciergeRequest {
  id: string;
  code: string; // CR-xxxx
  customerName: string;
  phone: string;
  email: string;
  serviceType: 'bespoke_tailoring' | 'international_order';
  productLink?: string;
  productName: string;
  images?: string[];
  size?: string;
  color?: string;
  notes?: string;
  budgetVND?: number;
  quotedPrice?: number;
  depositAmount?: number;
  status: ConciergeStatus;
  statusHistory: {
    status: ConciergeStatus;
    label: string;
    note?: string;
    changedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}


