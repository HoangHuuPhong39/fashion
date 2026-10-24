import { NextResponse } from 'next/server';
import { getDBInventoryLogs } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const logs = getDBInventoryLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching inventory logs:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải lịch sử biến động kho.' },
      { status: 500 }
    );
  }
}
