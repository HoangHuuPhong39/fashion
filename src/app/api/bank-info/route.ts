import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/guard';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'bank_settings.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

const DEFAULT_BANK_INFO = {
  bankName: 'MBBank',
  accountNumber: '0366861159',
  accountHolder: 'HOANG HUU PHONG',
  branch: 'Chi nhánh TP. Hồ Chí Minh',
  hotline: '0366861159'
};

function getShopBankSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
      if (data && data.accountNumber) return data;
    }
    // Fallback sang thông tin ngân hàng của admin trong users.json nếu có
    if (fs.existsSync(USERS_FILE)) {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      const admin = users.find((u: any) => u.role === 'admin' && u.bankInfo?.accountNumber);
      if (admin?.bankInfo) return admin.bankInfo;
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
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));
    const updated = {
      bankName: body.bankName || 'MBBank',
      accountNumber: String(body.accountNumber || '').trim(),
      accountHolder: String(body.accountHolder || '').trim().toUpperCase(),
      branch: String(body.branch || '').trim(),
      hotline: String(body.hotline || '').trim()
    };

    if (!updated.accountNumber || !updated.accountHolder) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng điền số tài khoản và tên chủ tài khoản.' },
        { status: 400 }
      );
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return NextResponse.json({ success: true, message: 'Cập nhật tài khoản ngân hàng thành công!', bankInfo: updated });
  } catch (error) {
    console.error('Error saving bank info:', error);
    return NextResponse.json({ success: false, message: 'Không thể lưu thông tin tài khoản ngân hàng.' }, { status: 500 });
  }
}
