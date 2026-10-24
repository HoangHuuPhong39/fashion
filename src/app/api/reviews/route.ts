import { NextResponse } from 'next/server';
import { getDBReviews, addDBReview, getDBOrders } from '@/lib/db';
import { requireUser, getSessionUser, verifyMutationOrigin } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const sessionUser = getSessionUser(request);
    const isAdmin = sessionUser?.role === 'admin';

    const reviews = getDBReviews(productId);

    if (isAdmin) {
      return NextResponse.json({ success: true, reviews });
    }

    // BẢO MẬT CÔNG KHAI: Chỉ trả về đánh giá đã được duyệt (status === 'approved')
    // và TUYỆT ĐỐI KHÔNG trả userId / orderId để bảo vệ thông tin khách hàng
    const safePublicReviews = reviews
      .filter((r) => r.status === 'approved' || (!r.status && process.env.NODE_ENV === 'development'))
      .map(({ userId: _, orderId: __, ...safeReview }) => safeReview);

    return NextResponse.json({ success: true, reviews: safePublicReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải đánh giá.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const body = await request.json().catch(() => ({}));
    const { productId, rating, content, images } = body;

    const cleanProductId = typeof productId === 'string' ? productId.trim() : '';
    const numRating = Number(rating);
    const cleanContent = typeof content === 'string' ? content.trim() : '';

    if (!cleanProductId || !numRating || numRating < 1 || numRating > 5 || !cleanContent) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng chọn số sao (1-5) và nhập nội dung nhận xét.' },
        { status: 400 }
      );
    }

    // BẢO MẬT: Chỉ khớp đơn theo userId, TUYỆT ĐỐI KHÔNG khớp theo shippingAddress.email chưa xác minh
    const orders = getDBOrders();
    const deliveredOrders = orders.filter(
      (o) => o.userId === user.id && o.status === 'delivered'
    );

    const matchingOrder = deliveredOrders.find((o) =>
      o.items.some((item) => item.productId === cleanProductId)
    );

    if (!matchingOrder && user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công qua tài khoản này.'
        },
        { status: 403 }
      );
    }

    // Mặc định đánh giá ở trạng thái 'pending' để quản trị viên kiểm duyệt
    const reviewStatus = user.role === 'admin' ? 'approved' : 'pending';

    const safeImages = Array.isArray(images)
      ? images.filter((img) => typeof img === 'string' && (img.startsWith('/uploads/') || img.startsWith('https://')))
      : [];

    const newReview = addDBReview({
      productId: cleanProductId,
      userId: user.id,
      orderId: matchingOrder?.orderCode || matchingOrder?.id,
      author: user.name || 'Khách hàng',
      rating: numRating,
      content: cleanContent,
      images: safeImages,
      status: reviewStatus
    });

    return NextResponse.json({
      success: true,
      message:
        user.role === 'admin'
          ? 'Đánh giá đã được đăng thành công.'
          : 'Cảm ơn bạn! Đánh giá đã được gửi và sẽ hiển thị sau khi quản trị viên phê duyệt.',
      review: newReview
    });
  } catch (error) {
    console.error('Error posting review:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi gửi đánh giá.' }, { status: 500 });
  }
}
