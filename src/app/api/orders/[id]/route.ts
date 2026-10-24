import { NextResponse } from 'next/server';
import { getOrderById, updateDBOrderStatus } from '@/lib/db';
import { getSessionUser, requireUser } from '@/lib/guard';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng.' }, { status: 404 });
    }

    const user = getSessionUser(request);

    // 1. Quản trị viên luôn có quyền xem
    if (user && user.role === 'admin') {
      return NextResponse.json({ success: true, order });
    }

    // 2. Chủ sở hữu đơn hàng (đã đăng nhập và trùng userId hoặc email)
    if (user && (order.userId === user.id || order.shippingAddress?.email?.toLowerCase() === user.email.toLowerCase())) {
      return NextResponse.json({ success: true, order });
    }

    // 3. Khách vừa đặt hàng xong (kiểm tra cookie recent order trong vòng 1 giờ)
    const cookieHeader = request.headers.get('cookie') || '';
    const recentMatch = cookieHeader.match(/tada_recent_order=([^;]+)/);
    if (recentMatch && (recentMatch[1] === order.id || recentMatch[1] === order.orderCode)) {
      return NextResponse.json({ success: true, order });
    }

    // 4. Tra cứu công khai: Yêu cầu cung cấp đúng mã đơn VÀ (số điện thoại HOẶC email) khớp với đơn hàng
    const { searchParams } = new URL(request.url);
    const lookupPhone = searchParams.get('phone')?.trim().replace(/[\s.-]/g, '');
    const lookupEmail = searchParams.get('email')?.trim().toLowerCase();

    const orderPhone = (order.shippingAddress?.phone || '').replace(/[\s.-]/g, '');
    const orderEmail = (order.shippingAddress?.email || '').toLowerCase();

    const phoneMatches = lookupPhone && orderPhone && lookupPhone === orderPhone;
    const emailMatches = lookupEmail && orderEmail && lookupEmail === orderEmail;

    if (phoneMatches || emailMatches) {
      return NextResponse.json({ success: true, order });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Bạn không có quyền xem đơn hàng này. Để tra cứu công khai, vui lòng nhập chính xác mã đơn và số điện thoại hoặc email đặt hàng.'
      },
      { status: 403 }
    );
  } catch (error) {
    console.error('Error getting order by id:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải thông tin đơn hàng.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng.' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { status, note, paymentStatus } = body;

    const isOwner = order.userId === user.id || order.shippingAddress?.email?.toLowerCase() === user.email.toLowerCase();
    const isAdmin = user.role === 'admin';

    // Khách chỉ được hủy đơn của chính mình khi đơn đang ở trạng thái 'pending_confirmation'
    if (!isAdmin) {
      if (!isOwner) {
        return NextResponse.json(
          { success: false, message: 'Bạn không có quyền thao tác trên đơn hàng này.' },
          { status: 403 }
        );
      }
      if (status !== 'cancelled') {
        return NextResponse.json(
          { success: false, message: 'Khách hàng chỉ có quyền yêu cầu hủy đơn hàng.' },
          { status: 403 }
        );
      }
      if (order.status !== 'pending_confirmation') {
        return NextResponse.json(
          { success: false, message: 'Đơn hàng đã được xác nhận hoặc đang chuẩn bị, không thể hủy qua website.' },
          { status: 400 }
        );
      }
    }

    // performedBy LẤY TRỰC TIẾP TỪ SESSION, tuyệt đối không nhận từ client body
    const performedBy = isAdmin ? `Quản trị viên (${user.name})` : `Khách Hàng (${user.name})`;
    const targetStatus = status || order.status;
    const targetPaymentStatus = isAdmin ? paymentStatus : undefined;

    const result = updateDBOrderStatus(id, targetStatus, note, performedBy, targetPaymentStatus);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi cập nhật đơn hàng.' }, { status: 500 });
  }
}
