import { NextResponse } from 'next/server';
import { createConciergeRequest, getAllConciergeRequests, lookupConciergeRequest } from '@/lib/db';
import { getTrustedClientIp, checkRateLimit } from '@/lib/ratelimit';
import { getSessionUser, verifyMutationOrigin } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const contact = searchParams.get('contact');

    // 1. Tra cứu công khai yêu cầu Concierge
    if (code && contact) {
      const found = lookupConciergeRequest(code, contact);
      if (!found) {
        return NextResponse.json(
          {
            success: false,
            message: 'Không tìm thấy yêu cầu Concierge phù hợp. Vui lòng kiểm tra lại mã yêu cầu và SĐT/Email.'
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, request: found });
    }

    // 2. Quản trị viên xem toàn bộ danh sách
    const sessionUser = getSessionUser(request);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Yêu cầu quyền Quản trị viên để xem danh sách tổng hợp.' },
        { status: 403 }
      );
    }

    const all = getAllConciergeRequests();
    return NextResponse.json({ success: true, requests: all });
  } catch (error) {
    console.error('Error in GET /api/concierge:', error);
    return NextResponse.json({ success: false, message: 'Lỗi tải dữ liệu Concierge.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const ip = getTrustedClientIp(request);
    const rateCheck = checkRateLimit(`concierge:ip:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Bạn đã gửi quá nhiều yêu cầu Concierge. Vui lòng thử lại sau 15 phút.'
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      customerName,
      phone,
      email,
      serviceType = 'international_order',
      productLink,
      productName,
      images,
      size,
      color,
      notes,
      budgetVND
    } = body;

    if (!customerName || !phone || !email || !productName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng điền đầy đủ họ tên, số điện thoại, email và tên sản phẩm/dịch vụ cần order.'
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không hợp lệ.' },
        { status: 400 }
      );
    }

    const result = createConciergeRequest({
      customerName: String(customerName),
      phone: String(phone),
      email: String(email),
      serviceType: serviceType === 'bespoke_tailoring' ? 'bespoke_tailoring' : 'international_order',
      productLink: productLink ? String(productLink) : undefined,
      productName: String(productName),
      images: Array.isArray(images) ? images : [],
      size: size ? String(size) : undefined,
      color: color ? String(color) : undefined,
      notes: notes ? String(notes) : undefined,
      budgetVND: budgetVND ? Number(budgetVND) : undefined
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/concierge:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi tạo yêu cầu Concierge.' },
      { status: 500 }
    );
  }
}
