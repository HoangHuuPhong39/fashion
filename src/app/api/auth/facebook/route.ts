import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL && !host.includes('localhost') && !host.includes('netlify.app')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `${proto}://${host}`;

  const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1458294721639028';
  const redirectUri = `${siteUrl}/api/auth/facebook/callback`;

  // 1. Tạo ngẫu nhiên state để chống tấn công CSRF
  const state = crypto.randomBytes(24).toString('hex');

  // 2. Chuyển hướng người dùng sang trang đăng nhập Facebook chính thức
  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', 'email,public_profile');
  authUrl.searchParams.set('response_type', 'code');

  const response = NextResponse.redirect(authUrl.toString());

  // Lưu state vào HttpOnly cookie để đối soát an toàn khi Facebook redirect về
  response.cookies.set('tada_fb_oauth', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600
  });

  return response;
}
