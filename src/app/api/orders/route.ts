import { NextResponse } from 'next/server';
import { getDBOrders, createDBOrder } from '@/lib/db';
import { requireUser, getSessionUser, verifyMutationOrigin } from '@/lib/guard';
import { getTrustedClientIp, checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/ratelimit';
import { verifyTurnstileToken } from '@/lib/turnstile';

export async function GET(request: Request) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const orders = getDBOrders();

    // Admin được xem toàn bộ đơn hàng
    if (user.role === 'admin') {
      return NextResponse.json({ success: true, orders });
    }

    // BẢO MẬT: Khách hàng chỉ được xem đơn hàng khớp chính xác theo userId
    // TUYỆT ĐỐI KHÔNG khớp theo shippingAddress.email chưa xác minh
    const userOrders = orders.filter((o) => o.userId === user.id);
    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải danh sách đơn hàng.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const ip = getTrustedClientIp(request);
    const body = await request.json().catch(() => ({}));
    const sessionUser = getSessionUser(request);

    // 1. Rate limit tạo đơn hàng (theo IP và Email)
    const email = body.shippingAddress?.email?.trim().toLowerCase() || sessionUser?.email || '';
    const ipRateKey = `order:ip:${ip}`;
    const emailRateKey = email ? `order:email:${email}` : null;

    const ipCheck = checkRateLimit(ipRateKey, 10, 15 * 60 * 1000);
    const emailCheck = emailRateKey ? checkRateLimit(emailRateKey, 5, 15 * 60 * 1000) : { allowed: true };

    if (!ipCheck.allowed || !emailCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bạn đã thực hiện quá nhiều yêu cầu đặt hàng liên tiếp. Vui lòng thử lại sau 15 phút.'
        },
        { status: 429 }
      );
    }

    // 2. Xác thực Captcha Cloudflare Turnstile
    const turnstileCheck = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!turnstileCheck.success) {
      recordFailedAttempt(ipRateKey);
      return NextResponse.json(
        { success: false, message: turnstileCheck.message || 'Xác thực Captcha thất bại.' },
        { status: 400 }
      );
    }

    // 3. Gắn userId từ session nếu có đăng nhập
    if (sessionUser) {
      body.userId = sessionUser.id;
    }

    const result = createDBOrder(body);

    if (!result.success || !result.order) {
      recordFailedAttempt(ipRateKey);
      return NextResponse.json(result, { status: 400 });
    }

    resetRateLimit(ipRateKey);
    if (emailRateKey) resetRateLimit(emailRateKey);

    const response = NextResponse.json(result);

    // Lưu cookie recent order để người vừa tạo đơn có thể xem trang order-success trong 1 giờ
    response.cookies.set('tada_recent_order', result.order.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 // 1 giờ
    });

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi tạo đơn hàng.' }, { status: 500 });
  }
}
