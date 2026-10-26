'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Copy, Check, Lock, Smartphone, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth, getAuthHeaders } from '@/context/AuthContext';

export const SecurityTab: React.FC = () => {
  const { user } = useAuth();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trạng thái tắt 2FA
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableError, setDisableError] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(!!user?.twoFactorEnabled);

  const startSetup = async () => {
    setIsSubmitting(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST', headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        setSetupData({ secret: data.secret, otpauthUrl: data.otpauthUrl });
        setIsSettingUp(true);
      } else {
        setVerifyError(data.message || 'Không thể khởi tạo cấu hình 2FA.');
      }
    } catch {
      setVerifyError('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim() || !setupData) return;
    setIsSubmitting(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          token: verifyCode.trim(),
          secret: setupData.secret
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIs2FAEnabled(true);
        setIsSettingUp(false);
        setBackupCodes(data.backupCodes || []);
        setVerifySuccess('Đã kích hoạt xác thực 2 lớp (2FA) thành công!');
      } else {
        setVerifyError(data.message || 'Mã xác thực không hợp lệ.');
      }
    } catch {
      setVerifyError('Lỗi kết nối khi xác thực 2FA.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) return;
    setIsSubmitting(true);
    setDisableError('');
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ password: disablePassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIs2FAEnabled(false);
        setShowDisableModal(false);
        setDisablePassword('');
        setVerifySuccess('Đã tắt xác thực 2 lớp thành công.');
      } else {
        setDisableError(data.message || 'Mật khẩu xác nhận không đúng.');
      }
    } catch {
      setDisableError('Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBackupCodes = () => {
    if (backupCodes.length === 0) return;
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const qrImageUrl = setupData?.otpauthUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.otpauthUrl)}`
    : '';

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8A7158]" />
            <h2 className="font-editorial text-xl font-semibold text-[#171613]">
              Bảo Mật Hai Lớp Quản Trị (TOTP 2FA)
            </h2>
          </div>
          <p className="text-xs text-[#747069] mt-1">
            Bảo vệ tài khoản quản trị bằng mã 6 số thay đổi mỗi 30 giây (Google Authenticator, Authy, Apple Passwords).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {is2FAEnabled ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              ĐÃ BẬT 2FA
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              CHƯA KÍCH HOẠT
            </span>
          )}
        </div>
      </div>

      {verifySuccess && (
        <div className="p-4 bg-[#ECFDF5] border border-[#86EFAC] rounded-xl text-xs text-[#065F46] font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-[#15803D]" />
          <span>{verifySuccess}</span>
        </div>
      )}

      {/* HIỂN THỊ MÃ DỰ PHÒNG VỪA SINH */}
      {backupCodes.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E8D7BD] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#171613]">
              <Lock className="w-4 h-4 text-[#8A7158]" />
              <span>MÃ SAO LƯU DỰ PHÒNG (DÙNG 1 LẦN DUY NHẤT)</span>
            </div>
            <button
              onClick={copyBackupCodes}
              className="px-3 py-1 bg-white hover:bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg text-xs font-semibold text-[#171613] flex items-center gap-1 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Đã sao chép' : 'Sao chép 8 mã'}</span>
            </button>
          </div>
          <p className="text-[11px] text-[#747069]">
            Lưu lại các mã này ở nơi an toàn. Mỗi mã chỉ dùng để đăng nhập khẩn cấp 1 lần khi bạn bị mất điện thoại.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
            {backupCodes.map((code, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-[#E8E4DC] text-center font-bold text-[#171613]">
                {code}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRẠNG THÁI CHƯA CÓ 2FA HOẶC ĐANG CÀI ĐẶT */}
      {!is2FAEnabled && !isSettingUp && (
        <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-[#E8E4DC] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-sm font-bold text-[#171613]">
              Tăng cường phòng vệ cấp Atelier cho Shop
            </h3>
            <p className="text-xs text-[#747069]">
              Khi kích hoạt, mọi lần đăng nhập admin đều yêu cầu mật khẩu kết hợp mã xác thực 6 số trên ứng dụng điện thoại. Ngăn chặn triệt để nguy cơ lộ mật khẩu.
            </p>
          </div>

          <button
            onClick={startSetup}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Kích hoạt 2FA ngay</span>
          </button>
        </div>
      )}

      {/* BƯỚC THIẾT LẬP 2FA: QUÉT MÃ QR & NHẬP MÃ KIỂM TRA */}
      {isSettingUp && setupData && (
        <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-[#E8D7BD] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#171613]">
              Bước 1: Quét mã QR hoặc nhập khóa thủ công vào ứng dụng
            </h3>
            <button
              onClick={() => setIsSettingUp(false)}
              className="text-xs text-[#747069] hover:text-[#171613]"
            >
              Hủy bỏ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Cột QR code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#E8E4DC] shadow-2xs">
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="Mã QR TOTP"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-44 h-44 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  Đang tạo QR...
                </div>
              )}
              <span className="text-[10px] text-[#747069] mt-2">Dùng Google Authenticator để quét</span>
            </div>

            {/* Cột Khóa bí mật & Nhập mã xác minh */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#747069] block mb-1">
                  Nếu không quét được QR, nhập mã khóa này:
                </span>
                <div className="bg-white p-2.5 rounded-lg border border-[#E8E4DC] font-mono font-bold text-sm text-[#8A7158] tracking-widest break-all select-all">
                  {setupData.secret}
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#171613] block mb-1">
                    Bước 2: Nhập mã 6 số hiển thị trên ứng dụng
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-[#E8E4DC] rounded-lg py-2.5 px-3 text-center font-mono font-bold text-lg tracking-widest text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                {verifyError && (
                  <p className="text-[11px] text-red-600 font-semibold">{verifyError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || verifyCode.length !== 6}
                  className="w-full py-2.5 bg-[#171613] hover:bg-[#8A7158] disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Đang xác minh...' : 'Xác minh và Kích hoạt'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TRƯỜNG HỢP ĐÃ BẬT 2FA -> NÚT TẮT */}
      {is2FAEnabled && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E4DC] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#171613]">Xác thực 2 lớp đang bảo vệ tài khoản</div>
            <div className="text-[11px] text-[#747069]">Tài khoản admin an toàn trước tấn công rò rỉ mật khẩu.</div>
          </div>

          <button
            onClick={() => setShowDisableModal(true)}
            className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
          >
            Tắt xác thực 2 lớp
          </button>
        </div>
      )}

      {/* MODAL XÁC NHẬN TẮT 2FA */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Xác nhận tắt xác thực 2 lớp</h3>
            </div>
            <p className="text-xs text-[#747069]">
              Hành động này sẽ làm giảm mức độ an toàn của tài khoản quản trị. Vui lòng nhập mật khẩu đăng nhập để xác nhận:
            </p>

            <form onSubmit={handleDisable} className="space-y-3">
              <input
                type="password"
                placeholder="Mật khẩu tài khoản admin"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
              />

              {disableError && <p className="text-[11px] text-red-600 font-bold">{disableError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="px-3.5 py-2 border border-[#E8E4DC] rounded-lg text-xs font-medium text-[#747069]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !disablePassword}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận tắt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
