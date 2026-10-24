import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin, verifyMutationOrigin } from '@/lib/guard';
import { recordAdminAuditLog } from '@/lib/audit';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'bank_settings.json');

// BẢO MẬT: Tuyệt đối không hard-code số tài khoản và tên chủ tài khoản thật vào mã nguồn
const DEFAULT_BANK_INFO = {
  bankName: 'MBBank',
  accountNumber: '',
  accountHolder: '',
  branch: '',
  hotline: process.env.NEXT_PUBLIC_HOTLINE || '0366861159'
};

function getShopBankSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      if (data && typeof data === 'object') return { ...DEFAULT_BANK_INFO, ...data };
    }
  } catch (error) {
    console.error('Error reading bank_settings.json:', error);
  }
  return DEFAULT_BANK_INFO;
}

export async function GET() {
  try {
    const bankInfo = getShopBankSettings();
    return NextResponse.json({ success: true, bankInfo });
  } catch (error) {
    console.error('Error getting bank info:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải thông tin thanh toán.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));
    const updated = {
      bankName: body.bankName || 'MBBank',
      accountNumber: String(body.accountNumber || '').trim(),
      accountHolder: String(body.accountHolder || '').trim().toUpperCase(),
      branch: String(body.branch || '').trim(),
      hotline: String(body.hotline || process.env.NEXT_PUBLIC_HOTLINE || '').trim()
    };

    if (!updated.accountNumber || !updated.accountHolder) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp số tài khoản và tên chủ tài khoản.' },
        { status: 400 }
      );
    }

    const dataDir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    recordAdminAuditLog({
      action: 'bank_settings_update',
      entity: 'bank_settings',
      entityId: 'vietqr_primary',
      performedBy: authCheck.user.email || authCheck.user.name,
      details: {
        bankName: updated.bankName,
        accountHolder: updated.accountHolder,
        accountNumberMasked: '***' + updated.accountNumber.slice(-4)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tài khoản nhận thanh toán VietQR thành công.',
      bankInfo: updated
    });
  } catch (error) {
    console.error('Error updating bank info:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi cập nhật thông tin thanh toán.' }, { status: 500 });
  }
}
