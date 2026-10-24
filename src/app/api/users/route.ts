import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/auth';
import { requireAdmin } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const users = getAllUsers();
    // Loại bỏ hoàn toàn passwordHash và thông tin nhạy cảm
    const safeUsers = users.map(({ passwordHash: _, ...rest }) => rest);
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải danh sách người dùng.' }, { status: 500 });
  }
}
