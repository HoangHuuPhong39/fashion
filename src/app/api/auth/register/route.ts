import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  createUser,
  createServerSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getTrustedClientIp,
  verifyPassword
} from '@/lib/auth';
import { verifyMutationOrigin } from '@/lib/guard';

// Regex chuẩn
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const ip = getTrustedClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { name, email, phone, password } = body;

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim().replace(/[\s.-]/g, '') : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    // 1. Giới hạn tần suất đăng ký (theo IP)
    const rateLimitKey = `register:ip:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bạn đã thực hiện quá nhiều thao tác đăng ký. Vui lòng thử lại sau ${rateCheck.retryAfterSeconds || 900} giây.`
        },
        { status: 429 }
      );
    }

    // 2. Kiểm tra dữ liệu bắt buộc
    if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền đầy đủ họ tên, email, số điện thoại và mật khẩu.' },
        { status: 400 }
      );
    }

    if (cleanName.length < 2 || cleanName.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Họ và tên phải từ 2 đến 50 ký tự.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không đúng định dạng.' },
        { status: 400 }
      );
    }

    if (!VN_PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại không hợp lệ (hỗ trợ các đầu số di động Việt Nam: 03, 05, 07, 08, 09).' },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(cleanPassword)) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất một chữ cái và một chữ số.' },
        { status: 400 }
      );
    }

    // 3. Kiểm tra trùng lặp email - BẢO MẬT: Không tiết lộ email đã tồn tại để chống dò quét tài khoản
    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      // Giả lập thời gian băm mật khẩu để không thể đo lường thời gian
      verifyPassword(cleanPassword, undefined);
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json({
        success: true,
        message: 'Thông tin đăng ký đã được ghi nhận. Nếu bạn đã có tài khoản, vui lòng đăng nhập.',
        accountNotice: true
      });
    }

    // 4. Tạo tài khoản mới - Luôn gán role 'customer'
    const newUser = createUser({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPassword,
      role: 'customer'
    });

    resetRateLimit(rateLimitKey);

    // 5. Tạo server session
    const { rawToken } = createServerSession(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    const response = NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Chào mừng bạn gia nhập TADA! Privilege.',
      user: safeUser
    });

    response.cookies.set('tada_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
