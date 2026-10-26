import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, createUser, createServerSession, getAllUsers, saveAllUsers, StoredUser } from '@/lib/auth';

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a || '', 'utf-8');
  const bufB = Buffer.from(b || '', 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL && !host.includes('localhost') && !host.includes('netlify.app')
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `${proto}://${host}`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error') || searchParams.get('error_description');

  if (error || !code || !state) {
    return NextResponse.redirect(`${siteUrl}/account?error=${encodeURIComponent(error || 'Đăng nhập Facebook bị hủy hoặc thất bại.')}`);
  }

  // 1. Xác thực CSRF state từ cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/tada_fb_oauth=([^;]+)/);
  if (!match || !safeCompare(decodeURIComponent(match[1]), state)) {
    return NextResponse.redirect(`${siteUrl}/account?error=Xác+thực+CSRF+Facebook+thất+bại.+Vui+lòng+thử+lại.`);
  }

  const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1458294721639028';
  const appSecret = process.env.FACEBOOK_APP_SECRET || '';
  const redirectUri = `${siteUrl}/api/auth/facebook/callback`;

  try {
    // 2. Trao đổi mã code lấy Access Token từ Facebook Graph API
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    if (!tokenRes.ok) {
      console.error('Facebook token exchange error:', await tokenRes.text());
      return NextResponse.redirect(`${siteUrl}/account?error=Không+thể+đổi+mã+truy+cập+từ+Facebook.`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 3. Lấy thông tin tài khoản Facebook của người dùng
    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
    );
    if (!profileRes.ok) {
      return NextResponse.redirect(`${siteUrl}/account?error=Không+thể+lấy+thông+tin+tài+khoản+Facebook.`);
    }

    const fbUser = await profileRes.json();
    const userEmail = (fbUser.email || `fb_${fbUser.id}@facebook.user`).toLowerCase().trim();
    let user = findUserByEmail(userEmail);

    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString('base64');
      const newUser = createUser({
        name: fbUser.name || 'Khách Hàng Facebook',
        email: userEmail,
        phone: '',
        password: randomPassword,
        role: 'customer'
      });

      const allUsers = getAllUsers();
      const created = allUsers.find((u) => u.email.toLowerCase() === userEmail);
      if (created) {
        created.emailVerified = true;
        if (fbUser.picture?.data?.url) created.avatar = fbUser.picture.data.url;
        saveAllUsers(allUsers);
        user = created;
      } else {
        user = newUser;
      }
    }

    if (!user) {
      return NextResponse.redirect(`${siteUrl}/account?error=Lỗi+hệ+thống+khi+tạo+tài+khoản+Facebook.`);
    }

    // 4. Tạo server session và chuyển hướng với token
    const { rawToken } = createServerSession(user as StoredUser);

    const redirectResponse = NextResponse.redirect(`${siteUrl}/account?token=${encodeURIComponent(rawToken)}`);

    redirectResponse.cookies.set('tada_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600
    });

    redirectResponse.cookies.delete('tada_fb_oauth');

    return redirectResponse;
  } catch (err) {
    console.error('Facebook OAuth error:', err);
    return NextResponse.redirect(`${siteUrl}/account?error=Đã+xảy+ra+lỗi+khi+xử+lý+đăng+nhập+Facebook.`);
  }
}
