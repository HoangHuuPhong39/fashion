import { NextResponse } from 'next/server';
import {
  verifySessionToken,
  findUserById,
  verifyPassword,
  hashPassword,
  updateUser,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp
} from '@/lib/auth';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// TODO: Triển khai tính năng quên mật khẩu qua email (gửi token xác thực qua SMTP / Resend)

export async function PUT(request: Request) {
  try {
    const ip = getClientIp(request);
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/tada_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    const { valid, user } = verifySessionToken(rawToken);
    if (!valid || !user) {
      return NextResponse.json(
        { success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    const cleanCurrent = typeof currentPassword === 'string' ? currentPassword : '';
    const cleanNew = typeof newPassword === 'string' ? newPassword : '';

    if (!cleanCurrent || !cleanNew) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' },
        { status: 400 }
      );
    }

    // Giới hạn tần suất đổi mật khẩu để chống brute force mật khẩu cũ
    const rateLimitKey = `password_change:${user.id}:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bạn đã nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau ${rateCheck.retryAfterSeconds || 900} giây.`
        },
        { status: 429 }
      );
    }

    const storedUser = findUserById(user.id);
    if (!storedUser || !storedUser.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy thông tin tài khoản.' },
        { status: 404 }
      );
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentValid = verifyPassword(cleanCurrent, storedUser.passwordHash);
    if (!isCurrentValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: 'Mật khẩu hiện tại không chính xác.' },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(cleanNew)) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu mới phải có tối thiểu 8 ký tự, bao gồm ít nhất một chữ cái và một chữ số.' },
        { status: 400 }
      );
    }

    if (cleanCurrent === cleanNew) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.' },
        { status: 400 }
      );
    }

    // Cập nhật mật khẩu băm mới
    updateUser(user.id, {
      passwordHash: hashPassword(cleanNew)
    });

    resetRateLimit(rateLimitKey);

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
