import { NextResponse } from 'next/server';
import { requireAdmin, verifyMutationOrigin } from '@/lib/guard';
import { disableUserTwoFactor, findUserById } from '@/lib/auth';
import { recordAdminAuditLog } from '@/lib/audit';
import { getTrustedClientIp } from '@/lib/ratelimit';
import bcrypt from 'bcryptjs';

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
    const { password } = body;

    const storedUser = findUserById(user.id);
    if (!storedUser || !password) {
      return NextResponse.json({ success: false, message: 'Yêu cầu mật khẩu xác thực.' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(String(password), storedUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Mật khẩu không chính xác.' }, { status: 401 });
    }

    disableUserTwoFactor(user.id);

    recordAdminAuditLog({
      action: '2fa_disabled',
      entity: 'user',
      entityId: user.id,
      performedBy: user.name,
      ipHash: getTrustedClientIp(request),
      details: { note: 'Quản trị viên đã tắt tính năng xác thực 2 lớp.' }
    });

    return NextResponse.json({ success: true, message: 'Đã tắt xác thực 2 lớp thành công.' });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tắt 2FA.' }, { status: 500 });
  }
}
