import crypto from 'crypto';
import { getDBOrders, saveDBOrders, savePaymentTransaction, getPaymentTransaction } from '@/lib/db';
import { Order } from '@/types';
import { sendEmailAsync, buildOrderStatusChangeEmail } from '@/lib/email';

export interface NormalizedPaymentWebhook {
  transactionId: string;
  amount: number;
  content: string;
  accountNumber?: string;
  gateway?: string;
  transactionDate?: string;
  rawData: any;
}

export interface PaymentWebhookAdapter {
  name: 'sepay' | 'casso';
  verifyRequest(req: Request, rawBody: string): boolean;
  parsePayload(json: any): NormalizedPaymentWebhook | null;
}

/**
 * Hàm so sánh chuỗi bảo mật với thời gian hằng định (Constant-time comparison)
 * Ngăn chặn hoàn toàn Timing Attacks
 */
export function safeCompare(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// 1. ADAPTER CHO SEPAY (https://sepay.vn)
export class SePayAdapter implements PaymentWebhookAdapter {
  name = 'sepay' as const;

  verifyRequest(req: Request, _rawBody?: string): boolean {
    const configuredApiKey = process.env.SEPAY_WEBHOOK_API_KEY || process.env.SEPAY_API_KEY;
    if (!configuredApiKey) {
      // Trong môi trường development nếu chưa cấu hình key, tạm chấp nhận để test
      if (process.env.NODE_ENV === 'development') return true;
      return false;
    }

    const authHeader = req.headers.get('authorization') || '';
    const apiKeyHeader = req.headers.get('x-api-key') || '';

    let receivedKey = '';
    if (authHeader.startsWith('Apikey ')) {
      receivedKey = authHeader.slice(7).trim();
    } else if (authHeader.startsWith('Bearer ')) {
      receivedKey = authHeader.slice(7).trim();
    } else if (apiKeyHeader) {
      receivedKey = apiKeyHeader.trim();
    }

    return safeCompare(receivedKey, configuredApiKey);
  }

  parsePayload(json: any): NormalizedPaymentWebhook | null {
    if (!json || typeof json !== 'object') return null;

    // SePay payload format: id, gateway, transactionDate, accountNumber, transferAmount, content
    const transactionId = String(json.id || json.transaction_id || '');
    const amount = Number(json.transferAmount || json.amount || 0);
    const content = String(json.content || json.description || '').trim();

    if (!transactionId || isNaN(amount) || amount <= 0) {
      return null;
    }

    return {
      transactionId,
      amount,
      content,
      accountNumber: json.accountNumber || json.subAccount,
      gateway: json.gateway,
      transactionDate: json.transactionDate,
      rawData: json,
    };
  }
}

// 2. ADAPTER CHO CASSO (https://casso.vn)
export class CassoAdapter implements PaymentWebhookAdapter {
  name = 'casso' as const;

  verifyRequest(req: Request, _rawBody?: string): boolean {
    const configuredSecureToken = process.env.CASSO_SECURE_TOKEN || process.env.CASSO_API_KEY;
    if (!configuredSecureToken) {
      if (process.env.NODE_ENV === 'development') return true;
      return false;
    }

    const secureTokenHeader = req.headers.get('secure-token') || req.headers.get('x-api-key') || '';
    return safeCompare(secureTokenHeader.trim(), configuredSecureToken);
  }

  parsePayload(json: any): NormalizedPaymentWebhook | null {
    if (!json || typeof json !== 'object') return null;

    // Casso payload format: { error: 0, data: [ { id, tid, description, amount, ... } ] }
    const record = Array.isArray(json.data) ? json.data[0] : json;
    if (!record) return null;

    const transactionId = String(record.id || record.tid || '');
    const amount = Number(record.amount || 0);
    const content = String(record.description || record.content || '').trim();

    if (!transactionId || isNaN(amount) || amount <= 0) {
      return null;
    }

    return {
      transactionId,
      amount,
      content,
      accountNumber: record.bank_sub_acc_id,
      transactionDate: record.when,
      rawData: json,
    };
  }
}

/**
 * Trích xuất mã đơn hàng từ nội dung chuyển khoản
 */
export function extractOrderCodeFromContent(content: string, existingOrders: Order[]): Order | null {
  const normalizedContent = content.toUpperCase().replace(/\s+/g, '');

  // 1. Quét tìm trực tiếp theo mã đơn hàng đã có trong hệ thống
  for (const order of existingOrders) {
    if (order.orderCode) {
      const cleanCode = order.orderCode.toUpperCase().replace(/\s+/g, '');
      if (normalizedContent.includes(cleanCode)) {
        return order;
      }
    }
    // Hoặc so khớp theo ID đơn hàng
    if (order.id && normalizedContent.includes(order.id.toUpperCase())) {
      return order;
    }
  }

  // 2. Thử bóc tách qua Regex (VD: TADA-12345, ORD-12345)
  const match = normalizedContent.match(/(?:TADA|ORD)[_-]?([A-Z0-9]+)/);
  if (match) {
    const found = existingOrders.find((o) =>
      o.orderCode?.toUpperCase().includes(match[0]) || o.id.toUpperCase().includes(match[1])
    );
    if (found) return found;
  }

  return null;
}

/**
 * Xử lý webhook thanh toán chính quy
 */
export async function processPaymentWebhook(
  normalized: NormalizedPaymentWebhook,
  provider: 'sepay' | 'casso'
): Promise<{
  success: boolean;
  status: 'paid' | 'partially_paid' | 'already_processed' | 'unmatched';
  orderCode?: string;
  message: string;
}> {
  // 1. CHỐNG REPLAY ATTACK: Kiểm tra giao dịch đã xử lý trước đó chưa
  const existingTx = getPaymentTransaction(normalized.transactionId);
  if (existingTx) {
    return {
      success: true,
      status: 'already_processed',
      orderCode: existingTx.orderCode,
      message: `Giao dịch ${normalized.transactionId} đã được xử lý trước đó (Idempotent).`,
    };
  }

  // 2. Tìm đơn hàng tương ứng
  const orders = getDBOrders();
  const matchedOrder = extractOrderCodeFromContent(normalized.content, orders);

  if (!matchedOrder) {
    // Lưu lại giao dịch không khớp để admin kiểm tra thủ công
    savePaymentTransaction({
      transactionId: normalized.transactionId,
      provider,
      amount: normalized.amount,
      content: normalized.content,
      gateway: normalized.gateway,
      accountNumber: normalized.accountNumber,
      status: 'unmatched',
      rawData: normalized.rawData,
    });

    return {
      success: false,
      status: 'unmatched',
      message: `Không tìm thấy đơn hàng khớp với nội dung: "${normalized.content}".`,
    };
  }

  // 3. Kiểm tra số tiền nhận được so với tổng giá trị đơn hàng
  const isFullyPaid = normalized.amount >= matchedOrder.total;
  const paymentStatus: Order['paymentStatus'] = isFullyPaid ? 'paid' : 'partially_paid';

  // 4. Cập nhật đơn hàng
  matchedOrder.paymentStatus = paymentStatus;
  if (isFullyPaid && (matchedOrder.status === 'pending_confirmation' || !matchedOrder.status)) {
    matchedOrder.status = 'confirmed';
    matchedOrder.statusLabel = 'Đã xác nhận & Đã thanh toán VietQR';
  }

  // Ghi nhật ký lịch sử trạng thái đơn
  if (!matchedOrder.statusHistory) matchedOrder.statusHistory = [];
  matchedOrder.statusHistory.push({
    status: matchedOrder.status,
    statusLabel: matchedOrder.statusLabel || 'Đã cập nhật',
    changedAt: new Date().toISOString(),
    note: `Webhook ${provider.toUpperCase()}: Đã nhận ${normalized.amount.toLocaleString('vi-VN')}đ (Mã GD: ${normalized.transactionId})`,
  });

  saveDBOrders(orders);

  // 5. Lưu bản ghi giao dịch
  savePaymentTransaction({
    transactionId: normalized.transactionId,
    provider,
    orderId: matchedOrder.id,
    orderCode: matchedOrder.orderCode,
    amount: normalized.amount,
    content: normalized.content,
    gateway: normalized.gateway,
    accountNumber: normalized.accountNumber,
    status: isFullyPaid ? 'success' : 'partial',
    rawData: normalized.rawData,
  });

  // 6. Gửi email thông báo cho khách hàng
  if (matchedOrder.shippingAddress?.email) {
    const note = isFullyPaid
      ? `Hệ thống TADA! Atelier đã tự động xác nhận khoản thanh toán ${normalized.amount.toLocaleString('vi-VN')}đ qua VietQR.`
      : `Hệ thống đã nhận thanh toán tạm ứng ${normalized.amount.toLocaleString('vi-VN')}đ. Số tiền còn lại: ${(matchedOrder.total - normalized.amount).toLocaleString('vi-VN')}đ.`;

    const emailContent = buildOrderStatusChangeEmail(
      matchedOrder,
      isFullyPaid ? 'Đã Thanh Toán VietQR Thành Công' : 'Đã Nhận Thanh Toán Tạm Ứng',
      note
    );

    sendEmailAsync({
      to: matchedOrder.shippingAddress.email,
      subject: `[TADA! Atelier] ${isFullyPaid ? 'Xác nhận thanh toán' : 'Thông báo nhận thanh toán'} đơn hàng ${matchedOrder.orderCode}`,
      html: emailContent.html,
      text: emailContent.text,
    });
  }

  return {
    success: true,
    status: paymentStatus,
    orderCode: matchedOrder.orderCode,
    message: isFullyPaid
      ? `Đơn hàng ${matchedOrder.orderCode} đã thanh toán đầy đủ thành công.`
      : `Đơn hàng ${matchedOrder.orderCode} đã được ghi nhận thanh toán tạm ứng một phần.`,
  };
}
