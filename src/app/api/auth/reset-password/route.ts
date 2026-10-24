import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, updateUserPassword, revokeAllUserSessions } from '@/lib/auth';
import { getPasswordResetToken, markPasswordResetTokenUsed } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: tối đa 5 lần thử / 15 phút
    const rateCheck = checkRateLimit(`reset-pwd:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã thử quá số lần quy định. Vui lòng thử lại sau.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' }, { status: 400 });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu mới phải có độ dài tối thiểu từ 6 ký tự trở lên' },
        { status: 400 }
      );
    }

    // Băm SHA-256 token gửi lên để so khớp với DB
    const tokenHash = crypto.createHash('sha256').update(String(token).trim()).digest('hex');
    const tokenRecord = getPasswordResetToken(tokenHash);

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' },
        { status: 400 }
      );
    }

    // Kiểm tra email khớp
    if (tokenRecord.email.toLowerCase() !== String(email).trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'Thông tin email không khớp với mã yêu cầu.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(tokenRecord.email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Tài khoản không tồn tại trong hệ thống.' }, { status: 404 });
    }

    // 1. Cập nhật mật khẩu mới
    updateUserPassword(user.id, newPassword);

    // 2. Đánh dấu token đã được sử dụng
    markPasswordResetTokenUsed(tokenHash);

    // 3. THU HỒI TOÀN BỘ PHIÊN ĐĂNG NHẬP CŨ ĐỂ ĐẢM BẢO AN TOÀN
    revokeAllUserSessions(user.id);

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Toàn bộ phiên đăng nhập cũ đã được thu hồi an toàn. Vui lòng đăng nhập lại.',
    });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ khi đặt lại mật khẩu' },
      { status: 500 }
    );
  }
}
