import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyPassword,
  createServerSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getTrustedClientIp
} from '@/lib/auth';
import { verifyMutationOrigin } from '@/lib/guard';

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const ip = getTrustedClientIp(request);
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

    // 1. Kiểm tra giới hạn tần suất đăng nhập (theo cả IP và Email)
    const ipRateKey = `login:ip:${ip}`;
    const emailRateKey = `login:email:${cleanEmail}`;

    const ipCheck = checkRateLimit(ipRateKey, 10, 15 * 60 * 1000);
    const emailCheck = checkRateLimit(emailRateKey, 5, 15 * 60 * 1000);

    if (!ipCheck.allowed || !emailCheck.allowed) {
      const waitSeconds = Math.max(ipCheck.retryAfterSeconds || 0, emailCheck.retryAfterSeconds || 0) || 900;
      return NextResponse.json(
        {
          success: false,
          message: `Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${waitSeconds} giây.`
        },
        { status: 429 }
      );
    }

    // 2. Tra cứu tài khoản
    const user = findUserByEmail(cleanEmail);

    // Luôn luôn chạy verifyPassword (với dummy hash nếu user không tồn tại) để chống Timing Attack
    const isPasswordValid = verifyPassword(cleanPassword, user?.passwordHash);

    if (!user || !isPasswordValid) {
      recordFailedAttempt(ipRateKey);
      recordFailedAttempt(emailRateKey);
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // 3. Đăng nhập thành công -> Reset rate limit
    resetRateLimit(ipRateKey);
    resetRateLimit(emailRateKey);

    // 4. Tạo server session
    const { rawToken } = createServerSession(user);
    const { passwordHash: _, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công.',
      user: safeUser
    });

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
      { success: false, message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
