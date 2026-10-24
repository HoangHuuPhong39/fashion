import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail } from '@/lib/auth';
import { saveEmailVerificationToken, verifyEmailToken } from '@/lib/db';
import { sendEmailAsync, buildEmailVerificationEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/ratelimit';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rawToken = url.searchParams.get('token');

    if (!rawToken) {
      return NextResponse.redirect(`${siteUrl}/account?verify_status=missing_token`);
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
    const result = verifyEmailToken(tokenHash);

    if (!result.success) {
      return NextResponse.redirect(`${siteUrl}/account?verify_status=invalid&message=${encodeURIComponent(result.message)}`);
    }

    return NextResponse.redirect(`${siteUrl}/account?verify_status=success`);
  } catch (error: any) {
    console.error('[Verify Email GET Error]', error);
    return NextResponse.redirect(`${siteUrl}/account?verify_status=error`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Email không hợp lệ' }, { status: 400 });
    }

    const rateCheck = checkRateLimit(`verify-email-resend:${email}`, 3, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã yêu cầu gửi quá nhiều lần. Vui lòng kiểm tra lại hộp thư hoặc thử lại sau 10 phút.' },
        { status: 429 }
      );
    }

    const user = findUserByEmail(email);
    if (user && !user.emailVerified) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

      saveEmailVerificationToken(user.id, user.email, tokenHash, expiresAt);

      const verifyUrl = `${siteUrl}/api/auth/verify-email?token=${rawToken}`;
      const emailContent = buildEmailVerificationEmail(user.email, verifyUrl);

      sendEmailAsync({
        to: user.email,
        subject: '[TADA! Atelier] Xác minh tài khoản thành viên',
        html: emailContent.html,
        text: emailContent.text,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Nếu tài khoản chưa xác minh, email hướng dẫn đã được gửi. Vui lòng kiểm tra hộp thư đến.',
    });
  } catch (error: any) {
    console.error('[Verify Email POST Error]', error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ khi gửi email xác minh' }, { status: 500 });
  }
}
