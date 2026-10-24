import { NextResponse } from 'next/server';
import { updateUser } from '@/lib/auth';
import { requireUser } from '@/lib/guard';
import { ShippingAddress } from '@/types';

function sanitizeAddress(addr: any): ShippingAddress | null {
  if (!addr || typeof addr !== 'object') return null;
  const fullName = typeof addr.fullName === 'string' ? addr.fullName.trim() : '';
  const phone = typeof addr.phone === 'string' ? addr.phone.trim() : '';
  const email = typeof addr.email === 'string' ? addr.email.trim() : '';
  const address = typeof addr.address === 'string' ? addr.address.trim() : '';
  const city = typeof addr.city === 'string' ? addr.city.trim() : '';
  const district = typeof addr.district === 'string' ? addr.district.trim() : '';
  const ward = typeof addr.ward === 'string' ? addr.ward.trim() : '';
  const notes = typeof addr.notes === 'string' ? addr.notes.trim() : '';

  if (!address && !city) return null;

  return {
    fullName,
    phone,
    email,
    address,
    city,
    district,
    ward,
    notes
  };
}

export async function GET(request: Request) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;
    return NextResponse.json({ success: true, user: authCheck.user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lấy thông tin hồ sơ.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const body = await request.json().catch(() => ({}));
    const allowedUpdates: any = {};

    // Chỉ cho phép cập nhật các trường hồ sơ cá nhân an toàn
    if (typeof body.name === 'string' && body.name.trim()) {
      allowedUpdates.name = body.name.trim().slice(0, 50);
    }
    if (typeof body.phone === 'string') {
      allowedUpdates.phone = body.phone.trim().slice(0, 20);
    }
    if (typeof body.avatar === 'string') {
      allowedUpdates.avatar = body.avatar.trim();
    }
    if (typeof body.coverImage === 'string') {
      allowedUpdates.coverImage = body.coverImage.trim();
    }
    if (typeof body.bio === 'string') {
      allowedUpdates.bio = body.bio.trim().slice(0, 300);
    }

    // Kiểm tra và làm sạch danh sách địa chỉ (ShippingAddress schema)
    if (Array.isArray(body.addresses)) {
      const sanitizedAddrs: ShippingAddress[] = [];
      for (const item of body.addresses.slice(0, 10)) {
        const cleaned = sanitizeAddress(item);
        if (cleaned) sanitizedAddrs.push(cleaned);
      }
      allowedUpdates.addresses = sanitizedAddrs;
    }

    // TUYỆT ĐỐI KHÔNG cho phép sửa role, points, totalSpent, membershipTier
    delete (body as any).role;
    delete (body as any).points;
    delete (body as any).totalSpent;
    delete (body as any).membershipTier;

    // Riêng tài khoản Admin: cho phép cập nhật thông tin ngân hàng của Shop
    if (user.role === 'admin' && body.bankInfo && typeof body.bankInfo === 'object') {
      const bankInfoData = {
        bankName: String(body.bankInfo.bankName || 'MBBank').trim(),
        accountNumber: String(body.bankInfo.accountNumber || '').trim(),
        accountHolder: String(body.bankInfo.accountHolder || '').trim().toUpperCase(),
        branch: String(body.bankInfo.branch || '').trim(),
        qrCodeUrl: String(body.bankInfo.qrCodeUrl || '').trim(),
        hotline: String(body.bankInfo.hotline || '').trim()
      };
      allowedUpdates.bankInfo = bankInfoData;

      try {
        const fs = await import('fs');
        const path = await import('path');
        const settingsPath = path.join(process.cwd(), 'data', 'bank_settings.json');
        fs.writeFileSync(settingsPath, JSON.stringify(bankInfoData, null, 2), 'utf-8');
      } catch (err) {
        console.error('Failed to sync bank_settings.json', err);
      }
    }

    const updatedUser = updateUser(user.id, allowedUpdates);
    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy người dùng.' }, { status: 404 });
    }

    const { passwordHash: _, ...safeUser } = updatedUser;
    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin hồ sơ thành công!',
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi cập nhật hồ sơ.' }, { status: 500 });
  }
}
