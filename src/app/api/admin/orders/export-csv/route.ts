import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { getDBOrders } from '@/lib/db';

/**
 * Xử lý chống tấn công CSV Injection (Formula Injection / CWE-1236)
 * Nếu ô dữ liệu bắt đầu bằng một trong các ký tự nguy hiểm (=, +, -, @, \t, \r)
 * thì bắt buộc thêm dấu nháy đơn (') ở đầu để ngăn Excel / Sheets tự ý thực thi mã.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Chống CSV Injection
  const firstChar = str.charAt(0);
  if (['=', '+', '-', '@', '\t', '\r'].includes(firstChar)) {
    str = `'${str}`;
  }

  // Escape dấu ngoặc kép đôi
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

export async function GET(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const orders = getDBOrders();

    const headers = [
      'Mã Đơn Hàng',
      'Ngày Đặt',
      'Khách Hàng',
      'Số Điện Thoại',
      'Email',
      'Địa Chỉ',
      'Tỉnh/Thành',
      'Tổng Số Lượng',
      'Tạm Tính',
      'Phí Ship',
      'Giảm Giá',
      'Tổng Tiền (VNĐ)',
      'Phương Thức',
      'Trạng Thái Đơn',
      'Thanh Toán'
    ];

    const rows = orders.map((o) => {
      const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);
      return [
        sanitizeCsvCell(o.orderCode || o.id),
        sanitizeCsvCell(o.createdAt || ''),
        sanitizeCsvCell(o.shippingAddress?.fullName || 'Khách Vãng Lai'),
        sanitizeCsvCell(o.shippingAddress?.phone || ''),
        sanitizeCsvCell(o.shippingAddress?.email || ''),
        sanitizeCsvCell(o.shippingAddress?.address || ''),
        sanitizeCsvCell(o.shippingAddress?.city || ''),
        sanitizeCsvCell(totalQty),
        sanitizeCsvCell(o.subtotal),
        sanitizeCsvCell(o.shippingFee),
        sanitizeCsvCell(o.discountAmount),
        sanitizeCsvCell(o.total),
        sanitizeCsvCell(o.paymentMethod.toUpperCase()),
        sanitizeCsvCell(o.statusLabel || o.status),
        sanitizeCsvCell(o.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN')
      ].join(',');
    });

    // Thêm UTF-8 BOM (\uFEFF) để Excel hiển thị tiếng Việt không bị lỗi font
    const csvContent = '\uFEFF' + [headers.map(sanitizeCsvCell).join(','), ...rows].join('\r\n');

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `tada_orders_${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error exporting orders CSV:', error);
    return NextResponse.json({ success: false, message: 'Lỗi xuất dữ liệu CSV.' }, { status: 500 });
  }
}
