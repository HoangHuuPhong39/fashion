import { NextRequest, NextResponse } from 'next/server';
import { SePayAdapter, CassoAdapter, processPaymentWebhook } from '@/lib/payment-webhook';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const providerParam = url.searchParams.get('provider') || 'sepay';
    const rawBody = await req.text();

    let jsonPayload: any;
    try {
      jsonPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, message: 'Dữ liệu webhook không phải là JSON hợp lệ' }, { status: 400 });
    }

    const sepayAdapter = new SePayAdapter();
    const cassoAdapter = new CassoAdapter();

    // Xác định adapter dựa vào tham số hoặc cấu trúc payload
    let activeAdapter = providerParam === 'casso' ? cassoAdapter : sepayAdapter;
    let isVerified = activeAdapter.verifyRequest(req, rawBody);

    // Thử adapter còn lại nếu xác thực thất bại
    if (!isVerified) {
      const alternateAdapter = activeAdapter === sepayAdapter ? cassoAdapter : sepayAdapter;
      if (alternateAdapter.verifyRequest(req, rawBody)) {
        activeAdapter = alternateAdapter;
        isVerified = true;
      }
    }

    if (!isVerified) {
      console.warn('[Webhook Auth Failed] Chữ ký hoặc API Key webhook không hợp lệ.');
      return NextResponse.json(
        { success: false, message: 'Chữ ký hoặc API Key webhook không được cấp quyền.' },
        { status: 401 }
      );
    }

    const normalized = activeAdapter.parsePayload(jsonPayload);
    if (!normalized) {
      return NextResponse.json(
        { success: false, message: 'Cấu trúc dữ liệu webhook không nhận diện được giao dịch hợp lệ.' },
        { status: 400 }
      );
    }

    const result = await processPaymentWebhook(normalized, activeAdapter.name);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[Payment Webhook Error]', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Lỗi xử lý webhook hệ thống' },
      { status: 500 }
    );
  }
}
