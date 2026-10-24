import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  createUser,
  createServerSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  getClientIp
} from '@/lib/auth';

// Regex chuẩn:
// Email định dạng hợp lệ
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Số điện thoại Việt Nam: 10 chữ số, bắt đầu bằng 0 hoặc +84 và đầu số 3, 5, 7, 8, 9
const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
// Mật khẩu: tối thiểu 8 ký tự, có ít nhất một chữ cái và một chữ số
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json().catch(() => ({}));
    const { name, email, phone, password } = body;

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim().replace(/[\s.-]/g, '') : '';
    const cleanPassword = typeof password === 'string' ? password : '';

    // 1. Giới hạn tần suất đăng ký (IP)
    const rateLimitKey = `register:${ip}`;
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

    // 3. Kiểm tra trùng lặp email
    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { success: false, message: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.' },
        { status: 400 }
      );
    }

    // 4. Tạo tài khoản mới - Luôn gán role 'customer', KHÔNG nhận role từ client
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
      // Không trả token trong body
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
