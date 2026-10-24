import { NextResponse, NextRequest } from 'next/server';
import { recordProductView } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.productId;
    const userId = body.userId;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    if (productId && typeof productId === 'string') {
      recordProductView(productId, userId, ip);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
