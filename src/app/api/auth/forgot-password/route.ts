import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail } from '@/lib/auth';
import { savePasswordResetToken } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';
import { sendEmailAsync, buildPasswordResetEmail } from '@/lib/email';
import { verifyTurnstileToken } from '@/lib/turnstile';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

// Phản hồi hằng định chuẩn bảo mật chống rò rỉ danh tính
const CONSTANT_SUCCESS_RESPONSE = {
  success: true,
  message: 'Nếu địa chỉ email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến hoặc mục thư rác (Spam).',
};

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate limit theo IP (tối đa 5 yêu cầu / 15 phút)
    const ipLimit = checkRateLimit(`forgot-pwd-ip:${ip}`, 5, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const email = String(body.email || '').trim().toLowerCase();
    const turnstileToken = body.turnstileToken;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập địa chỉ email hợp lệ' }, { status: 400 });
    }

    // 2. Chống bot bằng Cloudflare Turnstile nếu có gửi token
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
      if (!turnstileValid) {
        return NextResponse.json({ success: false, message: 'Xác thực chống bot không thành công.' }, { status: 400 });
      }
    }

    // 3. Rate limit theo Email (tối đa 3 yêu cầu / 15 phút)
    const emailLimit = checkRateLimit(`forgot-pwd-email:${email}`, 3, 15 * 60 * 1000);
    if (!emailLimit.allowed) {
      // Vẫn trả về thông báo chung để không lộ trạng thái
      return NextResponse.json(CONSTANT_SUCCESS_RESPONSE, { status: 200 });
    }

    // 4. Tìm kiếm tài khoản
    const user = findUserByEmail(email);
    if (user) {
      // Tạo token ngẫu nhiên 32-byte hex
      const rawToken = crypto.randomBytes(32).toString('hex');
      // Băm SHA-256 để lưu vào cơ sở dữ liệu (không lưu token thô)
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      // Thời hạn: 30 phút
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      savePasswordResetToken(user.email, tokenHash, expiresAt);

      const resetUrl = `${siteUrl}/dat-lai-mat-khau?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
      const emailContent = buildPasswordResetEmail(user.email, resetUrl);

      sendEmailAsync({
        to: user.email,
        subject: '[TADA! Atelier] Hướng dẫn đặt lại mật khẩu tài khoản',
        html: emailContent.html,
        text: emailContent.text,
      });
    }

    // Luôn trả về phản hồi đồng nhất
    return NextResponse.json(CONSTANT_SUCCESS_RESPONSE, { status: 200 });
  } catch (error: any) {
    console.error('[Forgot Password Error]', error);
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra trong quá trình xử lý yêu cầu' },
      { status: 500 }
    );
  }
}
