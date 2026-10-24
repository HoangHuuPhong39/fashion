import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyPassword,
  createServerSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = typeof password === 'string' ? password : '';

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu.' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra giới hạn tần suất đăng nhập (IP + Email)
    const rateLimitKey = `login:${ip}:${cleanEmail}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${rateCheck.retryAfterSeconds || 900} giây.`
        },
        { status: 429 }
      );
    }

    // 2. Tra cứu tài khoản
    const user = findUserByEmail(cleanEmail);

    // Không tiết lộ tài khoản có tồn tại hay không để chống account enumeration
    if (!user || !user.passwordHash) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // 3. BẮT BUỘC kiểm tra mật khẩu bằng bcrypt (cho cả khách và admin)
    const isPasswordValid = verifyPassword(cleanPassword, user.passwordHash);
    if (!isPasswordValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    // Đăng nhập thành công -> Xóa bộ đếm sai
    resetRateLimit(rateLimitKey);

    // 4. Tạo phiên làm việc máy chủ (token hash SHA-256)
    const { rawToken } = createServerSession(user);

    const { passwordHash: _, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      message: `Đăng nhập thành công! Chào mừng ${safeUser.name}.`,
      user: safeUser
      // Tuyệt đối không trả token trong body JSON
    });

    // 5. Thiết lập Cookie HttpOnly bảo mật
    response.cookies.set('tada_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600 // 30 ngày
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
