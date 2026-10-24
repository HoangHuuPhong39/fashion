import { NextResponse, NextRequest } from 'next/server';
import { recordSearchEvent, getTrendingSearches } from '@/lib/db';
import { getSessionUser, verifyMutationOrigin } from '@/lib/guard';
import { getTrustedClientIp, hashIp, checkRateLimit } from '@/lib/ratelimit';

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 8;
    const trending = getTrendingSearches(limit);
    return NextResponse.json({ success: true, trending });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const rawIp = getTrustedClientIp(request);

    // Rate limit: Tối đa 30 lượt track tìm kiếm mỗi phút trên mỗi IP
    const rateCheck = checkRateLimit(`search_track:${rawIp}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, message: 'Too many search requests' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const query = typeof body.query === 'string' ? body.query.trim().slice(0, 100) : '';
    const resultsCount = typeof body.resultsCount === 'number' ? Math.max(0, Math.min(10000, body.resultsCount)) : 0;

    // BẢO MẬT: Lấy userId từ Session đã xác thực, KHÔNG tin cậy userId từ client body
    const sessionUser = getSessionUser(request);
    const userId = sessionUser?.id || undefined;

    // BẢO MẬT: Băm IP bằng HMAC SHA-256 để bảo vệ quyền riêng tư, không lưu IP thô
    const anonymizedIp = hashIp(rawIp);

    if (query) {
      recordSearchEvent(query, resultsCount, userId, anonymizedIp);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
