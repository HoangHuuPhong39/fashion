import { NextResponse } from 'next/server';
import { updateConciergeStatus } from '@/lib/db';
import { requireAdmin, verifyMutationOrigin } from '@/lib/guard';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, note, quotedPrice, depositAmount } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Thiếu trạng thái cập nhật.' },
        { status: 400 }
      );
    }

    const result = updateConciergeStatus(id, status, note, quotedPrice, depositAmount);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Error updating concierge status:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi cập nhật yêu cầu Concierge.' },
      { status: 500 }
    );
  }
}
