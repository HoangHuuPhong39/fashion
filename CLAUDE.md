# TADA! Fashion Atelier — Project Overview & Architecture Guide

## 1. Giới thiệu dự án (Project Overview)
**TADA!** là nền tảng thương mại điện tử thời trang cao cấp & dịch vụ đặt hàng thời trang quốc tế (Fashion Concierge) từ Paris, Seoul, Tokyo cùng các Local Brand Việt Nam.

## 2. Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide React Icons
- **Language:** TypeScript 5
- **Database / Storage:** JSON File Storage (`data/*.json`) với cache bộ nhớ in-memory và đọc/ghi đồng bộ an toàn
- **Payment:** Chuyển khoản ngân hàng VietQR tự động sinh mã QR động theo cấu hình Admin + COD

## 3. Cấu trúc thư mục (Directory Structure)
```
├── data/                       # Dữ liệu JSON lưu trữ toàn bộ hệ thống
│   ├── bank_settings.json      # Cấu hình tài khoản ngân hàng & VietQR của Shop
│   ├── categories.json         # Danh mục sản phẩm (Đầm, Áo, Quần, Túi,...)
│   ├── inventory_logs.json     # Lịch sử biến động tồn kho
│   ├── orders.json             # Danh sách đơn hàng
│   ├── products.json           # Danh mục sản phẩm & tồn kho theo phân loại màu/size
│   ├── reviews.json            # Đánh giá & xếp hạng từ khách hàng
│   ├── search_events.json      # Lịch sử tìm kiếm
│   ├── sessions.json           # Phiên đăng nhập người dùng
│   └── users.json              # Tài khoản khách hàng & quản trị viên
├── src/
│   ├── app/                    # Next.js App Router (Pages & API Routes)
│   │   ├── page.tsx            # Trang chủ (Homepage)
│   │   ├── shop/               # Trang danh mục & bộ lọc sản phẩm
│   │   ├── product/[id]/       # Chi tiết sản phẩm, chọn biến thể, đánh giá
│   │   ├── cart/               # Giỏ hàng & voucher
│   │   ├── checkout/           # Thanh toán, nhập địa chỉ, chọn VietQR/COD
│   │   ├── order-success/[id]/ # Xác nhận đơn hàng & quét mã VietQR động
│   │   ├── account/            # Quản lý hồ sơ, sổ địa chỉ, đơn mua & cấu hình Admin
│   │   ├── concierge/          # Dịch vụ Order hàng quốc tế
│   │   └── api/                # REST API Endpoints
│   │       ├── auth/           # Login, logout, register, me, profile
│   │       ├── bank-info/      # Cấu hình ngân hàng thanh toán VietQR
│   │       ├── products/       # Lấy danh sách, chi tiết, theo dõi lượt xem
│   │       ├── orders/         # Tạo đơn, duyệt đơn, tra cứu đơn
│   │       ├── inventory/      # Điều chỉnh tồn kho & xem log
│   │       └── reviews/        # Đánh giá sản phẩm
│   ├── components/             # Reusable UI components
│   │   ├── home/               # HeroBanner, FlashSale, Featured, BrandStory
│   │   ├── layout/             # Header, Footer, Navbar, MobileNav, CartDrawer
│   │   ├── product/            # ProductCard, ProductGrid, FilterSidebar
│   │   └── ui/                 # SafeImage, Modal, Toast,...
│   ├── context/                # React Context Providers
│   │   ├── AuthContext.tsx     # Quản lý phiên đăng nhập & thông tin người dùng
│   │   ├── CartContext.tsx     # Giỏ hàng, tính tổng tiền, mã giảm giá
│   │   ├── ProductContext.tsx  # Dữ liệu sản phẩm & lọc sản phẩm
│   │   └── WishlistContext.tsx # Danh sách yêu thích
│   ├── lib/                    # Logic nghiệp vụ, auth, helpers
│   └── types/                  # TypeScript interface definitions (Product, Order, User,...)
├── scripts/                    # Scripts kiểm thử và cập nhật danh mục
├── next.config.ts              # Cấu hình Next.js (Image remote patterns, Webpack)
└── package.json
```

## 4. Các luồng nghiệp vụ chính (Key Workflows)
1. **Phân quyền (Auth & Roles):**
   - Hỗ trợ vai trò `admin` và `customer`.
   - Admin có quyền chỉnh sửa tài khoản ngân hàng, duyệt đơn, điều chỉnh tồn kho, xem thống kê.
2. **Thanh toán VietQR động:**
   - Admin cấu hình ngân hàng thụ hưởng tại trang Tài khoản (`/account`).
   - Cấu hình được lưu vào `data/bank_settings.json` và phục vụ qua `/api/bank-info`.
   - Trang `/order-success/[id]` tự động sinh mã VietQR theo chuẩn Napas247 với số tiền và mã đơn hàng chính xác.
3. **Quản lý địa chỉ giao hàng:**
   - Mặc định tài khoản mới không có sẵn địa chỉ mẫu.
   - Khi vào `/checkout`, hệ thống yêu cầu người dùng điền đầy đủ địa chỉ và tự động lưu vào sổ địa chỉ tài khoản sau khi đặt hàng thành công.
