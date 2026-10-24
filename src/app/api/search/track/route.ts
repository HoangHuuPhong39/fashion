import { NextResponse, NextRequest } from 'next/server';
import { recordSearchEvent, getTrendingSearches } from '@/lib/db';

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
    const body = await request.json();
    const query = body.query;
    const resultsCount = typeof body.resultsCount === 'number' ? body.resultsCount : 0;
    const userId = body.userId;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    if (query && typeof query === 'string') {
      recordSearchEvent(query, resultsCount, userId, ip);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
