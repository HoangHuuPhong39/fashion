import { NextResponse } from 'next/server';
import { saveStockNotification, getProductById } from '@/lib/db';
import { getTrustedClientIp, checkRateLimit } from '@/lib/ratelimit';
import { verifyMutationOrigin } from '@/lib/guard';

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const ip = getTrustedClientIp(request);
    const ipRateKey = `stock-notif:ip:${ip}`;
    const rateCheck = checkRateLimit(ipRateKey, 5, 10 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bạn đã đăng ký quá nhiều lần liên tiếp. Vui lòng thử lại sau 10 phút.'
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { productId, color, size, email } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Mã sản phẩm không hợp lệ.' },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy sản phẩm.' },
        { status: 404 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không đúng định dạng.' },
        { status: 400 }
      );
    }

    const result = saveStockNotification({
      productId: product.id,
      productName: product.name,
      color: color ? String(color).trim() : undefined,
      size: size ? String(size).trim() : undefined,
      email: cleanEmail
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in notify-stock API:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đăng ký nhận thông báo.' },
      { status: 500 }
    );
  }
}
