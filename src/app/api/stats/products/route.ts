import { NextResponse } from 'next/server';
import { getRealProductStats } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const stats = getRealProductStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting product stats:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải thống kê.' }, { status: 500 });
  }
}
