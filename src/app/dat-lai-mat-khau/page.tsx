'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Mã đặt lại mật khẩu bị thiếu hoặc không hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Không thể đặt lại mật khẩu.');
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/account');
        }, 3000);
      }
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-8 sm:p-10 text-center space-y-4 shadow-sm max-w-md w-full mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#15803D] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-[#171613]">Đổi Mật Khẩu Thành Công</h2>
        <p className="text-xs text-[#747069] leading-relaxed">
          Mật khẩu của quý khách đã được cập nhật thành công. Mọi phiên đăng nhập cũ trên các thiết bị khác đã được thu hồi bảo mật.
        </p>
        <p className="text-[11px] text-[#A8A29E]">Đang chuyển hướng về trang đăng nhập trong 3 giây...</p>
        <div className="pt-2">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#171613] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#8A7158] transition-colors"
          >
            <span>Đăng Nhập Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-8 sm:p-10 space-y-6 shadow-sm max-w-md w-full mx-auto">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center mx-auto text-[#8A7158] mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613]">Thiết Lập Mật Khẩu Mới</h1>
        <p className="text-xs text-[#747069]">
          Dành cho tài khoản: <strong className="text-[#171613]">{email || 'Khách hàng Atelier'}</strong>
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl flex items-center gap-2 text-xs text-[#DC2626]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[#171613] font-semibold mb-1">Mật khẩu mới *</label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#171613] font-semibold mb-1">Xác nhận mật khẩu mới *</label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:border-[#171613] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#747069] pt-1">
          <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
          <span>Tất cả các phiên làm việc cũ sẽ tự động đăng xuất sau khi đổi.</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {isLoading ? 'Đang cập nhật...' : 'Xác Nhận Đổi Mật Khẩu'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={<div className="text-xs text-[#747069]">Đang chuẩn bị form xác thực...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
