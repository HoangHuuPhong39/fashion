import { NextResponse } from 'next/server';
import { adjustProductStock } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function POST(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));
    const { productId, variantId, change, type, reason, orderId } = body;

    if (!productId || typeof change !== 'number' || isNaN(change)) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin sản phẩm hoặc số lượng điều chỉnh không hợp lệ.' },
        { status: 400 }
      );
    }

    const result = adjustProductStock(
      productId,
      variantId,
      change,
      type || 'manual_adjust',
      reason || 'Điều chỉnh kho thủ công',
      authCheck.user.name || 'Quản trị viên',
      orderId
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi điều chỉnh tồn kho.' },
      { status: 500 }
    );
  }
}
