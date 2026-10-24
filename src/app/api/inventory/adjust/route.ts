import { NextResponse } from 'next/server';
import { adjustProductStock, getPendingStockNotifications, markStockNotificationsSent, getProductById } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';
import { sendEmailAsync, buildBackInStockEmail } from '@/lib/email';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

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

    // TỰ ĐỘNG GỬI EMAIL THÔNG BÁO CHO KHÁCH HÀNG "BÁO KHI CÓ HÀNG" KHI TỒN > 0
    if (change > 0 && result.updatedProduct && result.updatedProduct.stockCount > 0) {
      const pendingList = getPendingStockNotifications(productId);
      if (pendingList.length > 0) {
        const prod = getProductById(productId);
        const prodUrl = `${siteUrl}/product/${prod?.slug || productId}`;
        const sentIds: string[] = [];

        for (const notif of pendingList) {
          const emailData = buildBackInStockEmail(
            notif.productName || prod?.name || 'Sản phẩm Atelier',
            prodUrl,
            notif.color,
            notif.size
          );
          sendEmailAsync({
            to: notif.email,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text
          });
          sentIds.push(notif.id);
        }

        if (sentIds.length > 0) {
          markStockNotificationsSent(sentIds);
        }
      }
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
