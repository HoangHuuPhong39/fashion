import { NextResponse } from 'next/server';
import { requireAdmin, verifyMutationOrigin } from '@/lib/guard';
import { generateTotpSecret } from '@/lib/totp';

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;
    const secret = generateTotpSecret();
    const issuer = encodeURIComponent('TADA! Atelier');
    const account = encodeURIComponent(user.email);
    const otpauthUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;

    return NextResponse.json({
      success: true,
      secret,
      otpauthUrl
    });
  } catch (error) {
    console.error('Error in 2FA setup:', error);
    return NextResponse.json({ success: false, message: 'Lỗi thiết lập 2FA.' }, { status: 500 });
  }
}
