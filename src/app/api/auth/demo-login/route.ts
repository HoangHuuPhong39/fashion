import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, createUser, createServerSession, getAllUsers, saveAllUsers, StoredUser } from '@/lib/auth';
import { verifyMutationOrigin } from '@/lib/guard';

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const body = await request.json().catch(() => ({}));
    const provider = body.provider === 'facebook' ? 'facebook' : 'google';

    const testEmail = provider === 'google' 
      ? 'phongluzy0902@gmail.com' 
      : 'hoangphong.fashion@facebook.com';
    const testName = provider === 'google' 
      ? 'Hoàng Hữu Phong (Google VIP)' 
      : 'Hoàng Hữu Phong (Facebook VIP)';
    const testAvatar = provider === 'google'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

    let user = findUserByEmail(testEmail);

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const newUser = createUser({
        name: testName,
        email: testEmail,
        phone: '0901234567',
        password: randomPassword,
        role: 'customer'
      });
      user = newUser;
    }

    // Cập nhật thông tin avatar & xác thực email
    const allUsers = getAllUsers();
    const idx = allUsers.findIndex((u) => u.id === user?.id);
    if (idx !== -1) {
      allUsers[idx].avatar = testAvatar;
      allUsers[idx].emailVerified = true;
      saveAllUsers(allUsers);
      user = allUsers[idx];
    }

    // Tạo phiên đăng nhập máy chủ (Session)
    const { rawToken } = createServerSession(user as StoredUser);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '0901234567',
      role: user.role,
      avatar: user.avatar,
      twoFactorEnabled: false
    };

    const response = NextResponse.json({
      success: true,
      message: `Đăng nhập thành công với tài khoản thử nghiệm ${provider === 'google' ? 'Google' : 'Facebook'}!`,
      token: rawToken,
      user: safeUser
    });

    response.cookies.set('tada_session', rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Demo OAuth login error:', error);
    return NextResponse.json(
      { success: false, message: 'Đăng nhập thử nghiệm thất bại.' },
      { status: 500 }
    );
  }
}
