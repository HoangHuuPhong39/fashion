import { NextResponse } from 'next/server';
import { verifySessionToken } from './auth';
import { User } from '@/types';

/**
 * Trích xuất User từ session cookie 'tada_session'.
 * Trả về null nếu không có token hoặc token không hợp lệ/hết hạn.
 */
export function getSessionUser(request: Request): User | null {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/tada_session=([^;]+)/);
    const rawToken = match ? match[1] : null;

    if (!rawToken) return null;

    const { valid, user } = verifySessionToken(rawToken);
    return valid && user ? user : null;
  } catch (err) {
    console.error('getSessionUser error:', err);
    return null;
  }
}

/**
 * Yêu cầu người dùng phải đăng nhập (bất kể vai trò).
 * Trả về HTTP 401 nếu chưa đăng nhập.
 */
export function requireUser(request: Request): { user: User; errorResponse?: never } | { user?: never; errorResponse: NextResponse } {
  const user = getSessionUser(request);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập để thực hiện thao tác này.' },
        { status: 401 }
      )
    };
  }
  return { user };
}

/**
 * Yêu cầu quyền Quản trị viên (role === 'admin').
 * Trả về HTTP 401 nếu chưa đăng nhập và HTTP 403 nếu không đủ quyền.
 */
export function requireAdmin(request: Request): { user: User; errorResponse?: never } | { user?: never; errorResponse: NextResponse } {
  const user = getSessionUser(request);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: 'Vui lòng đăng nhập với tài khoản quản trị viên.' },
        { status: 401 }
      )
    };
  }
  if (user.role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: 'Bạn không có quyền thực hiện thao tác quản trị này.' },
        { status: 403 }
      )
    };
  }
  return { user };
}
