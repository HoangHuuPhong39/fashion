import { NextResponse } from 'next/server';
import { getDBReviews, addDBReview, getDBOrders } from '@/lib/db';
import { requireUser } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const reviews = getDBReviews(productId);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải đánh giá.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const body = await request.json().catch(() => ({}));
    const { productId, rating, content, images, orderId } = body;

    const cleanProductId = typeof productId === 'string' ? productId.trim() : '';
    const numRating = Number(rating);
    const cleanContent = typeof content === 'string' ? content.trim() : '';

    if (!cleanProductId || !numRating || numRating < 1 || numRating > 5 || !cleanContent) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng chọn số sao (1-5) và nhập nội dung nhận xét.' },
        { status: 400 }
      );
    }

    // Kiểm tra xem người dùng đã từng mua sản phẩm này trong một đơn hàng đã giao thành công (delivered) chưa
    const orders = getDBOrders();
    const deliveredOrders = orders.filter(
      (o) => (o.userId === user.id || o.shippingAddress?.email?.toLowerCase() === user.email.toLowerCase()) &&
             o.status === 'delivered'
    );

    const matchingOrder = deliveredOrders.find((o) =>
      o.items.some((item) => item.productId === cleanProductId)
    );

    if (!matchingOrder && user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công.'
        },
        { status: 403 }
      );
    }

    // Mặc định đánh giá của khách hàng ở trạng thái 'pending' để quản trị viên kiểm duyệt
    const reviewStatus = user.role === 'admin' ? 'approved' : 'pending';

    const result = addDBReview({
      productId: cleanProductId,
      userId: user.id,
      author: user.name || 'Khách Hàng',
      rating: numRating,
      content: cleanContent,
      images: Array.isArray(images) ? images.slice(0, 5) : [],
      orderId: orderId || matchingOrder?.orderCode || matchingOrder?.id,
      status: reviewStatus,
      date: new Date().toLocaleDateString('vi-VN')
    });

    return NextResponse.json({
      success: true,
      message: user.role === 'admin'
        ? 'Đã đăng đánh giá thành công!'
        : 'Cảm ơn bạn đã đánh giá! Nhận xét của bạn đang được duyệt và sẽ hiển thị sớm.',
      review: result.review
    });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi gửi đánh giá.' },
      { status: 500 }
    );
  }
}
