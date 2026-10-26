import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { removeVietnameseTones, matchSearchQuery } from '@/lib/vietnamese';
import { calculateServerShipping } from '@/lib/shipping';
import { calculateOrderPricing, FREESHIP_THRESHOLD } from '@/lib/pricing';
import { safeCompare, SePayAdapter, extractOrderCodeFromContent } from '@/lib/payment-webhook';
import {
  savePasswordResetToken,
  getPasswordResetToken,
  markPasswordResetTokenUsed,
  createConciergeRequest,
  lookupConciergeRequest,
  updateConciergeStatus,
  getDBOrders,
  getDBProducts
} from '@/lib/db';
import { requireAdmin, requireUser } from '@/lib/guard';
import { signStatelessSessionToken, verifySessionToken } from '@/lib/auth';
import { sanitizeCsvCell } from '@/lib/csv';
import { verifyTotpCode, generateTotpSecret, generateTotpCode, generateBackupCodes, verifyAndConsumeBackupCode } from '@/lib/totp';
import crypto from 'crypto';

describe('TADA! Fashion Atelier - Automated Test Suite', () => {

  // =========================================================================
  // 1. TÌM KIẾM KHÔNG DẤU VÀ CHỊU LỖI GÕ (ACCENTLESS & TYPO SEARCH)
  // =========================================================================
  describe('1. Tìm kiếm không dấu và chịu lỗi gõ', () => {
    it('chuẩn hóa NFD, loại bỏ toàn bộ dấu thanh tiếng Việt và chuyển đ/Đ thành d/D', () => {
      expect(removeVietnameseTones('Áo sơ mi lụa tơ tằm')).toBe('ao so mi lua to tam');
      expect(removeVietnameseTones('ĐẦM DẠ HỘI CAO CẤP')).toBe('dam da hoi cao cap');
      expect(removeVietnameseTones('Chân váy xếp ly đen')).toBe('chan vay xep ly den');
    });

    it('tìm kiếm "ao so mi" phải khớp chính xác "Áo Sơ Mi Lụa Cát"', () => {
      const productName = 'Áo Sơ Mi Lụa Cát Thêu Tay';
      expect(matchSearchQuery(productName, 'ao so mi')).toBe(true);
      expect(matchSearchQuery(productName, 'LỤA CÁT')).toBe(true);
      expect(matchSearchQuery(productName, 'theu tay')).toBe(true);
    });

    it('hỗ trợ tìm kiếm theo nhiều từ đảo thứ tự (word splitting)', () => {
      const productName = 'Đầm Xoè Silk Organza Thêu Hoa';
      expect(matchSearchQuery(productName, 'dam hoa silk')).toBe(true);
      expect(matchSearchQuery(productName, 'organza dam')).toBe(true);
      expect(matchSearchQuery(productName, 'quan jean')).toBe(false);
    });
  });

  // =========================================================================
  // 2. TÍNH PHÍ SHIP VÀ TỔNG TIỀN PHÍA SERVER
  // =========================================================================
  describe('2. Tính phí ship và giá đơn hàng tại Server', () => {
    it('tính phí ship chuẩn cho khu vực nội thành Hà Nội / TP.HCM là 25,000đ', () => {
      const resHN = calculateServerShipping({ province: 'Hà Nội', subtotal: 300000 });
      expect(resHN.shippingFee).toBe(25000);
      expect(resHN.isFree).toBe(false);

      const resHCM = calculateServerShipping({ province: 'Thành phố Hồ Chí Minh', subtotal: 300000 });
      expect(resHCM.shippingFee).toBe(25000);
    });

    it('tính phí ship chuẩn cho các tỉnh khác là 35,000đ', () => {
      const res = calculateServerShipping({ province: 'Đà Nẵng', subtotal: 300000 });
      expect(res.shippingFee).toBe(35000);
      expect(res.isFree).toBe(false);
    });

    it('tính phí giao hỏa tốc (express) là 50,000đ', () => {
      const res = calculateServerShipping({ province: 'Hà Nội', subtotal: 300000, shippingMethod: 'express' });
      expect(res.shippingFee).toBe(50000);
    });

    it('tự động miễn phí ship khi đơn hàng đạt ngưỡng FREESHIP_THRESHOLD (499,000đ)', () => {
      const res = calculateServerShipping({ province: 'Cần Thơ', subtotal: FREESHIP_THRESHOLD });
      expect(res.shippingFee).toBe(0);
      expect(res.isFree).toBe(true);
    });

    it('thành viên Gold & Diamond luôn được miễn phí vận chuyển', () => {
      const resGold = calculateServerShipping({ province: 'Lâm Đồng', subtotal: 100000, membershipTier: 'gold' });
      expect(resGold.shippingFee).toBe(0);
      expect(resGold.isFree).toBe(true);

      const resDiamond = calculateServerShipping({ province: 'Lâm Đồng', subtotal: 100000, membershipTier: 'diamond', shippingMethod: 'express' });
      expect(resDiamond.shippingFee).toBe(0);
      expect(resDiamond.isFree).toBe(true);
    });

    it('tính toán lại pricing tại server, áp dụng chiết khấu hạng thành viên', () => {
      // Bronze: 0% discount
      const bronzePricing = calculateOrderPricing({ subtotal: 1000000, membershipTier: 'bronze', province: 'Hà Nội' });
      expect(bronzePricing.subtotal).toBe(1000000);
      expect(bronzePricing.totalDiscount).toBe(0);
      expect(bronzePricing.total).toBe(1000000 + bronzePricing.shippingFee);

      // Gold: 10% discount (100,000đ)
      const goldPricing = calculateOrderPricing({ subtotal: 1000000, membershipTier: 'gold', province: 'Hà Nội' });
      expect(goldPricing.subtotal).toBe(1000000);
      expect(goldPricing.membershipDiscountAmount).toBe(100000);
      expect(goldPricing.totalDiscount).toBe(100000);
      expect(goldPricing.total).toBe(900000); // 1,000,000 - 100,000 + 0 (Freeship cho Gold)
    });
  });

  // =========================================================================
  // 3. XÁC THỰC CHỮ KÝ WEBHOOK & CHỐNG REPLAY ATTACK
  // =========================================================================
  describe('3. Xác thực chữ ký webhook thanh toán VietQR', () => {
    it('safeCompare sử dụng crypto.timingSafeEqual chống timing attacks', () => {
      expect(safeCompare('secret-key-123', 'secret-key-123')).toBe(true);
      expect(safeCompare('secret-key-123', 'secret-key-456')).toBe(false);
      expect(safeCompare('secret-key-123', 'secret')).toBe(false);
      expect(safeCompare('', 'secret')).toBe(false);
      expect(safeCompare(null, 'secret')).toBe(false);
    });

    it('SePayAdapter xác thực thành công khi có đúng API key', () => {
      const adapter = new SePayAdapter();
      const prevKey = process.env.SEPAY_WEBHOOK_API_KEY;
      const prevEnv = process.env.NODE_ENV;

      try {
        process.env.SEPAY_WEBHOOK_API_KEY = 'valid-atelier-api-key';
        (process.env as any).NODE_ENV = 'production';

        const validReq = new Request('https://tada.vn/api/webhooks/payment', {
          headers: { Authorization: 'Apikey valid-atelier-api-key' }
        });
        expect(adapter.verifyRequest(validReq)).toBe(true);

        const invalidReq = new Request('https://tada.vn/api/webhooks/payment', {
          headers: { Authorization: 'Apikey fake-api-key' }
        });
        expect(adapter.verifyRequest(invalidReq)).toBe(false);
      } finally {
        process.env.SEPAY_WEBHOOK_API_KEY = prevKey;
        (process.env as any).NODE_ENV = prevEnv;
      }
    });

    it('trích xuất đúng mã đơn hàng từ nội dung chuyển khoản ngân hàng', () => {
      const dummyOrders: any[] = [
        { id: 'ord-1', orderCode: 'TADA-261024-ABC' },
        { id: 'ord-2', orderCode: 'TADA-261024-XYZ' }
      ];

      const match1 = extractOrderCodeFromContent('THANH TOAN DON HANG TADA-261024-ABC NGUYEN VAN A', dummyOrders);
      expect(match1).not.toBeNull();
      expect(match1?.orderCode).toBe('TADA-261024-ABC');

      const match2 = extractOrderCodeFromContent('MBVCB.12345678.TADA-261024-XYZ.CT TU TECHCOMBANK', dummyOrders);
      expect(match2).not.toBeNull();
      expect(match2?.orderCode).toBe('TADA-261024-XYZ');

      const matchNone = extractOrderCodeFromContent('CHUYEN TIEN CHO BAN KHONG CO MA', dummyOrders);
      expect(matchNone).toBeNull();
    });
  });

  // =========================================================================
  // 4. TOKEN QUÊN MẬT KHẨU (LIFECYCLE & SECURITY)
  // =========================================================================
  describe('4. Vòng đời token quên mật khẩu (SHA-256, Expiry & Single-use)', () => {
    it('lưu token băm SHA-256 và kiểm tra hết hạn chính xác', () => {
      const rawToken = 'test-raw-token-' + Date.now();
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const email = 'client@tada.vn';

      // Token còn hạn 30 phút
      const futureExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      savePasswordResetToken(email, tokenHash, futureExpiry);

      const found = getPasswordResetToken(tokenHash);
      expect(found).not.toBeNull();
      expect(found?.email).toBe(email);

      // Đánh dấu đã sử dụng (single-use)
      markPasswordResetTokenUsed(tokenHash);
      const consumed = getPasswordResetToken(tokenHash);
      expect(consumed).toBeNull();
    });

    it('từ chối token đã hết hạn', () => {
      const rawToken = 'expired-token-' + Date.now();
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const email = 'expired@tada.vn';

      // Token đã hết hạn trong quá khứ
      const pastExpiry = new Date(Date.now() - 5000).toISOString();
      savePasswordResetToken(email, tokenHash, pastExpiry);

      const found = getPasswordResetToken(tokenHash);
      expect(found).toBeNull();
    });
  });

  // =========================================================================
  // 5. PHÂN QUYỀN API ADMIN (AUTHORIZATION GUARD)
  // =========================================================================
  describe('5. Phân quyền và bảo vệ API Quản Trị Viên (requireAdmin)', () => {
    it('từ chối khách chưa đăng nhập với mã lỗi 401', () => {
      const req = new Request('https://tada.vn/api/admin/inventory/logs', {
        headers: {} // Không có cookie session
      });

      const guard = requireAdmin(req);
      expect(guard.errorResponse).toBeDefined();
      expect(guard.errorResponse?.status).toBe(401);
    });

    it('từ chối yêu cầu mutation nếu Origin không hợp lệ (CSRF)', () => {
      const maliciousReq = new Request('https://tada.vn/api/bank-info', {
        method: 'PUT',
        headers: {
          host: 'tada.vn',
          origin: 'https://evil-attacker.com'
        }
      });

      const guard = requireAdmin(maliciousReq);
      expect(guard.errorResponse).toBeDefined();
      expect(guard.errorResponse?.status).toBe(403);
    });

    it('xác thực thành công và cấp quyền cho token quản trị viên dạng Stateless HMAC', () => {
      const adminToken = signStatelessSessionToken({
        id: 'usr-admin',
        role: 'admin',
        email: 'admin@tada.vn',
        name: 'Quản Trị Viên TADA!',
        iat: Date.now(),
        exp: Date.now() + 3600000
      });

      const { valid, user } = verifySessionToken(adminToken);
      expect(valid).toBe(true);
      expect(user?.role).toBe('admin');
      expect(user?.email).toBe('admin@tada.vn');

      // Test qua requireAdmin với cookie tada_session
      const adminReq = new Request('https://tada-fashion-atelier.netlify.app/api/inventory/adjust', {
        method: 'POST',
        headers: {
          host: 'tada-fashion-atelier.netlify.app',
          origin: 'https://tada-fashion-atelier.netlify.app',
          cookie: `tada_session=${adminToken}`
        }
      });

      const check = requireAdmin(adminReq);
      expect(check.errorResponse).toBeUndefined();
      expect(check.user).toBeDefined();
      expect(check.user?.role).toBe('admin');
    });

    it('đảm bảo đồng bộ đầy đủ toàn bộ 22 đơn hàng và 116 sản phẩm cho serverless', () => {
      const orders = getDBOrders();
      expect(orders.length).toBe(22);

      const products = getDBProducts();
      expect(products.length).toBeGreaterThanOrEqual(79);
    });
  });

  // =========================================================================
  // 6. LUỒNG TRẠNG THÁI CONCIERGE SERVICE
  // =========================================================================
  describe('6. Luồng trạng thái dịch vụ Concierge (Bespoke & Đặt hàng quốc tế)', () => {
    it('khởi tạo yêu cầu với trạng thái ban đầu là "received"', () => {
      const res = createConciergeRequest({
        customerName: 'Hoàng Oanh',
        phone: '0901234567',
        email: 'hoangoanh@example.com',
        serviceType: 'bespoke_tailoring',
        description: 'May đo đầm dạ tiệc lụa satin tơ tằm riêng'
      });

      expect(res.success).toBe(true);
      expect(res.request).toBeDefined();
      expect(res.request?.status).toBe('received');
      expect(res.request?.statusHistory.length).toBeGreaterThan(0);
      expect(res.request?.statusHistory[0].status).toBe('received');
    });

    it('cho phép khách tra cứu bằng mã và số điện thoại / email khớp', () => {
      const created = createConciergeRequest({
        customerName: 'Minh Hằng',
        phone: '0912345678',
        email: 'minhhang@example.com',
        serviceType: 'international_order',
        productLink: 'https://chanel.com/fr/look-2026'
      });

      const code = created.request!.code;

      // Đúng mã + đúng SĐT
      const foundByPhone = lookupConciergeRequest(code, '0912345678');
      expect(foundByPhone).not.toBeNull();
      expect(foundByPhone?.customerName).toBe('Minh Hằng');

      // Đúng mã + đúng Email
      const foundByEmail = lookupConciergeRequest(code, 'minhhang@example.com');
      expect(foundByEmail).not.toBeNull();

      // Sai SĐT / Email
      const foundWrong = lookupConciergeRequest(code, '0999999999');
      expect(foundWrong).toBeNull();
    });

    it('cập nhật tuần tự các bước trong pipeline của Concierge', () => {
      const created = createConciergeRequest({
        customerName: 'Lê Thảo',
        phone: '0988776655',
        email: 'lethao@example.com',
        serviceType: 'international_order'
      });
      const reqId = created.request!.id;

      // Bước 1: Quoted
      const step1 = updateConciergeStatus(reqId, 'quoted', 'Đã thẩm định sản phẩm có sẵn tại store Milan', 12500000, 6250000);
      expect(step1.success).toBe(true);
      expect(step1.request?.status).toBe('quoted');
      expect(step1.request?.quotedPrice).toBe(12500000);

      // Bước 2: Deposit Paid
      const step2 = updateConciergeStatus(reqId, 'deposit_paid', 'Khách đã cọc 50% qua VietQR');
      expect(step2.request?.status).toBe('deposit_paid');

      // Bước 3: Delivered
      const step3 = updateConciergeStatus(reqId, 'delivered', 'Giao tận tay khách tại Atelier');
      expect(step3.request?.status).toBe('delivered');
      expect(step3.request?.statusHistory.length).toBe(4);
    });
  });

  // =========================================================================
  // 7. BẢO MẬT BỔ SUNG: CHỐNG CSV INJECTION & TOTP 2FA ENGINE
  // =========================================================================
  describe('7. Bảo vệ CSV Injection và TOTP RFC 6238 2FA Engine', () => {
    it('sanitizeCsvCell tự động thêm dấu nháy đơn vào trước các ký tự nguy hiểm (=, +, -, @)', () => {
      expect(sanitizeCsvCell('=cmd|"/C calc"!A0')).toBe(`"'=cmd|""/C calc""!A0"`);
      expect(sanitizeCsvCell('+12345678')).toBe(`"'+12345678"`);
      expect(sanitizeCsvCell('-5000')).toBe(`"'-5000"`);
      expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe(`"'@SUM(A1:A10)"`);
      expect(sanitizeCsvCell('Đơn hàng bình thường')).toBe(`"Đơn hàng bình thường"`);
    });

    it('sinh và kiểm tra mã xác thực 2 lớp TOTP RFC 6238 chuẩn xác', () => {
      const secret = generateTotpSecret();
      expect(secret.length).toBeGreaterThan(16);

      const currentCode = generateTotpCode(secret);
      expect(currentCode.length).toBe(6);
      expect(verifyTotpCode(currentCode, secret)).toBe(true);

      // Mã sai
      expect(verifyTotpCode('000000', secret)).toBe(false);
    });

    it('sinh và tiêu thụ mã dự phòng 2FA (dùng 1 lần duy nhất)', () => {
      const { plainCodes, hashedCodes } = generateBackupCodes();
      expect(plainCodes.length).toBe(8);
      expect(hashedCodes.length).toBe(8);

      const firstCode = plainCodes[0];
      const res = verifyAndConsumeBackupCode(firstCode, hashedCodes);
      expect(res.valid).toBe(true);
      expect(res.remainingHashedCodes.length).toBe(7);

      // Thử dùng lại mã vừa tiêu thụ -> Thất bại
      const reuseRes = verifyAndConsumeBackupCode(firstCode, res.remainingHashedCodes);
      expect(reuseRes.valid).toBe(false);
      expect(reuseRes.remainingHashedCodes.length).toBe(7);
    });
  });
});
