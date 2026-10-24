import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tada-fashion.vn';
  const clientId = process.env.GOOGLE_CLIENT_ID;

  // Nếu chưa cấu hình Google Client ID, báo lỗi hướng dẫn thân thiện
  if (!clientId || clientId.includes('sample')) {
    return NextResponse.json(
      {
        success: false,
        message: 'Tính năng Đăng nhập Google cần được chủ cửa hàng cấu hình GOOGLE_CLIENT_ID trong biến môi trường.'
      },
      { status: 501 }
    );
  }

  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  // 1. Tạo ngẫu nhiên state để chống CSRF
  const state = crypto.randomBytes(24).toString('hex');

  // 2. Tạo PKCE code_verifier và code_challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(authUrl.toString());

  // Lưu state và verifier vào HttpOnly cookie (hết hạn trong 10 phút)
  const oauthCookiePayload = JSON.stringify({ state, codeVerifier });
  response.cookies.set('tada_google_oauth', oauthCookiePayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600
  });

  return response;
}
