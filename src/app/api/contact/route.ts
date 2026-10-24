import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveContactMessage } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendEmailAsync } from '@/lib/email';

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().trim().email('Địa chỉ email không hợp lệ').max(100),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(200),
  message: z.string().trim().min(10, 'Nội dung tin nhắn tối thiểu 10 ký tự').max(2000),
  turnstileToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: Tối đa 3 tin nhắn / 10 phút từ cùng 1 IP
    const rateCheck = checkRateLimit(`contact-ip:${ip}`, 3, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã gửi tin nhắn liên tục. Vui lòng chờ vài phút trước khi gửi tiếp.' },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => null);
    const parsed = contactSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // Chống spam bằng Cloudflare Turnstile nếu có token
    if (data.turnstileToken) {
      const isValid = await verifyTurnstileToken(data.turnstileToken, ip);
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Xác thực chống bot không thành công.' }, { status: 400 });
      }
    }

    // Lưu vào database
    const saved = saveContactMessage({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      ipHash: ip ? require('crypto').createHash('sha256').update(ip).digest('hex').slice(0, 16) : undefined,
    });

    // Thông báo cho admin qua email
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tada.vn';
    sendEmailAsync({
      to: adminEmail,
      subject: `[TADA! Liên Hệ Mới] ${data.subject} - Từ ${data.fullName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #171613;">
          <h2 style="color: #8A7158; margin-top: 0;">Khách hàng gửi liên hệ mới từ Website</h2>
          <p><strong>Người gửi:</strong> ${data.fullName} (${data.email})</p>
          <p><strong>Số điện thoại:</strong> ${data.phone || 'Chưa cung cấp'}</p>
          <p><strong>Tiêu đề:</strong> ${data.subject}</p>
          <div style="background: #FAF8F3; border-left: 3px solid #8A7158; padding: 12px 16px; margin: 16px 0;">
            ${data.message.replace(/\n/g, '<br />')}
          </div>
          <p style="font-size: 11px; color: #747069;">Thời gian gửi: ${new Date().toLocaleString('vi-VN')}</p>
        </div>
      `,
      text: `LIÊN HỆ MỚI:\nTừ: ${data.fullName} (${data.email})\nSĐT: ${data.phone}\nTiêu đề: ${data.subject}\nNội dung: ${data.message}`,
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      message: 'Tin nhắn của bạn đã được gửi thành công đến đội ngũ TADA! Atelier. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
    });
  } catch (error: any) {
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi tiếp nhận tin nhắn liên hệ' },
      { status: 500 }
    );
  }
}
