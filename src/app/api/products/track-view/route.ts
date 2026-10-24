import { NextResponse, NextRequest } from 'next/server';
import { recordProductView } from '@/lib/db';
import { getSessionUser, verifyMutationOrigin } from '@/lib/guard';
import { getTrustedClientIp, hashIp, checkRateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const rawIp = getTrustedClientIp(request);

    // Rate limit: Tối đa 60 lượt track xem sản phẩm mỗi phút trên mỗi IP
    const rateCheck = checkRateLimit(`product_view_track:${rawIp}`, 60, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, message: 'Too many view requests' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const productId = typeof body.productId === 'string' ? body.productId.trim() : '';

    // BẢO MẬT: Lấy userId từ Session đã xác thực, KHÔNG tin cậy userId từ body
    const sessionUser = getSessionUser(request);
    const userId = sessionUser?.id || undefined;

    // BẢO MẬT: Băm IP bằng HMAC SHA-256
    const anonymizedIp = hashIp(rawIp);

    if (productId) {
      recordProductView(productId, userId, anonymizedIp);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
