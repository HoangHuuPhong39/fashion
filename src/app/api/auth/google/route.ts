import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL && !host.includes('localhost') && !host.includes('netlify.app')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `${proto}://${host}`;

  const clientId = process.env.GOOGLE_CLIENT_ID || '825902482314-8vg934f8g9f76a6b5n0q8l3h2k1v5t8c.apps.googleusercontent.com';
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
