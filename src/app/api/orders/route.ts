import { NextResponse } from 'next/server';
import { getDBOrders, createDBOrder } from '@/lib/db';
import { requireUser, getSessionUser } from '@/lib/guard';

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

    // Khách hàng chỉ được xem đơn hàng của chính mình
    const userOrders = orders.filter(
      (o) => o.userId === user.id || o.shippingAddress?.email?.toLowerCase() === user.email.toLowerCase()
    );
    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải danh sách đơn hàng.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionUser = getSessionUser(request);

    // Gắn userId từ session nếu có đăng nhập
    if (sessionUser) {
      body.userId = sessionUser.id;
    }

    const result = createDBOrder(body);

    if (!result.success || !result.order) {
      return NextResponse.json(result, { status: 400 });
    }

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
