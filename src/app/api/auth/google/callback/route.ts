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
  const error = searchParams.get('error');

  if (error || !code || !state) {
    return NextResponse.redirect(`${siteUrl}/account?error=${encodeURIComponent(error || 'Đăng nhập Google thất bại.')}`);
  }

  // 1. Đọc và xác thực cookie OAuth State (chống CSRF)
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/tada_google_oauth=([^;]+)/);
  if (!match) {
    return NextResponse.redirect(`${siteUrl}/account?error=Phiên+xác+thực+Google+đã+hết+hạn.+Vui+lòng+thử+lại.`);
  }

  let cookieData: { state: string; codeVerifier: string };
  try {
    cookieData = JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return NextResponse.redirect(`${siteUrl}/account?error=Dữ+liệu+xác+thực+không+hợp+lệ.`);
  }

  if (!safeCompare(cookieData.state, state)) {
    return NextResponse.redirect(`${siteUrl}/account?error=Xác+thực+CSRF+thất+bại.+Vui+lòng+thử+lại.`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri = `${siteUrl}/api/auth/google/callback`;

  try {
    // 2. Trao đổi code và code_verifier lấy Access Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: cookieData.codeVerifier
      })
    });

    if (!tokenRes.ok) {
      console.error('Google token exchange error:', await tokenRes.text());
      return NextResponse.redirect(`${siteUrl}/account?error=Không+thể+đổi+mã+truy+cập+từ+Google.`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 3. Lấy thông tin người dùng từ Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${siteUrl}/account?error=Không+thể+lấy+thông+tin+từ+Google.`);
    }

    const googleUser = await userRes.json();

    // BẢO MẬT: Bắt buộc email từ Google phải được đánh dấu đã xác minh
    if (!googleUser.email || !googleUser.email_verified) {
      return NextResponse.redirect(`${siteUrl}/account?error=Email+Google+này+chưa+được+xác+minh+bảo+mật.`);
    }

    const userEmail = googleUser.email.trim().toLowerCase();
    let user = findUserByEmail(userEmail);

    if (!user) {
      // Tạo tài khoản mới cho người dùng đăng nhập bằng Google lần đầu
      const randomPassword = crypto.randomBytes(24).toString('base64');
      const newUser = createUser({
        name: googleUser.name || googleUser.given_name || 'Khách Hàng Google',
        email: userEmail,
        phone: '',
        password: randomPassword,
        role: 'customer'
      });

      // Đánh dấu email đã xác minh
      const allUsers = getAllUsers();
      const createdUser = allUsers.find((u) => u.email.toLowerCase() === userEmail);
      if (createdUser) {
        createdUser.emailVerified = true;
        if (googleUser.picture) createdUser.avatar = googleUser.picture;
        saveAllUsers(allUsers);
        user = createdUser;
      } else {
        user = newUser;
      }
    } else {
      // Cập nhật emailVerified = true nếu tài khoản đã tồn tại
      if (!user.emailVerified) {
        const allUsers = getAllUsers();
        const existing = allUsers.find((u) => u.id === user?.id);
        if (existing) {
          existing.emailVerified = true;
          if (googleUser.picture && !existing.avatar) existing.avatar = googleUser.picture;
          saveAllUsers(allUsers);
        }
      }
    }

    if (!user) {
      return NextResponse.redirect(`${siteUrl}/account?error=Lỗi+hệ+thống+khi+xác+thực+tài+khoản.`);
    }

    // 4. Tạo phiên đăng nhập máy chủ (Session)
    const { rawToken } = createServerSession(user as StoredUser);

    const redirectResponse = NextResponse.redirect(`${siteUrl}/account?token=${encodeURIComponent(rawToken)}`);

    // Lưu cookie phiên đăng nhập HttpOnly
    redirectResponse.cookies.set('tada_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 3600 // 30 ngày
    });

    // Xóa cookie oauth tạm
    redirectResponse.cookies.delete('tada_google_oauth');

    return redirectResponse;
  } catch (err) {
    console.error('Google OAuth callback fatal error:', err);
    return NextResponse.redirect(`${siteUrl}/account?error=Đã+xảy+ra+lỗi+khi+xử+lý+đăng+nhập+Google.`);
  }
}
