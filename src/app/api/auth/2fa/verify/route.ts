import { NextResponse } from 'next/server';
import { requireAdmin, verifyMutationOrigin } from '@/lib/guard';
import { verifyTotpCode, generateBackupCodes } from '@/lib/totp';
import { enableUserTwoFactor } from '@/lib/auth';
import { recordAdminAuditLog } from '@/lib/audit';
import { getTrustedClientIp } from '@/lib/ratelimit';

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const body = await request.json().catch(() => ({}));
    const { token, secret } = body;

    if (!token || !secret) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp mã 6 số và khóa bí mật.' },
        { status: 400 }
      );
    }

    const isValid = verifyTotpCode(String(token).trim(), String(secret).trim());
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Mã xác thực TOTP không chính xác hoặc đã hết hạn.' },
        { status: 400 }
      );
    }

    // Sinh 8 mã sao lưu dự phòng
    const { plainCodes, hashedCodes } = generateBackupCodes();
    enableUserTwoFactor(user.id, String(secret).trim(), hashedCodes);

    // Ghi nhật ký Audit Log
    recordAdminAuditLog({
      action: '2fa_enabled',
      entity: 'user',
      entityId: user.id,
      performedBy: user.name,
      ipHash: getTrustedClientIp(request),
      details: { note: 'Quản trị viên đã kích hoạt thành công xác thực 2 lớp TOTP.' }
    });

    return NextResponse.json({
      success: true,
      message: 'Kích hoạt xác thực 2 lớp (2FA) thành công!',
      backupCodes: plainCodes
    });
  } catch (error) {
    console.error('Error in 2FA verify:', error);
    return NextResponse.json({ success: false, message: 'Lỗi xác minh 2FA.' }, { status: 500 });
  }
}
