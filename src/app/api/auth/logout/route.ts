import { NextResponse } from 'next/server';
import { deleteServerSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/tada_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (rawToken) {
      deleteServerSession(rawToken);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công.'
    });

    response.cookies.set('tada_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi đăng xuất.' },
      { status: 500 }
    );
  }
}
