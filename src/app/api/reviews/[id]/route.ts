import { NextResponse } from 'next/server';
import { updateReviewStatus } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Trạng thái đánh giá không hợp lệ.' },
        { status: 400 }
      );
    }

    const ok = updateReviewStatus(id, status);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đánh giá.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái đánh giá thành công.' });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật đánh giá.' }, { status: 500 });
  }
}
