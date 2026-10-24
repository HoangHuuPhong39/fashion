import { Resend } from 'resend';
import { Order } from '@/types';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const DEFAULT_FROM = process.env.EMAIL_FROM || 'TADA! Atelier <noreply@tada-fashion.vn>';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!resend) {
      console.log('----------------------------------------------------');
      console.log(`[EMAIL DISPATCH - DEV SIMULATION MODE]`);
      console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Preview: ${options.text?.slice(0, 150) || 'HTML Email Body'}`);
      console.log('----------------------------------------------------');
      return { success: true, id: `mock-${Date.now()}` };
    }

    const { data, error } = await resend.emails.send({
      from: options.from || DEFAULT_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[SendEmail Exception]', err);
    return { success: false, error: err?.message || 'Lỗi gửi email không xác định' };
  }
}

// Bọc bất đồng bộ an toàn: không chờ đợi, không block tiến trình xử lý đơn hàng
export function sendEmailAsync(options: SendEmailOptions): void {
  setImmediate(() => {
    sendEmail(options).catch((err) => {
      console.error('[Background Email Failed]', err);
    });
  });
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// ==========================================
// 1. TEMPLATE: EMAIL XÁC NHẬN ĐƠN HÀNG
// ==========================================
export function buildOrderConfirmationEmail(order: Order): { subject: string; html: string; text: string } {
  const customerName = order.shippingAddress?.fullName || 'Quý khách';
  const orderCode = order.orderCode || `#${order.id}`;
  const trackingUrl = `${siteUrl}/order-info?code=${encodeURIComponent(orderCode)}&email=${encodeURIComponent(order.shippingAddress?.email || '')}`;
  const subject = `Xác nhận đơn hàng ${orderCode} - TADA! Fashion Atelier`;

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E8E4DC; font-size: 13px; color: #171613;">
        <strong>${item.productName}</strong><br />
        <span style="font-size: 11px; color: #747069;">Màu: ${item.color} | Size: ${item.size} | SL: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #E8E4DC; font-size: 13px; text-align: right; font-weight: bold; color: #171613;">
        ${formatVND(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  const isVietQR = order.paymentMethod === 'vietqr';
  const paymentInstructionsHtml = isVietQR
    ? `
    <div style="background-color: #FFFDF9; border: 1px solid #C7A66A; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 14px; color: #8A7158; text-transform: uppercase;">
        HƯỚNG DẪN CHUYỂN KHOẢN VIETQR TỰ ĐỘNG
      </h3>
      <p style="font-size: 12px; margin: 4px 0; color: #171613;">
        Quý khách vui lòng quét mã QR hoặc chuyển khoản chính xác nội dung bên dưới để hệ thống kích hoạt đơn ngay lập tức:
      </p>
      <ul style="font-size: 12px; margin: 8px 0; padding-left: 20px; color: #171613;">
        <li>Ngân hàng: <strong>MBBank (Ngân hàng Quân Đội)</strong></li>
        <li>Số tài khoản: <strong>0366861159</strong></li>
        <li>Chủ tài khoản: <strong>TADA FASHION ATELIER</strong></li>
        <li>Số tiền: <strong style="color: #B83A3A;">${formatVND(order.total)}</strong></li>
        <li>Nội dung chuyển khoản: <strong style="background: #E8D7BD; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${orderCode}</strong></li>
      </ul>
      <p style="font-size: 11px; color: #747069; margin-top: 8px;">
        * Đơn hàng sẽ được giữ chỗ trong vòng 24 giờ. Sau khi thanh toán thành công, hệ thống tự động gửi email xác nhận.
      </p>
    </div>
  `
    : `
    <div style="background-color: #FAF8F3; border: 1px solid #E8E4DC; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 12px; color: #747069;">
      Phương thức thanh toán: <strong>Thanh toán tiền mặt khi nhận hàng (COD)</strong>. Quý khách vui lòng chuẩn bị số tiền <strong>${formatVND(order.total)}</strong> khi nhân viên bưu tá giao hàng.
    </div>
  `;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác nhận đơn hàng ${orderCode}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #171613;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F3; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E4DC; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td style="background-color: #171613; padding: 28px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 4px; color: #FAF8F3; font-family: Georgia, serif;">
                TADA! FASHION ATELIER
              </h1>
              <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; color: #C7A66A; text-transform: uppercase;">
                Contemporary Ready-to-Wear &amp; Bespoke
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="font-size: 18px; color: #171613; margin-top: 0; font-family: Georgia, serif;">
                Cảm ơn ${customerName} đã đồng hành cùng TADA!
              </h2>
              <p style="font-size: 13px; line-height: 1.6; color: #747069; margin: 12px 0;">
                Đơn hàng <strong>${orderCode}</strong> đã được ghi nhận vào hệ thống của chúng tôi vào lúc ${new Date(order.createdAt).toLocaleString('vi-VN')}. Đội ngũ atelier đang chuẩn bị các thiết kế tốt nhất dành riêng cho bạn.
              </p>

              <!-- Payment Box -->
              ${paymentInstructionsHtml}

              <!-- Items Table -->
              <h3 style="font-size: 14px; text-transform: uppercase; color: #171613; margin: 24px 0 8px; border-bottom: 2px solid #171613; padding-bottom: 6px;">
                Chi tiết đơn hàng
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                ${itemsHtml}
                <tr>
                  <td style="padding: 8px; font-size: 12px; color: #747069;">Tạm tính:</td>
                  <td style="padding: 8px; font-size: 12px; text-align: right; color: #171613;">${formatVND(order.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-size: 12px; color: #747069;">Phí vận chuyển:</td>
                  <td style="padding: 8px; font-size: 12px; text-align: right; color: #171613;">${order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</td>
                </tr>
                ${order.discountAmount > 0 ? `
                <tr>
                  <td style="padding: 8px; font-size: 12px; color: #15803D;">Giảm giá Voucher / VIP:</td>
                  <td style="padding: 8px; font-size: 12px; text-align: right; color: #15803D;">-${formatVND(order.discountAmount)}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 12px 8px; font-size: 15px; font-weight: bold; color: #171613; border-top: 2px solid #E8E4DC;">TỔNG THANH TOÁN:</td>
                  <td style="padding: 12px 8px; font-size: 16px; font-weight: bold; color: #B83A3A; text-align: right; border-top: 2px solid #E8E4DC;">${formatVND(order.total)}</td>
                </tr>
              </table>

              <!-- Shipping Info -->
              <div style="background-color: #FAF8F3; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 12px; line-height: 1.6; color: #171613;">
                <strong>Địa chỉ giao nhận hàng:</strong><br />
                ${order.shippingAddress?.fullName} &bull; ${order.shippingAddress?.phone}<br />
                ${order.shippingAddress?.address}, ${order.shippingAddress?.ward ? order.shippingAddress.ward + ', ' : ''}${order.shippingAddress?.district ? order.shippingAddress.district + ', ' : ''}${order.shippingAddress?.city}
              </div>

              <!-- Button CTA -->
              <div style="text-align: center; margin: 28px 0 12px;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #171613; color: #FFFFFF; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase;">
                  Tra Cứu Tiến Trình Đơn Hàng &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F3; border-top: 1px solid #E8E4DC; padding: 20px 24px; text-align: center; font-size: 11px; color: #747069; line-height: 1.6;">
              TADA! Fashion Atelier &bull; Hotline: 0366 861 159 &bull; Email: contact@tada-fashion.vn<br />
              Nếu có bất kỳ thắc mắc nào, quý khách chỉ cần phản hồi trực tiếp email này.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
XÁC NHẬN ĐƠN HÀNG ${orderCode} - TADA! FASHION ATELIER

Xin chào ${customerName},
Cảm ơn bạn đã đặt hàng tại TADA! Fashion Atelier.
Mã đơn hàng của bạn là: ${orderCode}
Tổng giá trị thanh toán: ${formatVND(order.total)}
Phương thức: ${isVietQR ? 'Chuyển khoản VietQR' : 'COD'}

${isVietQR ? `HƯỚNG DẪN VIETQR:
Ngân hàng: MBBank (Ngân hàng Quân Đội)
STK: 0366861159
Chủ TK: TADA FASHION ATELIER
Nội dung: ${orderCode}
Số tiền: ${formatVND(order.total)}` : ''}

Tra cứu tiến trình đơn hàng tại: ${trackingUrl}
Hotline hỗ trợ: 0366 861 159
  `.trim();

  return { subject, html, text };
}

// ==========================================
// 2. TEMPLATE: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
// ==========================================
export function buildOrderStatusChangeEmail(
  order: Order,
  newStatusLabel: string,
  note?: string
): { subject: string; html: string; text: string } {
  const orderCode = order.orderCode || `#${order.id}`;
  const trackingUrl = `${siteUrl}/order-info?code=${encodeURIComponent(orderCode)}&email=${encodeURIComponent(order.shippingAddress?.email || '')}`;
  const subject = `Cập nhật trạng thái đơn hàng ${orderCode}: ${newStatusLabel}`;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Cập nhật trạng thái đơn ${orderCode}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif; color: #171613;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E4DC; overflow: hidden;">
          <tr>
            <td style="background-color: #171613; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 3px; color: #FAF8F3; font-family: Georgia, serif;">
                TADA! FASHION ATELIER
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <span style="font-size: 11px; color: #8A7158; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                THÔNG BÁO VẬN HÀNH
              </span>
              <h2 style="font-size: 18px; margin: 8px 0 16px; color: #171613;">
                Đơn hàng ${orderCode} chuyển sang: <span style="color: #15803D;">${newStatusLabel}</span>
              </h2>
              <p style="font-size: 13px; line-height: 1.6; color: #747069;">
                Kính gửi quý khách, hệ thống TADA! Atelier xin thông báo đơn hàng của quý khách đã được cập nhật trạng thái mới nhất.
              </p>
              ${note ? `
              <div style="background-color: #FAF8F3; border-left: 3px solid #8A7158; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #171613;">
                <strong>Ghi chú từ xưởng:</strong> ${note}
              </div>` : ''}

              <div style="text-align: center; margin: 24px 0 12px;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #171613; color: #FFFFFF; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
                  Xem chi tiết tiến trình &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
THÔNG BÁO TỪ TADA! ATELIER
Đơn hàng ${orderCode} của bạn đã chuyển sang trạng thái: ${newStatusLabel}
${note ? `Ghi chú: ${note}\n` : ''}
Tra cứu tại: ${trackingUrl}
  `.trim();

  return { subject, html, text };
}

// ==========================================
// 3. TEMPLATE: ĐẶT LẠI MẬT KHẨU
// ==========================================
export function buildPasswordResetEmail(email: string, resetUrl: string): { subject: string; html: string; text: string } {
  const subject = 'Đặt lại mật khẩu tài khoản TADA! Atelier';
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Đặt lại mật khẩu TADA! Atelier</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E4DC; overflow: hidden;">
          <tr>
            <td style="background-color: #171613; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 3px; color: #FAF8F3; font-family: Georgia, serif;">
                TADA! FASHION ATELIER
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="font-size: 16px; margin-top: 0; color: #171613;">Yêu cầu đặt lại mật khẩu</h2>
              <p style="font-size: 13px; line-height: 1.6; color: #747069;">
                Chúng tôi vừa nhận được yêu cầu cấp lại mật khẩu cho tài khoản <strong>${email}</strong>.
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #747069;">
                Liên kết này có hiệu lực trong <strong>30 phút</strong> và chỉ sử dụng được <strong>một lần duy nhất</strong>:
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #171613; color: #FFFFFF; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px;">
                  Đặt Lại Mật Khẩu &rarr;
                </a>
              </div>
              <p style="font-size: 11px; color: #A8A29E; line-height: 1.5; margin-top: 24px; border-top: 1px solid #E8E4DC; pt: 16px;">
                Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn vẫn được bảo mật an toàn tuyệt đối.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
YÊU CẦU ĐẶT LẠI MẬT KHẨU TADA! ATELIER
Truy cập liên kết sau trong vòng 30 phút để thiết lập mật khẩu mới:
${resetUrl}

Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
  `.trim();

  return { subject, html, text };
}

// ==========================================
// 4. TEMPLATE: XÁC MINH EMAIL TÀI KHOẢN
// ==========================================
export function buildEmailVerificationEmail(email: string, verifyUrl: string): { subject: string; html: string; text: string } {
  const subject = 'Xác minh địa chỉ email tài khoản TADA! Atelier';
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Xác minh email tài khoản TADA!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F3; font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E8E4DC; overflow: hidden;">
          <tr>
            <td style="background-color: #171613; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 3px; color: #FAF8F3; font-family: Georgia, serif;">
                TADA! FASHION ATELIER
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <h2 style="font-size: 16px; margin-top: 0; color: #171613;">Chào mừng bạn đến với TADA! Atelier</h2>
              <p style="font-size: 13px; line-height: 1.6; color: #747069;">
                Vui lòng bấm nút xác minh bên dưới để kích hoạt tài khoản <strong>${email}</strong> và đồng bộ toàn bộ lịch sử đơn hàng của bạn:
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background-color: #171613; color: #FFFFFF; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px;">
                  Xác Minh Email Ngay &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
CHÀO MỪNG ĐẾN VỚI TADA! ATELIER
Vui lòng truy cập liên kết sau để xác minh tài khoản của bạn:
${verifyUrl}
  `.trim();

  return { subject, html, text };
}
