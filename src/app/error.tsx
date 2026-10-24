'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled client error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F3] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-editorial text-2xl font-medium text-[#171613]">
            Đã Xảy Ra Sự Cố Bất Ngờ
          </h2>
          <p className="text-xs text-[#747069] leading-relaxed">
            Hệ thống đang gặp trục trặc tạm thời khi tải nội dung này. Vui lòng thử tải lại hoặc quay về trang chủ.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#171613] text-[#FAF8F3] text-xs font-medium rounded-xl hover:bg-[#2C2A24] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-white border border-[#E8E4DC] text-[#171613] text-xs font-medium rounded-xl hover:bg-[#FAF8F3] transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
