import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  ProductVariant,
  InventoryLog,
  Order,
  Review,
  User,
  OrderStatus,
  Category,
  SearchEvent,
  ProductViewEvent,
  ProductTag,
  OrderItem,
  PaymentMethod
} from '@/types';
import { PRODUCTS as DEFAULT_PRODUCTS, MOCK_ORDERS } from '@/data/mockData';
import { getAllUsers, findUserById } from '@/lib/auth';
import { calculateOrderPricing } from '@/lib/pricing';

const DATA_DIR = path.join(process.cwd(), 'data');

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INVENTORY_LOGS_FILE = path.join(DATA_DIR, 'inventory_logs.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const SEARCH_EVENTS_FILE = path.join(DATA_DIR, 'search_events.json');
const PRODUCT_VIEWS_FILE = path.join(DATA_DIR, 'product_views.json');

function ensureDirectoryExistence() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// In-memory cache to eliminate repetitive synchronous disk reads and JSON parsing
interface CacheEntry<T> {
  data: T;
  mtimeMs: number;
}
const memoryCache = new Map<string, CacheEntry<unknown>>();

function readJSON<T>(filePath: string, defaultData: T): T {
  ensureDirectoryExistence();
  if (!fs.existsSync(filePath)) {
    writeJSON(filePath, defaultData);
    return defaultData;
  }
  try {
    const stats = fs.statSync(filePath);
    const cached = memoryCache.get(filePath);
    if (cached && cached.mtimeMs === stats.mtimeMs) {
      return cached.data as T;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    memoryCache.set(filePath, { data: parsed, mtimeMs: stats.mtimeMs });
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filePath}, fallback to default`, err);
    return defaultData;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  ensureDirectoryExistence();
  const tmpFile = `${filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, filePath);
    try {
      const stats = fs.statSync(filePath);
      memoryCache.set(filePath, { data, mtimeMs: stats.mtimeMs });
    } catch {}
  } catch (err) {
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
    console.error(`Error writing to ${filePath}`, err);
  }
}

// Khởi tạo sản phẩm có biến thể chuẩn xác
function generateInitialProducts(): Product[] {
  return DEFAULT_PRODUCTS.map((p, idx) => {
    const cleanId = p.id || `prod-${idx + 1}`;
    const baseSku = `TADA-${p.category.toUpperCase().slice(0, 3)}-${String(idx + 1).padStart(3, '0')}`;
    
    // Khởi tạo các biến thể Size x Màu
    const variants: ProductVariant[] = [];
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'];
    const colors = p.colors && p.colors.length > 0 ? p.colors : [{ name: 'Tiêu chuẩn', hex: '#171613' }];

    const totalStock = p.stockCount && p.stockCount > 0 ? p.stockCount : 15;
    const variantCount = sizes.length * colors.length;
    const baseVariantStock = Math.max(1, Math.floor(totalStock / variantCount));
    let remainingStock = totalStock;

    colors.forEach((c, cIdx) => {
      sizes.forEach((s, sIdx) => {
        const isLast = (cIdx === colors.length - 1) && (sIdx === sizes.length - 1);
        const stock = isLast ? remainingStock : Math.min(remainingStock, baseVariantStock);
        remainingStock = Math.max(0, remainingStock - stock);

        const vSku = `${baseSku}-${c.name.slice(0, 2).toUpperCase()}-${s}`;
        variants.push({
          id: `var-${cleanId}-${cIdx}-${sIdx}`,
          sku: vSku,
          color: c.name,
          colorHex: c.hex,
          size: s,
          stockCount: stock,
          price: p.price,
          originalPrice: p.originalPrice || p.price,
          inStock: stock > 0,
          image: p.images[0]
        });
      });
    });

    const sumStock = variants.reduce((acc, v) => acc + v.stockCount, 0);

    return {
      ...p,
      id: cleanId,
      sku: baseSku,
      status: 'active',
      stockCount: sumStock,
      inStock: sumStock > 0,
      variants,
      updatedAt: new Date().toISOString()
    };
  });
}

// Khởi tạo Nhật ký kho ban đầu
function generateInitialInventoryLogs(products: Product[]): InventoryLog[] {
  return products.slice(0, 8).map((p, idx) => ({
    id: `log-init-${idx + 1}`,
    productId: p.id,
    productName: p.name,
    type: 'import',
    quantityBefore: 0,
    quantityChange: p.stockCount,
    quantityAfter: p.stockCount,
    reason: 'Nhập kho lô đầu tiên mở bán BST TADA!',
    performedBy: 'Hệ thống (Admin)',
    createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString()
  }));
}

// Khởi tạo Review ban đầu
function generateInitialReviews(products: Product[]): Review[] {
  const reviews: Review[] = [];
  const demoTexts = [
    { author: 'Trần Minh Anh', rating: 5, content: 'Chất vải xuất sắc vượt mong đợi, form dáng lên cực chuẩn! Sẽ tiếp tục ủng hộ TADA!' },
    { author: 'Nguyễn Lê Hoàng Yến', rating: 5, content: 'Đóng gói hộp rất sang trọng, giao hàng hỏa tốc trong 2 tiếng đúng hẹn.' },
    { author: 'Lê Thùy Chi', rating: 4, content: 'Áo đẹp, đường may tinh xảo. Size M vừa vặn người cao 1m62 nặng 49kg.' }
  ];

  products.slice(0, 5).forEach((p, pIdx) => {
    demoTexts.forEach((rev, rIdx) => {
      reviews.push({
        id: `rev-${p.id}-${rIdx + 1}`,
        productId: p.id,
        userId: `usr-${rIdx + 1}`,
        author: rev.author,
        rating: rev.rating,
        content: rev.content,
        orderId: `LM10000${pIdx + 1}`,
        status: 'approved',
        createdAt: new Date(Date.now() - (rIdx + 1) * 86400000 * 3).toISOString()
      });
    });
  });

  return reviews;
}

// Khởi tạo Users
function generateInitialUsers(): User[] {
  return getAllUsers().map(({ passwordHash: _, ...rest }) => rest as User);
}

// Khởi tạo Hệ thống Danh mục Đa cấp Chuẩn mực Thời Trang TADA!
export function generateInitialCategories(): Category[] {
  return [
    {
      id: 'cat-nu',
      name: 'Nữ',
      slug: 'nu',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
      icon: '👗',
      description: 'Thời trang nữ cao cấp, tinh tế và thanh lịch',
      parentId: null,
      order: 1,
      isActive: true,
      displayOnHome: true,
      subcategories: [
        { id: 'cat-ao-so-mi-nu', name: 'Áo sơ mi nữ', slug: 'ao-so-mi-nu', parentId: 'cat-nu', order: 1, isActive: true },
        { id: 'cat-ao-thun-nu', name: 'Áo thun nữ', slug: 'ao-thun-nu', parentId: 'cat-nu', order: 2, isActive: true },
        { id: 'cat-ao-kieu-nu', name: 'Áo kiểu', slug: 'ao-kieu-nu', parentId: 'cat-nu', order: 3, isActive: true },
        { id: 'cat-ao-croptop-nu', name: 'Áo croptop', slug: 'ao-croptop-nu', parentId: 'cat-nu', order: 4, isActive: true },
        { id: 'cat-ao-len-nu', name: 'Áo len', slug: 'ao-len-nu', parentId: 'cat-nu', order: 5, isActive: true },
        { id: 'cat-ao-khoac-nu', name: 'Áo khoác nữ', slug: 'ao-khoac-nu', parentId: 'cat-nu', order: 6, isActive: true },
        { id: 'cat-quan-jeans-nu', name: 'Quần jeans nữ', slug: 'quan-jeans-nu', parentId: 'cat-nu', order: 7, isActive: true },
        { id: 'cat-quan-au-nu', name: 'Quần âu nữ', slug: 'quan-au-nu', parentId: 'cat-nu', order: 8, isActive: true },
        { id: 'cat-quan-short-nu', name: 'Quần short nữ', slug: 'quan-short-nu', parentId: 'cat-nu', order: 9, isActive: true },
        { id: 'cat-chan-vay', name: 'Chân váy', slug: 'chan-vay', parentId: 'cat-nu', order: 10, isActive: true },
        { id: 'cat-dam-vay-lien', name: 'Đầm/váy liền', slug: 'dam-vay-lien', parentId: 'cat-nu', order: 11, isActive: true },
        { id: 'cat-do-bo-nu', name: 'Đồ bộ nữ', slug: 'do-bo-nu', parentId: 'cat-nu', order: 12, isActive: true }
      ]
    },
    {
      id: 'cat-nam',
      name: 'Nam',
      slug: 'nam',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      icon: '👔',
      description: 'Phong cách quý ông đương đại, chỉn chu và đẳng cấp',
      parentId: null,
      order: 2,
      isActive: true,
      displayOnHome: true,
      subcategories: [
        { id: 'cat-ao-so-mi-nam', name: 'Áo sơ mi nam', slug: 'ao-so-mi-nam', parentId: 'cat-nam', order: 1, isActive: true },
        { id: 'cat-ao-thun-nam', name: 'Áo thun nam', slug: 'ao-thun-nam', parentId: 'cat-nam', order: 2, isActive: true },
        { id: 'cat-ao-polo-nam', name: 'Áo polo', slug: 'ao-polo-nam', parentId: 'cat-nam', order: 3, isActive: true },
        { id: 'cat-ao-khoac-nam', name: 'Áo khoác nam', slug: 'ao-khoac-nam', parentId: 'cat-nam', order: 4, isActive: true },
        { id: 'cat-quan-jeans-nam', name: 'Quần jeans nam', slug: 'quan-jeans-nam', parentId: 'cat-nam', order: 5, isActive: true },
        { id: 'cat-quan-au-nam', name: 'Quần âu nam', slug: 'quan-au-nam', parentId: 'cat-nam', order: 6, isActive: true },
        { id: 'cat-quan-short-nam', name: 'Quần short nam', slug: 'quan-short-nam', parentId: 'cat-nam', order: 7, isActive: true },
        { id: 'cat-do-bo-nam', name: 'Đồ bộ nam', slug: 'do-bo-nam', parentId: 'cat-nam', order: 8, isActive: true }
      ]
    },
    {
      id: 'cat-tre-em',
      name: 'Trẻ em',
      slug: 'tre-em',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format&fit=crop&q=80',
      icon: '🧸',
      description: 'Thời trang trẻ em cao cấp, an toàn và dễ thương',
      parentId: null,
      order: 3,
      isActive: true,
      displayOnHome: true,
      subcategories: [
        { id: 'cat-ao-be-trai', name: 'Áo bé trai', slug: 'ao-be-trai', parentId: 'cat-tre-em', order: 1, isActive: true },
        { id: 'cat-ao-be-gai', name: 'Áo bé gái', slug: 'ao-be-gai', parentId: 'cat-tre-em', order: 2, isActive: true },
        { id: 'cat-quan-tre-em', name: 'Quần trẻ em', slug: 'quan-tre-em', parentId: 'cat-tre-em', order: 3, isActive: true },
        { id: 'cat-vay-tre-em', name: 'Váy trẻ em', slug: 'vay-tre-em', parentId: 'cat-tre-em', order: 4, isActive: true },
        { id: 'cat-do-bo-tre-em', name: 'Đồ bộ trẻ em', slug: 'do-bo-tre-em', parentId: 'cat-tre-em', order: 5, isActive: true }
      ]
    },
    {
      id: 'cat-do-bo',
      name: 'Đồ bộ và mặc nhà',
      slug: 'do-bo',
      image: '/images/products/adidas-varsity-bomber-tracksuit.jpg',
      icon: '🛋️',
      description: 'Trang phục thư giãn, đồ ngủ và đồ mặc nhà thoáng mát',
      parentId: null,
      order: 4,
      isActive: true,
      displayOnHome: true,
      subcategories: [
        { id: 'cat-do-bo-nu-mn', name: 'Đồ bộ nữ', slug: 'do-bo-mac-nha-nu', parentId: 'cat-do-bo', order: 1, isActive: true },
        { id: 'cat-do-bo-nam-mn', name: 'Đồ bộ nam', slug: 'do-bo-mac-nha-nam', parentId: 'cat-do-bo', order: 2, isActive: true },
        { id: 'cat-do-ngu', name: 'Đồ ngủ', slug: 'do-ngu', parentId: 'cat-do-bo', order: 3, isActive: true },
        { id: 'cat-do-mac-nha', name: 'Đồ mặc nhà', slug: 'do-mac-nha', parentId: 'cat-do-bo', order: 4, isActive: true }
      ]
    },
    {
      id: 'cat-phu-kien',
      name: 'Phụ kiện',
      slug: 'phu-kien',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      icon: '👜',
      description: 'Túi xách, balo, thắt lưng và phụ kiện hoàn thiện outfit',
      parentId: null,
      order: 5,
      isActive: true,
      displayOnHome: true,
      subcategories: [
        { id: 'cat-tui-xach', name: 'Túi xách', slug: 'tui-xach', parentId: 'cat-phu-kien', order: 1, isActive: true },
        { id: 'cat-balo', name: 'Balo', slug: 'balo', parentId: 'cat-phu-kien', order: 2, isActive: true },
        { id: 'cat-that-lung', name: 'Thắt lưng', slug: 'that-lung', parentId: 'cat-phu-kien', order: 3, isActive: true },
        { id: 'cat-mu-non', name: 'Mũ/nón', slug: 'mu-non', parentId: 'cat-phu-kien', order: 4, isActive: true },
        { id: 'cat-tat-vo', name: 'Tất/vớ', slug: 'tat-vo', parentId: 'cat-phu-kien', order: 5, isActive: true },
        { id: 'cat-vi', name: 'Ví', slug: 'vi', parentId: 'cat-phu-kien', order: 6, isActive: true },
        { id: 'cat-phu-kien-tt', name: 'Phụ kiện thời trang', slug: 'phu-kien-thoi-trang', parentId: 'cat-phu-kien', order: 7, isActive: true }
      ]
    }
  ];
}

// ===== CATEGORIES METHODS =====

export function getDBCategories(): Category[] {
  const categories = readJSON<Category[]>(CATEGORIES_FILE, generateInitialCategories());
  return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function saveDBCategories(categories: Category[]): void {
  writeJSON(CATEGORIES_FILE, categories);
}

export function getCategoryBySlug(slug: string): { parent?: Category; sub?: Category } | undefined {
  const categories = getDBCategories();
  // 1. Kiểm tra nếu là danh mục cha
  const parent = categories.find((c) => c.slug === slug || c.id === slug);
  if (parent) return { parent };

  // 2. Kiểm tra nếu là danh mục con
  for (const p of categories) {
    if (p.subcategories) {
      const sub = p.subcategories.find((s) => s.slug === slug || s.id === slug);
      if (sub) return { parent: p, sub };
    }
  }
  return undefined;
}

export function createOrUpdateCategory(catData: Partial<Category>): { success: boolean; message: string; category?: Category } {
  const categories = getDBCategories();
  const slug = catData.slug || (catData.name ? catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `cat-${Date.now()}`);
  const id = catData.id || `cat-${slug}-${Date.now().toString().slice(-4)}`;

  if (catData.parentId) {
    // Thêm hoặc sửa danh mục con
    const parentIndex = categories.findIndex((c) => c.id === catData.parentId || c.slug === catData.parentId);
    if (parentIndex === -1) {
      return { success: false, message: 'Danh mục cha không tồn tại.' };
    }
    const parent = categories[parentIndex];
    if (!parent.subcategories) parent.subcategories = [];

    const existingSubIndex = parent.subcategories.findIndex((s) => s.id === id || s.slug === slug);
    if (existingSubIndex >= 0) {
      parent.subcategories[existingSubIndex] = {
        ...parent.subcategories[existingSubIndex],
        ...catData,
        id,
        slug
      };
    } else {
      parent.subcategories.push({
        id,
        name: catData.name || 'Danh mục con mới',
        slug,
        parentId: parent.id,
        order: catData.order || parent.subcategories.length + 1,
        isActive: catData.isActive !== false,
        image: catData.image
      });
    }
    saveDBCategories(categories);
    return { success: true, message: 'Lưu danh mục con thành công!' };
  } else {
    // Thêm hoặc sửa danh mục cha
    const existingIndex = categories.findIndex((c) => c.id === id || c.slug === slug);
    if (existingIndex >= 0) {
      categories[existingIndex] = {
        ...categories[existingIndex],
        ...catData,
        id,
        slug
      };
    } else {
      categories.push({
        id,
        name: catData.name || 'Danh mục mới',
        slug,
        image: catData.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
        icon: catData.icon || '🏷️',
        description: catData.description || '',
        parentId: null,
        order: catData.order || categories.length + 1,
        isActive: catData.isActive !== false,
        displayOnHome: catData.displayOnHome !== false,
        subcategories: []
      });
    }
    saveDBCategories(categories);
    return { success: true, message: 'Lưu danh mục thành công!' };
  }
}

export function deleteDBCategory(idOrSlug: string): { success: boolean; message: string } {
  let categories = getDBCategories();
  
  // Kiểm tra nếu là danh mục cha
  const parentIdx = categories.findIndex((c) => c.id === idOrSlug || c.slug === idOrSlug);
  if (parentIdx >= 0) {
    categories.splice(parentIdx, 1);
    saveDBCategories(categories);
    return { success: true, message: 'Đã xóa danh mục chính.' };
  }

  // Kiểm tra nếu là danh mục con
  let found = false;
  for (const parent of categories) {
    if (parent.subcategories) {
      const subIdx = parent.subcategories.findIndex((s) => s.id === idOrSlug || s.slug === idOrSlug);
      if (subIdx >= 0) {
        parent.subcategories.splice(subIdx, 1);
        found = true;
        break;
      }
    }
  }

  if (found) {
    saveDBCategories(categories);
    return { success: true, message: 'Đã xóa danh mục con.' };
  }

  return { success: false, message: 'Không tìm thấy danh mục để xóa.' };
}

// ===== REAL SALES & SEARCH STATS HELPERS =====

export function getProductSalesMap(): Record<string, number> {
  const orders = readJSON<Order[]>(ORDERS_FILE, MOCK_ORDERS);
  const salesMap: Record<string, number> = {};
  for (const order of orders) {
    // Chỉ tính các đơn hàng đã giao thành công thực tế (status === 'delivered')
    if (order.status === 'delivered') {
      for (const item of order.items) {
        if (item.productId) {
          salesMap[item.productId] = (salesMap[item.productId] || 0) + (item.quantity || 1);
        }
      }
    }
  }
  return salesMap;
}

export function getDBSearchEvents(): SearchEvent[] {
  return readJSON<SearchEvent[]>(SEARCH_EVENTS_FILE, []);
}

export function recordSearchEvent(query: string, resultsCount: number, userId?: string, ipHash?: string): void {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery || cleanQuery.length < 2) return;

  const normalized = cleanQuery.toLowerCase();
  const events = getDBSearchEvents();

  // Rate-limiting: Bỏ qua nếu cùng IP hoặc cùng User tìm cùng từ khóa trong vòng 30 giây
  const now = Date.now();
  const recentDuplicate = events.slice(0, 20).find(
    (e) =>
      e.normalizedQuery === normalized &&
      (e.ipHash === ipHash || (userId && e.userId === userId)) &&
      now - new Date(e.createdAt).getTime() < 30000
  );

  if (recentDuplicate) return;

  const newEvent: SearchEvent = {
    id: `se-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    query: cleanQuery,
    normalizedQuery: normalized,
    resultsCount,
    userId,
    ipHash,
    createdAt: new Date().toISOString()
  };

  // Giữ tối đa 10,000 sự kiện gần nhất
  writeJSON(SEARCH_EVENTS_FILE, [newEvent, ...events.slice(0, 9999)]);
}

export function getTrendingSearches(limit: number = 8): { query: string; count: number }[] {
  const events = getDBSearchEvents();
  const countMap: Record<string, { query: string; count: number }> = {};

  for (const e of events) {
    if (!countMap[e.normalizedQuery]) {
      countMap[e.normalizedQuery] = { query: e.query, count: 0 };
    }
    countMap[e.normalizedQuery].count += 1;
  }

  const sorted = Object.values(countMap).sort((a, b) => b.count - a.count);
  if (sorted.length > 0) {
    return sorted.slice(0, limit);
  }

  // Fallback từ khóa tìm kiếm thời trang tự nhiên nếu chưa có đủ lượt tìm kiếm thực tế
  return [
    { query: 'Áo sơ mi lụa', count: 12 },
    { query: 'Váy đầm xòe', count: 9 },
    { query: 'Áo khoác dạ tweed', count: 8 },
    { query: 'Đồ bộ nỉ bomber', count: 7 },
    { query: 'Quần âu ống suông', count: 6 },
    { query: 'Áo polo len', count: 5 }
  ].slice(0, limit);
}

export function getDBProductViews(): ProductViewEvent[] {
  return readJSON<ProductViewEvent[]>(PRODUCT_VIEWS_FILE, []);
}

export function recordProductView(productId: string, userId?: string, ipHash?: string): void {
  const views = getDBProductViews();
  const now = Date.now();

  // Chống spam: Mỗi IP/User chỉ tính 1 view cho 1 sản phẩm trong 10 phút
  const recent = views.slice(0, 50).find(
    (v) =>
      v.productId === productId &&
      (v.ipHash === ipHash || (userId && v.userId === userId)) &&
      now - new Date(v.createdAt).getTime() < 600000
  );

  if (recent) return;

  const newView: ProductViewEvent = {
    id: `pv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productId,
    userId,
    ipHash,
    createdAt: new Date().toISOString()
  };

  writeJSON(PRODUCT_VIEWS_FILE, [newView, ...views.slice(0, 9999)]);

  // Cập nhật viewsCount cho sản phẩm
  const products = readJSON<Product[]>(PRODUCTS_FILE, []);
  const prod = products.find((p) => p.id === productId);
  if (prod) {
    prod.viewsCount = (prod.viewsCount || 0) + 1;
    writeJSON(PRODUCTS_FILE, products);
  }
}

// ===== SAFE PRODUCT MIGRATION =====

function autoMigrateProducts(products: Product[]): Product[] {
  let hasChange = false;
  const salesMap = getProductSalesMap();

  const migrated = products.map((p) => {
    let changed = false;
    const copy = { ...p };

    // 1. Phân loại danh mục đa cấp (Category & Subcategory)
    if (!copy.categoryId || !copy.subCategoryId) {
      changed = true;
      const catLower = (copy.category || '').toLowerCase();
      const nameLower = (copy.name || '').toLowerCase();

      if (catLower === 'nu' || catLower === 'women' || catLower === 'vay-dam') {
        copy.categoryId = 'nu';
        if (nameLower.includes('sơ mi') || nameLower.includes('blouse')) copy.subCategoryId = 'ao-so-mi-nu';
        else if (nameLower.includes('croptop')) copy.subCategoryId = 'ao-croptop-nu';
        else if (nameLower.includes('thun') || nameLower.includes('tee')) copy.subCategoryId = 'ao-thun-nu';
        else if (nameLower.includes('chân váy')) copy.subCategoryId = 'chan-vay';
        else if (nameLower.includes('đầm') || nameLower.includes('váy') || nameLower.includes('dress') || nameLower.includes('midi')) copy.subCategoryId = 'dam-vay-lien';
        else if (nameLower.includes('khoác') || nameLower.includes('blazer') || nameLower.includes('jacket') || nameLower.includes('cardigan')) copy.subCategoryId = 'ao-khoac-nu';
        else if (nameLower.includes('len') || nameLower.includes('knit')) copy.subCategoryId = 'ao-len-nu';
        else if (nameLower.includes('jeans')) copy.subCategoryId = 'quan-jeans-nu';
        else if (nameLower.includes('short')) copy.subCategoryId = 'quan-short-nu';
        else if (nameLower.includes('quần') || nameLower.includes('trousers')) copy.subCategoryId = 'quan-au-nu';
        else copy.subCategoryId = 'ao-kieu-nu';
      } else if (catLower === 'nam' || catLower === 'men') {
        copy.categoryId = 'nam';
        if (nameLower.includes('polo')) copy.subCategoryId = 'ao-polo-nam';
        else if (nameLower.includes('sơ mi') || nameLower.includes('shirt')) copy.subCategoryId = 'ao-so-mi-nam';
        else if (nameLower.includes('khoác') || nameLower.includes('bomber') || nameLower.includes('jacket')) copy.subCategoryId = 'ao-khoac-nam';
        else if (nameLower.includes('jeans')) copy.subCategoryId = 'quan-jeans-nam';
        else if (nameLower.includes('short')) copy.subCategoryId = 'quan-short-nam';
        else if (nameLower.includes('đồ bộ') || nameLower.includes('tracksuit')) copy.subCategoryId = 'do-bo-nam';
        else if (nameLower.includes('quần') || nameLower.includes('trousers')) copy.subCategoryId = 'quan-au-nam';
        else copy.subCategoryId = 'ao-thun-nam';
      } else if (catLower === 'tre-em' || catLower === 'kids') {
        copy.categoryId = 'tre-em';
        if (nameLower.includes('gái') || nameLower.includes('váy')) copy.subCategoryId = 'vay-tre-em';
        else if (nameLower.includes('quần')) copy.subCategoryId = 'quan-tre-em';
        else if (nameLower.includes('đồ bộ')) copy.subCategoryId = 'do-bo-tre-em';
        else copy.subCategoryId = 'ao-be-trai';
      } else if (catLower === 'do-bo') {
        copy.categoryId = 'do-bo';
        if (nameLower.includes('nữ') || nameLower.includes('lụa')) copy.subCategoryId = 'do-bo-mac-nha-nu';
        else if (nameLower.includes('nam') || nameLower.includes('tracksuit')) copy.subCategoryId = 'do-bo-mac-nha-nam';
        else copy.subCategoryId = 'do-mac-nha';
      } else if (catLower === 'phu-kien') {
        copy.categoryId = 'phu-kien';
        if (nameLower.includes('túi')) copy.subCategoryId = 'tui-xach';
        else if (nameLower.includes('balo')) copy.subCategoryId = 'balo';
        else if (nameLower.includes('thắt lưng')) copy.subCategoryId = 'that-lung';
        else if (nameLower.includes('mũ') || nameLower.includes('nón')) copy.subCategoryId = 'mu-non';
        else if (nameLower.includes('ví')) copy.subCategoryId = 'vi';
        else copy.subCategoryId = 'phu-kien-thoi-trang';
      } else {
        const isMale = nameLower.includes('nam') || nameLower.includes('men');
        copy.categoryId = isMale ? 'nam' : 'nu';
        copy.subCategoryId = isMale ? 'ao-thun-nam' : 'ao-kieu-nu';
      }
    }

    // 2. Đồng bộ số lượt bán thực tế (salesCount) từ đơn hàng
    const actualSales = salesMap[copy.id] || 0;
    if (copy.salesCount !== actualSales) {
      copy.salesCount = actualSales;
      changed = true;
    }

    // 3. Khởi tạo nhãn (tags) chuẩn hóa
    if (!copy.tags || copy.tags.length === 0) {
      const tags: ProductTag[] = [];
      if (copy.isNewArrival) tags.push('new');
      if (copy.isBestSeller || (copy.salesCount && copy.salesCount > 0)) tags.push('bestseller');
      if (copy.isSale || (copy.discountPercentage && copy.discountPercentage > 0)) tags.push('sale');
      if (copy.featured) tags.push('featured');
      if (copy.origin === 'international_order') tags.push('order');
      copy.tags = tags;
      changed = true;
    }

    if (copy.viewsCount === undefined) {
      copy.viewsCount = 10;
      changed = true;
    }

    if (changed) hasChange = true;
    return copy;
  });

  if (hasChange) {
    writeJSON(PRODUCTS_FILE, migrated);
  }

  return migrated;
}

// ===== DATABASE METHODS =====

let migratedProductsCache: { mtimeMs: number; products: Product[] } | null = null;

export function getDBProducts(): Product[] {
  ensureDirectoryExistence();
  if (!fs.existsSync(PRODUCTS_FILE)) {
    const initial = generateInitialProducts();
    saveDBProducts(initial);
    return initial;
  }
  try {
    const stats = fs.statSync(PRODUCTS_FILE);
    if (migratedProductsCache && migratedProductsCache.mtimeMs === stats.mtimeMs) {
      return migratedProductsCache.products;
    }
    const rawProducts = readJSON<Product[]>(PRODUCTS_FILE, []);
    const migrated = autoMigrateProducts(rawProducts);
    const updatedStats = fs.existsSync(PRODUCTS_FILE) ? fs.statSync(PRODUCTS_FILE) : stats;
    migratedProductsCache = { mtimeMs: updatedStats.mtimeMs, products: migrated };
    return migrated;
  } catch (err) {
    return readJSON<Product[]>(PRODUCTS_FILE, generateInitialProducts());
  }
}

export function saveDBProducts(products: Product[]): void {
  writeJSON(PRODUCTS_FILE, products);
  try {
    const stats = fs.statSync(PRODUCTS_FILE);
    migratedProductsCache = { mtimeMs: stats.mtimeMs, products };
  } catch {}
}

export function getProductById(id: string): Product | undefined {
  const products = getDBProducts();
  return products.find((p) => p.id === id || p.slug === id);
}

export function saveOrUpdateProduct(productData: Partial<Product> & { id?: string }): Product {
  const products = getDBProducts();
  const now = new Date().toISOString();

  if (productData.id && products.some((p) => p.id === productData.id)) {
    // Update
    const updatedProducts = products.map((p) => {
      if (p.id === productData.id) {
        const merged: Product = {
          ...p,
          ...productData,
          category: productData.categoryId || productData.category || p.category,
          categoryId: productData.categoryId || p.categoryId,
          subCategoryId: productData.subCategoryId || p.subCategoryId,
          updatedAt: now
        };
        // Cập nhật lại tổng tồn kho từ variants nếu có
        if (merged.variants && merged.variants.length > 0) {
          merged.stockCount = merged.variants.reduce((acc, v) => acc + (v.stockCount || 0), 0);
          merged.inStock = merged.stockCount > 0;
        }
        return merged;
      }
      return p;
    });
    saveDBProducts(updatedProducts);
    return updatedProducts.find((p) => p.id === productData.id)!;
  } else {
    // Insert new
    const newId = productData.id || `prod-${Date.now()}`;
    const baseSku = productData.sku || `TADA-${(productData.categoryId || productData.category || 'PROD').toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`;
    
    // Tạo variants mặc định nếu chưa có
    let variants = productData.variants;
    if (!variants || variants.length === 0) {
      const sizes = productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['S', 'M', 'L'];
      const colors = productData.colors && productData.colors.length > 0 ? productData.colors : [{ name: 'Mặc định', hex: '#171613' }];
      const totalStock = productData.stockCount !== undefined ? productData.stockCount : 10;
      const count = sizes.length * colors.length;
      const perStock = Math.max(1, Math.floor(totalStock / count));
      let rem = totalStock;

      variants = [];
      colors.forEach((c, cIdx) => {
        sizes.forEach((s, sIdx) => {
          const isLast = (cIdx === colors.length - 1) && (sIdx === sizes.length - 1);
          const stock = isLast ? rem : Math.min(rem, perStock);
          rem = Math.max(0, rem - stock);

          variants!.push({
            id: `var-${newId}-${cIdx}-${sIdx}`,
            sku: `${baseSku}-${c.name.slice(0, 2).toUpperCase()}-${s}`,
            color: c.name,
            colorHex: c.hex,
            size: s,
            stockCount: stock,
            price: productData.price || 0,
            originalPrice: productData.originalPrice || productData.price || 0,
            inStock: stock > 0,
            image: productData.images?.[0]
          });
        });
      });
    }

    const totalStock = variants.reduce((acc, v) => acc + (v.stockCount || 0), 0);
    const catId = productData.categoryId || productData.category || 'nu';
    const subCatId = productData.subCategoryId || 'ao-kieu-nu';

    const newProduct: Product = {
      id: newId,
      name: productData.name || 'Sản phẩm mới',
      slug: productData.slug || newId,
      sku: baseSku,
      barcode: productData.barcode,
      brand: productData.brand || 'TADA! Signature',
      origin: productData.origin || 'vietnam_local_brand',
      originCountry: productData.originCountry || 'Việt Nam',
      badges: productData.badges || ['LOCAL BRAND'],
      category: catId,
      categoryId: catId,
      subCategoryId: subCatId,
      additionalCategoryIds: productData.additionalCategoryIds || [],
      tags: productData.tags || ['new'],
      price: productData.price || 0,
      originalPrice: productData.originalPrice || productData.price || 0,
      discountPercentage: productData.discountPercentage || 0,
      costPrice: productData.costPrice,
      saleStartDate: productData.saleStartDate,
      saleEndDate: productData.saleEndDate,
      rating: 5,
      reviewCount: 0,
      viewsCount: 0,
      salesCount: 0,
      inStock: totalStock > 0,
      stockCount: totalStock,
      status: productData.status || 'active',
      variants,
      estimatedDelivery: productData.estimatedDelivery || 'Hỏa tốc 2-4h (Nội thành)',
      images: productData.images && productData.images.length > 0 ? productData.images : ['/images/products/dress-1.jpg'],
      coverImageIndex: productData.coverImageIndex || 0,
      colors: productData.colors || [{ name: 'Đen Tiêu Chuẩn', hex: '#171613' }],
      sizes: productData.sizes || ['S', 'M', 'L'],
      shortDescription: productData.shortDescription || 'Sản phẩm thời trang cao cấp từ TADA!',
      description: productData.description || 'Sản phẩm mới cao cấp từ TADA!',
      material: productData.material || 'Cotton cao cấp',
      careInstructions: productData.careInstructions || ['Giặt nhẹ', 'Không sấy khô'],
      style: productData.style || 'Regular fit',
      pattern: productData.pattern || 'Trơn',
      gender: productData.gender || (catId === 'nam' ? 'nam' : 'nu'),
      season: productData.season || 'bon-mua',
      fashionStyle: productData.fashionStyle || 'Thanh lịch đương đại',
      seoTitle: productData.seoTitle || productData.name,
      seoDescription: productData.seoDescription || productData.shortDescription,
      featured: productData.featured || false,
      isNewArrival: productData.isNewArrival !== false,
      isBestSeller: false,
      isSale: (productData.discountPercentage || 0) > 0,
      createdAt: now,
      updatedAt: now
    };

    saveDBProducts([newProduct, ...products]);

    // Ghi log nhập kho
    recordInventoryLog({
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'import',
      quantityBefore: 0,
      quantityChange: totalStock,
      quantityAfter: totalStock,
      reason: 'Khởi tạo sản phẩm mới vào danh mục kho',
      performedBy: 'Admin'
    });

    return newProduct;
  }
}

export function deleteDBProduct(id: string): boolean {
  const products = getDBProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length !== products.length) {
    saveDBProducts(filtered);
    return true;
  }
  return false;
}

// ===== INVENTORY & AUDIT LOG =====

export function getDBInventoryLogs(): InventoryLog[] {
  return readJSON<InventoryLog[]>(INVENTORY_LOGS_FILE, generateInitialInventoryLogs(getDBProducts()));
}

export function recordInventoryLog(logData: Omit<InventoryLog, 'id' | 'createdAt'>): InventoryLog {
  const logs = getDBInventoryLogs();
  const newLog: InventoryLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  writeJSON(INVENTORY_LOGS_FILE, [newLog, ...logs]);
  return newLog;
}

export function adjustProductStock(
  productId: string,
  variantId: string | null | undefined,
  change: number,
  type: 'import' | 'manual_adjust' | 'order_deduct' | 'order_cancel_return',
  reason: string,
  performedBy: string = 'Admin',
  orderId?: string
): { success: boolean; message: string; updatedProduct?: Product } {
  const products = getDBProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return { success: false, message: 'Không tìm thấy sản phẩm.' };
  }

  let qtyBefore = 0;
  let qtyAfter = 0;
  let variantDesc = '';

  if (variantId && product.variants && product.variants.length > 0) {
    const variantIndex = product.variants.findIndex((v) => v.id === variantId);
    if (variantIndex === -1) {
      return { success: false, message: 'Không tìm thấy biến thể kích cỡ/màu sắc này.' };
    }
    const variant = product.variants[variantIndex];
    qtyBefore = variant.stockCount;
    qtyAfter = qtyBefore + change;

    if (qtyAfter < 0) {
      return {
        success: false,
        message: `Tồn kho không đủ! Biến thể (${variant.color} - Size ${variant.size}) hiện chỉ còn ${qtyBefore} chiếc.`
      };
    }

    variant.stockCount = qtyAfter;
    variant.inStock = qtyAfter > 0;
    variantDesc = `${variant.color} - Size ${variant.size}`;
    
    // Cập nhật lại tổng tồn kho sản phẩm
    product.stockCount = product.variants.reduce((acc, v) => acc + v.stockCount, 0);
    product.inStock = product.stockCount > 0;
  } else {
    // Điều chỉnh trên tổng sản phẩm
    qtyBefore = product.stockCount;
    qtyAfter = qtyBefore + change;

    if (qtyAfter < 0) {
      return {
        success: false,
        message: `Tồn kho không đủ! Sản phẩm hiện chỉ còn ${qtyBefore} chiếc.`
      };
    }

    product.stockCount = qtyAfter;
    product.inStock = qtyAfter > 0;

    // Phân bổ đều cho variants nếu có
    if (product.variants && product.variants.length > 0) {
      const vCount = product.variants.length;
      const per = Math.floor(qtyAfter / vCount);
      let rem = qtyAfter;
      product.variants.forEach((v, idx) => {
        const isLast = idx === vCount - 1;
        v.stockCount = isLast ? rem : per;
        v.inStock = v.stockCount > 0;
        rem -= v.stockCount;
      });
    }
  }

  product.updatedAt = new Date().toISOString();
  saveDBProducts(products);

  // Ghi nhật ký
  recordInventoryLog({
    productId: product.id,
    productName: product.name,
    variantId: variantId || undefined,
    variantDesc: variantDesc || undefined,
    type,
    quantityBefore: qtyBefore,
    quantityChange: change,
    quantityAfter: qtyAfter,
    reason,
    performedBy,
    orderId
  });

  return { success: true, message: 'Cập nhật kho thành công.', updatedProduct: product };
}

// ===== ORDERS =====

export function checkAndCancelExpiredVietQROrders(): void {
  try {
    const orders = readJSON<Order[]>(ORDERS_FILE, MOCK_ORDERS);
    const now = Date.now();
    let hasExpired = false;

    for (const order of orders) {
      if (
        order.paymentMethod === 'vietqr' &&
        order.paymentStatus === 'pending' &&
        order.status === 'pending_confirmation' &&
        order.holdExpiresAt &&
        new Date(order.holdExpiresAt).getTime() < now
      ) {
        hasExpired = true;
        order.status = 'cancelled';
        order.statusLabel = 'Đã hủy (Hết hạn chuyển khoản 24h)';
        order.updatedAt = new Date().toISOString();
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
          status: 'cancelled',
          statusLabel: 'Đã hủy (Hết hạn chuyển khoản 24h)',
          changedAt: new Date().toISOString(),
          note: 'Tự động hủy đơn và hoàn trả tồn kho sau 24 giờ không thanh toán VietQR.'
        });

        // Hoàn lại tồn kho cho từng sản phẩm
        for (const item of order.items) {
          adjustProductStock(
            item.productId,
            item.variantId,
            item.quantity,
            'order_cancel_return',
            `Tự động hoàn kho do đơn ${order.orderCode} quá hạn 24h`,
            'System Auto'
          );
        }
      }
    }

    if (hasExpired) {
      writeJSON(ORDERS_FILE, orders);
    }
  } catch (err) {
    console.error('Error auto-cancelling expired VietQR orders:', err);
  }
}

export function getDBOrders(): Order[] {
  checkAndCancelExpiredVietQROrders();
  return readJSON<Order[]>(ORDERS_FILE, MOCK_ORDERS);
}

export function saveDBOrders(orders: Order[]): void {
  writeJSON(ORDERS_FILE, orders);
}

export function getOrderById(id: string): Order | undefined {
  const orders = getDBOrders();
  return orders.find((o) => o.id === id || o.orderCode === id || o.orderCode === `#${id}`);
}

export function createDBOrder(orderData: {
  items: Array<{
    productId: string;
    variantId?: string;
    color?: string;
    size?: string;
    quantity: number;
    productName?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district?: string;
    ward?: string;
    notes?: string;
  };
  paymentMethod: PaymentMethod;
  appliedCoupon?: string;
  couponCode?: string;
  shippingMethod?: 'standard' | 'express';
  notes?: string;
  userId?: string;
  id?: string;
  orderCode?: string;
  status?: OrderStatus;
  statusLabel?: string;
  paymentStatus?: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
}): {
  success: boolean;
  message: string;
  order?: Order;
} {
  // 1. Validate danh sách sản phẩm
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    return { success: false, message: 'Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.' };
  }

  // 2. Validate số lượng từng món (phải là số nguyên từ 1 đến 20)
  for (const item of orderData.items) {
    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      isNaN(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    ) {
      return {
        success: false,
        message: 'Số lượng mua cho mỗi sản phẩm phải là số nguyên hợp lệ từ 1 đến 20.'
      };
    }
  }

  // 3. Validate phương thức thanh toán
  const validMethods: PaymentMethod[] = ['cod', 'vietqr'];
  if (!validMethods.includes(orderData.paymentMethod)) {
    return {
      success: false,
      message: 'Phương thức thanh toán không hợp lệ (hỗ trợ COD hoặc Chuyển khoản VietQR).'
    };
  }

  // 4. Validate địa chỉ giao hàng
  const addr = orderData.shippingAddress;
  if (!addr || typeof addr !== 'object') {
    return { success: false, message: 'Thiếu thông tin địa chỉ giao hàng.' };
  }

  const cleanFullName = (addr.fullName || '').trim();
  const cleanPhone = (addr.phone || '').trim().replace(/[\s.-]/g, '');
  const cleanEmail = (addr.email || '').trim().toLowerCase();
  const cleanAddress = (addr.address || '').trim();
  const cleanCity = (addr.city || '').trim();

  if (!cleanFullName || !cleanPhone || !cleanAddress || !cleanCity) {
    return {
      success: false,
      message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại, Địa chỉ chi tiết và Tỉnh/Thành phố.'
    };
  }

  const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!VN_PHONE_REGEX.test(cleanPhone)) {
    return {
      success: false,
      message: 'Số điện thoại nhận hàng không hợp lệ (hỗ trợ các đầu số di động Việt Nam).'
    };
  }

  // 5. BẢO MẬT: Cộng gộp số lượng theo từng biến thể trước khi kiểm tra tồn kho
  const aggregatedMap = new Map<string, {
    productId: string;
    variantId?: string;
    color?: string;
    size?: string;
    totalQuantity: number;
    productName?: string;
  }>();

  for (const item of orderData.items) {
    const key = `${item.productId}__${item.variantId || (item.color || '') + '_' + (item.size || '')}`;
    const existing = aggregatedMap.get(key);
    if (existing) {
      existing.totalQuantity += item.quantity;
    } else {
      aggregatedMap.set(key, {
        productId: item.productId,
        variantId: item.variantId,
        color: item.color,
        size: item.size,
        totalQuantity: item.quantity,
        productName: item.productName
      });
    }
  }

  const products = getDBProducts();

  for (const agg of aggregatedMap.values()) {
    const prod = products.find((p) => p.id === agg.productId);
    if (!prod) {
      return { success: false, message: `Sản phẩm "${agg.productName || agg.productId}" không tồn tại trong hệ thống.` };
    }

    if (agg.variantId && prod.variants) {
      const variant = prod.variants.find((v) => v.id === agg.variantId || (v.color === agg.color && v.size === agg.size));
      if (!variant) {
        return { success: false, message: `Biến thể (${agg.color} - Size ${agg.size}) của "${prod.name}" không tồn tại.` };
      }
      if (variant.stockCount < agg.totalQuantity) {
        return {
          success: false,
          message: `Rất tiếc! "${prod.name}" (${agg.color} - Size ${agg.size}) chỉ còn ${variant.stockCount} chiếc, không đủ tổng số lượng ${agg.totalQuantity} bạn yêu cầu.`
        };
      }
    } else {
      if (prod.stockCount < agg.totalQuantity) {
        return {
          success: false,
          message: `Rất tiếc! "${prod.name}" chỉ còn ${prod.stockCount} chiếc trong kho.`
        };
      }
    }
  }

  // 6. TÍNH TIỀN PHÍA SERVER - Lấy giá gốc từ products.json, hoàn toàn bỏ qua giá client gửi
  const trustedItems: OrderItem[] = [];
  let serverSubtotal = 0;

  for (const item of orderData.items) {
    const prod = products.find((p) => p.id === item.productId)!;
    const variant = prod.variants?.find((v) => v.id === item.variantId || (v.color === item.color && v.size === item.size));
    const unitPrice = (variant && typeof variant.price === 'number' && variant.price > 0) ? variant.price : prod.price;

    trustedItems.push({
      productId: prod.id,
      productName: prod.name,
      brand: prod.brand,
      image: prod.images?.[0] || '/images/placeholder-fashion.svg',
      color: item.color || variant?.color || 'Tiêu chuẩn',
      size: item.size || variant?.size || 'Tiêu chuẩn',
      price: unitPrice,
      quantity: item.quantity,
      origin: prod.origin,
      variantId: variant?.id,
      sku: variant?.sku || prod.sku
    });

    serverSubtotal += unitPrice * item.quantity;
  }

  // Lấy cấp bậc hội viên thực tế từ server nếu có userId
  let userTier = undefined;
  if (orderData.userId) {
    const existingUser = findUserById(orderData.userId);
    if (existingUser) {
      userTier = existingUser.membershipTier;
    }
  }

  // Đếm số lượt đã sử dụng mã giảm giá này trên toàn hệ thống
  const existingOrders = getDBOrders();
  const inputCoupon = (orderData.appliedCoupon || orderData.couponCode || '').trim().toUpperCase();
  const couponUsageCount = inputCoupon
    ? existingOrders.filter((o) => o.appliedCoupon?.toUpperCase() === inputCoupon && o.status !== 'cancelled').length
    : 0;

  const pricing = calculateOrderPricing({
    subtotal: serverSubtotal,
    couponCode: inputCoupon,
    membershipTier: userTier,
    shippingMethod: orderData.shippingMethod || 'standard',
    couponUsageCount
  });

  if (inputCoupon && pricing.couponMessage && !pricing.appliedCoupon) {
    return {
      success: false,
      message: pricing.couponMessage
    };
  }

  // 7. Tạo mã đơn hàng bảo mật khó đoán với 6 ký tự hex ngẫu nhiên
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  const orderId = `LM${dateStr}${randomHex}${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const orderCode = `#TADA-${dateStr}-${randomHex}`;

  // Trạng thái khi tạo đơn LUÔN LUÔN là 'pending_confirmation' và paymentStatus: 'pending'
  const newOrder: Order = {
    id: orderId,
    orderCode,
    createdAt: now.toISOString(),
    status: 'pending_confirmation',
    statusLabel: 'Chờ xác nhận',
    userId: orderData.userId,
    items: trustedItems,
    shippingAddress: {
      fullName: cleanFullName,
      phone: cleanPhone,
      email: cleanEmail,
      address: cleanAddress,
      city: cleanCity,
      district: (addr.district || '').trim(),
      ward: (addr.ward || '').trim(),
      notes: (addr.notes || orderData.notes || '').trim()
    },
    subtotal: pricing.subtotal,
    shippingFee: pricing.shippingFee,
    discountAmount: pricing.totalDiscount,
    appliedCoupon: pricing.appliedCoupon || undefined,
    total: pricing.total,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: 'pending',
    holdExpiresAt: orderData.paymentMethod === 'vietqr' ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
    statusHistory: [
      {
        status: 'pending_confirmation',
        statusLabel: 'Chờ xác nhận',
        changedAt: now.toISOString(),
        note: orderData.paymentMethod === 'vietqr'
          ? 'Đơn hàng tạo thành công qua VietQR (Giữ tồn kho trong 24 giờ)'
          : 'Đơn hàng được đặt thành công qua website TADA!'
      }
    ]
  };

  // 8. Trừ tồn kho đồng bộ và kiểm tra kết quả - ROLLBACK TOÀN BỘ nếu thất bại
  const deductedItems: Array<{ productId: string; variantId?: string; quantity: number }> = [];

  for (const item of trustedItems) {
    const prod = products.find((p) => p.id === item.productId)!;
    const targetVariant = prod.variants?.find((v) => v.id === item.variantId || (v.color === item.color && v.size === item.size));

    const adjustResult = adjustProductStock(
      prod.id,
      targetVariant?.id,
      -item.quantity,
      'order_deduct',
      `Xuất kho cho đơn hàng ${newOrder.orderCode}`,
      cleanFullName,
      newOrder.orderCode
    );

    if (!adjustResult.success) {
      // Rollback toàn bộ các món đã trừ trước đó
      for (const d of deductedItems) {
        adjustProductStock(
          d.productId,
          d.variantId,
          d.quantity,
          'order_cancel_return',
          `Rollback hoàn kho do lỗi tạo đơn ${newOrder.orderCode}`,
          'System Rollback'
        );
      }
      return {
        success: false,
        message: adjustResult.message || 'Lỗi trừ tồn kho sản phẩm. Đơn hàng không thể hoàn tất.'
      };
    }

    deductedItems.push({
      productId: prod.id,
      variantId: targetVariant?.id,
      quantity: item.quantity
    });
  }

  // 9. Lưu đơn hàng vào orders.json theo kiểu atomic write
  const allOrders = getDBOrders();
  saveDBOrders([newOrder, ...allOrders]);

  return { success: true, message: 'Đặt hàng thành công.', order: newOrder };
}

export function updateDBOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  performedBy: string = 'Admin',
  newPaymentStatus?: 'pending' | 'paid' | 'partially_paid' | 'refunded'
): { success: boolean; message: string; order?: Order } {
  const orders = getDBOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderCode === orderId);
  if (orderIndex === -1) {
    return { success: false, message: 'Không tìm thấy đơn hàng.' };
  }

  const order = orders[orderIndex];
  const oldStatus = order.status;

  const labelMap: Record<OrderStatus, string> = {
    pending_confirmation: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    shipping: 'Đang vận chuyển',
    delivered: 'Đã giao thành công',
    cancelled: 'Đã hủy',
    return_processing: 'Đang xử lý đổi trả'
  };

  const newLabel = labelMap[newStatus] || newStatus;

  // Nếu chuyển từ trạng thái chưa hủy sang 'cancelled': HOÀN LẠI TỒN KHO AN TOÀN
  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    for (const item of order.items) {
      const prod = getProductById(item.productId);
      if (prod) {
        const targetVariant = prod.variants?.find((v) => v.id === item.variantId || (v.color === item.color && v.size === item.size));
        adjustProductStock(
          prod.id,
          targetVariant?.id,
          item.quantity,
          'order_cancel_return',
          `Hoàn kho do hủy đơn hàng ${order.orderCode} (${note || 'Khách hủy hoặc admin hủy'})`,
          performedBy,
          order.orderCode
        );
      }
    }
  }

  // Cập nhật trạng thái thanh toán nếu có chỉ định hoặc khi giao hàng COD thành công
  if (newPaymentStatus) {
    order.paymentStatus = newPaymentStatus;
  } else if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }

  order.status = newStatus;
  order.statusLabel = newLabel;
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status: newStatus,
    statusLabel: newLabel,
    changedAt: new Date().toISOString(),
    note: note || `Cập nhật bởi ${performedBy}`
  });

  saveDBOrders(orders);
  return { success: true, message: 'Cập nhật trạng thái đơn hàng thành công.', order };
}

// ===== REVIEWS =====

export function getDBReviews(productId?: string): Review[] {
  const reviews = readJSON<Review[]>(REVIEWS_FILE, generateInitialReviews(getDBProducts()));
  if (productId) {
    return reviews.filter((r) => r.productId === productId);
  }
  return reviews;
}

export function saveDBReviews(reviews: Review[]): void {
  writeJSON(REVIEWS_FILE, reviews);
}

export function addDBReview(reviewData: Omit<Review, 'id' | 'createdAt'>): { success: boolean; message: string; review?: Review } {
  // 1. Kiểm tra xem người dùng đã mua sản phẩm này chưa
  if (reviewData.userId && reviewData.productId) {
    const orders = getDBOrders();
    const hasBought = orders.some((o) =>
      (o.userId === reviewData.userId || o.shippingAddress.email === reviewData.userId) &&
      (o.status === 'delivered' || o.status === 'confirmed' || o.status === 'shipping') &&
      o.items.some((i) => i.productId === reviewData.productId)
    );

    // Lưu ý: Nếu có đơn hàng hợp lệ thì gắn mã đơn hàng
    if (!reviewData.orderId && hasBought) {
      const matchedOrder = orders.find((o) =>
        (o.userId === reviewData.userId || o.shippingAddress.email === reviewData.userId) &&
        o.items.some((i) => i.productId === reviewData.productId)
      );
      if (matchedOrder) reviewData.orderId = matchedOrder.orderCode;
    }
  }

  const reviews = getDBReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: reviewData.status || 'approved',
    createdAt: new Date().toISOString()
  };

  const updatedReviews = [newReview, ...reviews];
  saveDBReviews(updatedReviews);

  // Tính lại điểm trung bình và số lượng review cho sản phẩm
  if (reviewData.productId) {
    recalculateProductRating(reviewData.productId, updatedReviews);
  }

  return { success: true, message: 'Đánh giá đã được gửi thành công!', review: newReview };
}

export function updateReviewStatus(reviewId: string, status: 'approved' | 'pending' | 'hidden'): boolean {
  const reviews = getDBReviews();
  const review = reviews.find((r) => r.id === reviewId);
  if (!review) return false;

  review.status = status;
  saveDBReviews(reviews);

  if (review.productId) {
    recalculateProductRating(review.productId, reviews);
  }
  return true;
}

function recalculateProductRating(productId: string, reviews: Review[]) {
  const approvedReviews = reviews.filter((r) => r.productId === productId && r.status === 'approved');
  const products = getDBProducts();
  const product = products.find((p) => p.id === productId);
  if (product) {
    if (approvedReviews.length > 0) {
      const totalStars = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Number((totalStars / approvedReviews.length).toFixed(1));
      product.reviewCount = approvedReviews.length;
    } else {
      product.rating = 5.0;
      product.reviewCount = 0;
    }
    saveDBProducts(products);
  }
}

// ===== USERS =====

export function getDBUsers(): User[] {
  return readJSON<User[]>(USERS_FILE, generateInitialUsers());
}

export function saveDBUsers(users: User[]): void {
  writeJSON(USERS_FILE, users);
}

// ===== QUERY & ADVANCED FILTERING =====

export interface ProductQueryParams {
  category?: string;
  subCategory?: string;
  brand?: string;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  tag?: string;
  query?: string;
  inStockOnly?: boolean;
  status?: string;
  includeHidden?: boolean;
  sortBy?: 'popular' | 'best_seller' | 'most_searched' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  page?: number;
  limit?: number;
}

export function queryProducts(params: ProductQueryParams = {}): {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
} {
  let list = getDBProducts();

  // 1. Lọc trạng thái (mặc định chỉ lấy active cho khách hàng)
  if (!params.includeHidden) {
    list = list.filter((p) => !p.status || p.status === 'active');
  } else if (params.status && params.status !== 'all') {
    list = list.filter((p) => p.status === params.status);
  }

  // 2. Tìm kiếm từ khóa theo nhiều trường (Name, SKU, Brand, Material, Tags, Style)
  if (params.query && params.query.trim()) {
    const q = params.query.trim().toLowerCase();
    list = list.filter((p) => {
      const matchName = (p.name || '').toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      const matchBrand = (p.brand || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchMaterial = (p.material || '').toLowerCase().includes(q);
      const matchStyle = (p.style || '').toLowerCase().includes(q);
      const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchName || matchSku || matchBrand || matchDesc || matchMaterial || matchStyle || matchTags;
    });
  }

  // 3. Lọc theo danh mục chính
  if (params.category && params.category !== 'all') {
    const cat = params.category.toLowerCase();
    list = list.filter((p) =>
      (p.categoryId && p.categoryId.toLowerCase() === cat) ||
      (p.category && p.category.toLowerCase() === cat) ||
      (p.additionalCategoryIds && p.additionalCategoryIds.some((c) => c.toLowerCase() === cat))
    );
  }

  // 4. Lọc theo danh mục con
  if (params.subCategory && params.subCategory !== 'all') {
    const sub = params.subCategory.toLowerCase();
    list = list.filter((p) =>
      (p.subCategoryId && p.subCategoryId.toLowerCase() === sub) ||
      (p.subCategory && p.subCategory.toLowerCase() === sub)
    );
  }

  // 5. Lọc theo Thương hiệu
  if (params.brand && params.brand !== 'all') {
    const brandLower = params.brand.toLowerCase();
    list = list.filter((p) => (p.brand || '').toLowerCase() === brandLower);
  }

  // 6. Lọc theo Xuất xứ / Nguồn gốc
  if (params.origin && params.origin !== 'all') {
    list = list.filter((p) => p.origin === params.origin);
  }

  // 7. Lọc theo Giá
  if (params.minPrice !== undefined && params.minPrice > 0) {
    list = list.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined && params.maxPrice > 0) {
    list = list.filter((p) => p.price <= params.maxPrice!);
  }

  // 8. Lọc theo Màu sắc
  if (params.color && params.color !== 'all') {
    const colorLower = params.color.toLowerCase();
    list = list.filter((p) =>
      (p.colors || []).some((c) => c.name.toLowerCase().includes(colorLower)) ||
      (p.variants || []).some((v) => v.color.toLowerCase().includes(colorLower))
    );
  }

  // 9. Lọc theo Size
  if (params.size && params.size !== 'all') {
    const s = params.size.toUpperCase();
    list = list.filter((p) =>
      (p.sizes || []).some((sz) => sz.toUpperCase() === s) ||
      (p.variants || []).some((v) => v.size.toUpperCase() === s)
    );
  }

  // 10. Lọc theo Tag / Nhãn
  if (params.tag && params.tag !== 'all') {
    const t = params.tag.toLowerCase();
    list = list.filter((p) => (p.tags || []).some((tag) => tag.toLowerCase() === t));
  }

  // 11. Lọc chỉ lấy hàng còn tồn kho
  if (params.inStockOnly) {
    list = list.filter((p) => p.inStock && p.stockCount > 0);
  }

  // 12. Sắp xếp thông minh dựa trên dữ liệu thật
  const sortBy = params.sortBy || 'popular';
  list.sort((a, b) => {
    switch (sortBy) {
      case 'best_seller':
        return (b.salesCount || 0) - (a.salesCount || 0);
      case 'most_searched':
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      case 'newest':
        return new Date(b.createdAt || b.updatedAt || 0).getTime() - new Date(a.createdAt || a.updatedAt || 0).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'discount':
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      case 'popular':
      default: {
        const scoreA = (a.salesCount || 0) * 5 + (a.viewsCount || 0) + (a.rating || 5) * 2;
        const scoreB = (b.salesCount || 0) * 5 + (b.viewsCount || 0) + (b.rating || 5) * 2;
        return scoreB - scoreA;
      }
    }
  });

  const total = list.length;
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 20);
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const pagedProducts = list.slice(startIndex, startIndex + limit);

  return {
    products: pagedProducts,
    total,
    totalPages,
    page,
    limit
  };
}

// ===== REAL STATISTICS SUMMARY FOR DASHBOARD =====

export function getRealProductStats(): {
  topSelling: Product[];
  mostViewed: Product[];
  lowStock: Product[];
  outOfStock: Product[];
  trendingKeywords: { query: string; count: number }[];
  totalProducts: number;
  totalActive: number;
} {
  const products = getDBProducts();
  const sortedBySales = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
  const sortedByViews = [...products].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  const lowStock = products.filter((p) => p.stockCount > 0 && p.stockCount <= 5);
  const outOfStock = products.filter((p) => p.stockCount <= 0 || !p.inStock);
  const trendingKeywords = getTrendingSearches(8);

  return {
    topSelling: sortedBySales.slice(0, 10),
    mostViewed: sortedByViews.slice(0, 10),
    lowStock,
    outOfStock,
    trendingKeywords,
    totalProducts: products.length,
    totalActive: products.filter((p) => p.status === 'active').length
  };
}
