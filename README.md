# TADA! Fashion Atelier — Nền Tảng Thương Mại Điện Tử & May Đo Đương Đại

Hệ thống website thương mại điện tử thời trang cao cấp **TADA! Fashion Atelier** được xây dựng trên nền tảng **Next.js 16 App Router (Turbopack)**, **React 19**, **Tailwind CSS v4**, **TypeScript**, kết hợp cùng **Drizzle ORM** và **PostgreSQL (Neon / Supabase)**.

---

## 🌟 Tính Năng Nổi Bật

1. **Trải Nghiệm Mua Sắm & Fashion Concierge**:
   - Bộ sưu tập thời trang may đo, lookbook theo mùa Thu Đông 2026, phong cách Quiet Luxury và Local Brands Việt Nam.
   - Dịch vụ tư vấn thời trang cá nhân hóa 1:1, may đo theo số đo riêng (Bespoke/Made-to-Measure) tại trang `/concierge`.
   - Tìm kiếm trực quan, lọc đa tiêu chí (danh mục, khoảng giá, màu sắc, kích cỡ, thương hiệu).

2. **Bảo Mật Cấp Doanh Nghiệp (Enterprise Security)**:
   - Cơ chế bảo vệ Brute-force & Rate Limit khóa theo Email và IP tin cậy (Upstash Redis / Bộ nhớ dùng chung).
   - Bảo vệ thời gian so sánh bcrypt (chống timing attacks) và xác minh bằng Cloudflare Turnstile CAPTCHA.
   - Anonymization địa chỉ IP bằng thuật toán HMAC-SHA256 tuân thủ Nghị định 13/2023/NĐ-CP về Bảo vệ Dữ liệu Cá nhân.
   - Cơ chế CSRF Origin Verification, Content Security Policy (CSP), HSTS và loại bỏ `X-Powered-By`.

3. **Quản Lý Kho Hàng An Toàn & Đơn Hàng VietQR**:
   - Trừ kho nguyên tử với khóa dòng `SELECT ... FOR UPDATE` tránh bán âm (overselling).
   - Tự động giữ hàng trong 24 giờ cho đơn thanh toán Chuyển khoản VietQR, tự động hủy và hoàn kho nếu quá hạn.
   - Nhật ký biến động kho minh bạch (Inventory Audit Logs).

4. **SEO Động & Tối Ưu Hiệu Năng (Core Web Vitals)**:
   - Trang chủ, `/shop`, `/collections`, `/product/[id]` là **Server Components** kết xuất trực tiếp từ Database.
   - Thẻ Meta, Canonical URL, Open Graph và Twitter Card động cho từng trang.
   - Tự động tạo dữ liệu có cấu trúc **Schema.org JSON-LD** (`Product`, `Offer`, `BreadcrumbList`, và `AggregateRating` từ đánh giá thật).
   - Sitemap động `/sitemap.xml` tự động revalidate theo chu kỳ 1 giờ và loại bỏ URL rác.
   - Đặt cấm thu thập dữ liệu (`noindex, nofollow`) cho các trang nhạy cảm: `/cart`, `/checkout`, `/account`, `/admin`, `/order-success`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local Development

### 1. Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 20.x hoặc 22.x LTS (khuyên dùng Node 22).
- **Trình quản lý gói**: `npm` hoặc `pnpm`.
- **Cơ sở dữ liệu**: PostgreSQL (Neon Serverless, Supabase, hoặc PostgreSQL cài cục bộ).

### 2. Cài Đặt Thư Viện
```bash
npm install
```

### 3. Cấu Hình Biến Môi Trường
Sao chép file mẫu `.env.example` thành `.env.local`:
```bash
cp .env.example .env.local
```
Điền các giá trị thực tế vào file `.env.local` (tham khảo mô tả chi tiết trong file).

### 4. Chạy Máy Chủ Phát Triển
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Hướng Dẫn Di Chuyển Dữ Liệu (Database Migration)

Dự án cung cấp kịch bản di chuyển dữ liệu từ các file JSON tĩnh trong thư mục `data/` sang PostgreSQL có kiểm tra tính lũy kế (idempotent, không gây trùng lặp) và chế độ chạy thử (Dry Run):

### 1. Kiểm tra mô phỏng trước (Dry Run - Không ghi vào DB)
```bash
npx tsx scripts/migrate-to-db.ts --dry-run
```

### 2. Thực thi di chuyển dữ liệu thực tế vào PostgreSQL
Đảm bảo biến `DATABASE_URL` đã được cấu hình trong `.env.local`, sau đó chạy:
```bash
npx tsx scripts/migrate-to-db.ts
```
Toàn bộ ID sản phẩm (`prod-...`), biến thể, đơn hàng, người dùng và nhật ký kho sẽ được giữ nguyên 100%.

---

## 🚢 Hướng Dẫn Triển Khai Lên Vercel (Deployment)

1. **Đẩy mã nguồn lên kho Git (GitHub / GitLab)**.
2. **Import dự án trên Vercel Dashboard** ([https://vercel.com/new](https://vercel.com/new)).
3. **Cấu hình Framework Preset**: `Next.js`.
4. **Khai báo Environment Variables** trong mục *Settings* -> *Environment Variables*:
   - `ADMIN_EMAIL`: Email quản trị viên (ví dụ: `admin@tada.vn`).
   - `ADMIN_INITIAL_PASSWORD`: Mật khẩu khởi tạo tài khoản quản trị (tối thiểu 8 ký tự).
   - `DATABASE_URL`: Chuỗi kết nối PostgreSQL (Neon/Supabase) có SSL mode `require`.
   - `NEXT_PUBLIC_SITE_URL`: Domain thật của website (ví dụ: `https://tada-fashion.vn`).
   - `IP_HASH_SECRET`: Chuỗi ngẫu nhiên 32-byte dùng để băm IP người truy cập.
   - `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` & `CLOUDFLARE_TURNSTILE_SECRET_KEY`: Khóa bảo vệ Turnstile CAPTCHA.
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Kết nối Redis bộ đếm rate limit.
   - `BLOB_READ_WRITE_TOKEN`: Khóa lưu trữ ảnh tải lên Vercel Blob.
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Mã xác minh Google Search Console.
5. **Bấm "Deploy"** và chờ Vercel hoàn tất quá trình build.

---

## 🔐 Quản Trị Hệ Thống & Đổi Mật Khẩu Admin

1. **Đăng nhập lần đầu**:
   - Truy cập `/admin`.
   - Sử dụng email `ADMIN_EMAIL` và mật khẩu `ADMIN_INITIAL_PASSWORD` đã cấu hình.
2. **Đổi mật khẩu định kỳ**:
   - Truy cập trang Cá nhân `/account`.
   - Chọn mục **Đổi Mật Khẩu**.
   - Khi đổi mật khẩu thành công, hệ thống sẽ **tự động thu hồi toàn bộ phiên đăng nhập khác** của tài khoản để ngăn chặn truy cập trái phép.

---

## 🔍 Hướng Dẫn Xác Minh Google Search Console & Sitemap

1. **Đăng ký domain trên Google Search Console**:
   - Truy cập [Google Search Console](https://search.google.com/search-console).
   - Thêm thuộc tính URL Prefix (Ví dụ: `https://tada-fashion.vn`) hoặc Domain.
2. **Phương pháp xác minh**:
   - **Cách 1 (Khuyên dùng qua DNS)**: Thêm bản ghi `TXT` vào nhà cung cấp tên miền của bạn theo hướng dẫn của Google.
   - **Cách 2 (Qua thẻ HTML Meta Tag)**: Lấy chuỗi mã xác minh từ Google (ví dụ `abcxyz123...`) và điền vào biến `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` trên Vercel. Layout của website sẽ tự động gắn thẻ `<meta name="google-site-verification" content="..." />`.
3. **Đệ trình Sitemap**:
   - Trong giao diện Google Search Console, vào mục **Sitemaps (Sơ đồ trang web)**.
   - Nhập đường dẫn: `sitemap.xml` và bấm **Gửi (Submit)**.
   - Hệ thống tự động cập nhật sản phẩm mới mỗi 1 giờ nhờ cấu hình ISR `revalidate = 3600`.

---

## 🛠️ Hướng Dẫn Cấu Hình Chi Tiết 5 Dịch Vụ Bên Thứ Ba

Hệ thống được thiết kế theo mô hình Adapter linh hoạt, cho phép cấu hình hoặc chuyển đổi nhà cung cấp mà không làm gián đoạn vận hành:

### 1. Dịch Vụ Email Giao Dịch — Resend (https://resend.com)
- **Mục đích**: Gửi email xác nhận đơn hàng, cập nhật trạng thái đơn, đặt lại mật khẩu, xác thực email, và báo khi có hàng.
- **Cách cấu hình**:
  1. Đăng ký tài khoản tại [resend.com](https://resend.com) và tạo API Key (bắt đầu bằng `re_...`).
  2. Xác minh tên miền riêng (ví dụ: `tada-fashion.vn`) trong mục **Domains** bằng cách thêm bản ghi DNS MX, TXT (SPF), và DKIM theo hướng dẫn của Resend.
  3. Khai báo vào biến môi trường:
     - `RESEND_API_KEY`: Khóa API key vừa tạo.
     - `EMAIL_FROM`: `TADA! Fashion Atelier <no-reply@tada-fashion.vn>` (hoặc email đã xác minh).
  *(Lưu ý: Nếu chưa cấu hình key hoặc chưa xác minh domain, hệ thống tự động fallback ghi log email dạng text giả lập an toàn mà không làm gián đoạn quy trình đặt hàng).*

---

### 2. Tự Động Xác Nhận Thanh Toán VietQR — SePay hoặc Casso
- **Mục đích**: Nhận thông báo giao dịch chuyển khoản VietQR từ ngân hàng (MBBank, Vietcombank, v.v.), tự động cập nhật đơn hàng thành `paid` hoặc `partially_paid`, chống tấn công replay và timing attacks.
- **Cách cấu hình SePay (Khuyên dùng)**:
  1. Đăng ký tài khoản tại [sepay.vn](https://sepay.vn) và kết nối tài khoản ngân hàng của Atelier.
  2. Tạo Webhook với URL: `https://tada-fashion.vn/api/webhooks/payment`.
  3. Đặt API Key / Token xác thực chữ ký (Authentication Header) và điền vào:
     - `SEPAY_WEBHOOK_API_KEY`: Khóa bí mật đã đặt trên SePay.
- **Cách cấu hình Casso (Tùy chọn)**:
  1. Đăng ký tại [casso.vn](https://casso.vn) và cấu hình Webhook URL tương tự.
  2. Điền token bảo mật vào `CASSO_SECURE_TOKEN`.

---

### 3. Tính Cước Vận Chuyển — Giao Hàng Nhanh (GHN)
- **Mục đích**: Tự động tính cước vận chuyển chuẩn xác từ kho hàng đến địa chỉ người nhận theo thời gian thực.
- **Cách cấu hình**:
  1. Đăng nhập cổng quản trị [khachhang.ghn.vn](https://khachhang.ghn.vn).
  2. Vào mục **Quản lý tài khoản** -> **Thông tin tài khoản** -> Lấy `Token API` và `Mã cửa hàng (ShopId)`.
  3. Điền vào biến môi trường:
     - `GHN_API_TOKEN`: Token API từ GHN.
     - `GHN_SHOP_ID`: Mã cửa hàng của bạn trên GHN.
     - `GHN_FROM_DISTRICT_ID`: Mã Quận/Huyện của showroom/kho xuất hàng (Ví dụ: 1442 cho Quận 1, TP.HCM hoặc 1482 cho Hoàn Kiếm, Hà Nội).
  *(Lưu ý: Khi chưa có token hoặc API GHN quá tải, hệ thống tự động fallback về biểu phí đồng giá theo vùng miền của Atelier: 25.000đ nội thành, 35.000đ tỉnh thành, 50.000đ hỏa tốc).*

---

### 4. Đăng Nhập Google OAuth 2.0 (PKCE)
- **Mục đích**: Cho phép khách hàng đăng nhập nhanh 1 chạm bằng tài khoản Google, tự động xác minh email và liên kết tài khoản an toàn.
- **Cách cấu hình**:
  1. Truy cập [Google Cloud Console](https://console.cloud.google.com).
  2. Tạo Project mới -> Vào **APIs & Services** -> **Credentials**.
  3. Tạo **OAuth 2.0 Client IDs** với Application Type: *Web application*.
  4. Thêm **Authorized redirect URIs**:
     - Local: `http://localhost:3000/api/auth/google/callback`
     - Production: `https://tada-fashion.vn/api/auth/google/callback`
  5. Điền thông tin vào:
     - `GOOGLE_CLIENT_ID`: Mã Client ID (đuôi `.apps.googleusercontent.com`).
     - `GOOGLE_CLIENT_SECRET`: Mã Client Secret bảo mật.

---

### 5. Chống Bot & Spam — Cloudflare Turnstile CAPTCHA
- **Mục đích**: Bảo vệ form liên hệ `/lien-he`, đăng ký/đăng nhập và đặt hàng khỏi bot tự động mà không bắt người dùng giải câu đố hình ảnh khó chịu.
- **Cách cấu hình**:
  1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com) -> Chọn mục **Turnstile**.
  2. Bấm **Add Site**: Nhập tên miền `tada-fashion.vn` (thêm `localhost` cho môi trường thử nghiệm).
  3. Chọn chế độ: *Managed (Khuyên dùng)*.
  4. Lấy cặp khóa và điền vào:
     - `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`: Khóa công khai hiển thị trên trình duyệt.
     - `CLOUDFLARE_TURNSTILE_SECRET_KEY`: Khóa bí mật dùng để xác minh phía máy chủ.

---

## 🔄 Quy Trình Kiểm Thử & CI/CD (GitHub Actions)

Mỗi khi có commit hoặc Pull Request vào nhánh `master` hoặc `main`, luồng tự động hóa `.github/workflows/ci.yml` sẽ thực hiện chuỗi kiểm định nghiêm ngặt:
1. `npx tsc --noEmit`: Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript.
2. `npx eslint src`: Quét toàn diện chất lượng mã và quy chuẩn React 19 / Next.js.
3. `npm test`: Chạy 22 bài kiểm thử tự động toàn diện qua Vitest.
4. `npx next build`: Biên dịch gói ứng dụng production thực tế.

Chỉ những commit vượt qua 100% các bước trên mới được phép merge và deploy ra môi trường production.
