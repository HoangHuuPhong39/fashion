import { NextResponse } from 'next/server';
import { verifySessionToken } from './auth';
import { User } from '@/types';

/**
 * CSRF Protection: Kiểm tra Origin / Host header cho mọi API ghi dữ liệu (POST, PUT, DELETE, PATCH).
 */
export function verifyMutationOrigin(request: Request): { valid: boolean; errorResponse?: NextResponse } {
  const method = request.method?.toUpperCase();
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const referer = request.headers.get('referer');

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (host) {
        const hostWithoutPort = host.split(':')[0];
        const originHostWithoutPort = originUrl.hostname;
        if (
          originHostWithoutPort === hostWithoutPort ||
          originUrl.host === host ||
          originHostWithoutPort === 'localhost' ||
          originHostWithoutPort === '127.0.0.1' ||
          (process.env.NEXT_PUBLIC_SITE_URL && originUrl.origin === process.env.NEXT_PUBLIC_SITE_URL)
        ) {
          return { valid: true };
        }
        return {
          valid: false,
          errorResponse: NextResponse.json(
            { success: false, message: 'Yêu cầu bị từ chối do nguồn gốc không hợp lệ (Origin CSRF Protection).' },
            { status: 403 }
          )
        };
      }
    } catch {
      return {
        valid: false,
        errorResponse: NextResponse.json(
          { success: false, message: 'Nguồn gốc yêu cầu không hợp lệ.' },
          { status: 403 }
        )
      };
    }
  }

  if (referer && host) {
    try {
      const refererUrl = new URL(referer);
      const hostWithoutPort = host.split(':')[0];
      if (
        refererUrl.hostname === hostWithoutPort ||
        refererUrl.host === host ||
        refererUrl.hostname === 'localhost' ||
        refererUrl.hostname === '127.0.0.1' ||
        (process.env.NEXT_PUBLIC_SITE_URL && refererUrl.origin === process.env.NEXT_PUBLIC_SITE_URL)
      ) {
        return { valid: true };
      }
      return {
        valid: false,
        errorResponse: NextResponse.json(
          { success: false, message: 'Yêu cầu bị từ chối do Referer không hợp lệ (CSRF Protection).' },
          { status: 403 }
        )
      };
    } catch {}
  }

  return { valid: true };
}

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
 * Kiểm tra cả CSRF Origin trên các request thay đổi dữ liệu.
 */
export function requireUser(request: Request): { user: User; errorResponse?: never } | { user?: never; errorResponse: NextResponse } {
  const originCheck = verifyMutationOrigin(request);
  if (!originCheck.valid && originCheck.errorResponse) {
    return { errorResponse: originCheck.errorResponse };
  }

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
 */
export function requireAdmin(request: Request): { user: User; errorResponse?: never } | { user?: never; errorResponse: NextResponse } {
  const originCheck = verifyMutationOrigin(request);
  if (!originCheck.valid && originCheck.errorResponse) {
    return { errorResponse: originCheck.errorResponse };
  }

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
