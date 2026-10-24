/**
 * Cloudflare Turnstile Captcha Server-Side Verification
 */
export async function verifyTurnstileToken(
  token?: string | null,
  remoteip?: string
): Promise<{ success: boolean; message?: string }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Nếu chưa cấu hình Turnstile Secret (ví dụ ở môi trường dev/local), cho phép bypass và ghi log
  if (!secretKey) {
    return { success: true };
  }

  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      message: 'Vui lòng hoàn thành xác thực bảo mật (Cloudflare Turnstile).'
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      message: 'Xác thực bảo mật Captcha không thành công. Vui lòng tải lại và thử lại.'
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến máy chủ xác thực bảo mật.'
    };
  }
}
