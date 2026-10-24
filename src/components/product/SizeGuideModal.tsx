'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Ruler, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SizeGuide } from '@/types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  productId?: string;
  productName?: string;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  category,
  productId,
  productName
}: SizeGuideModalProps) {
  const [guide, setGuide] = useState<SizeGuide | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'calculator'>('table');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [calcResult, setCalcResult] = useState<{
    size: string;
    fitNote: string;
    confidence: 'high' | 'medium';
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Tải dữ liệu bảng size từ API server
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const fetchGuide = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (productId) params.set('productId', productId);

        const res = await fetch(`/api/size-guide?${params.toString()}`);
        if (res.ok && active) {
          const data = await res.json();
          if (data.success && data.guide) {
            setGuide(data.guide);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải bảng size:', err);
      }
    };

    void fetchGuide();
    return () => {
      active = false;
    };
  }, [isOpen, category, productId]);

  // Quản lý Accessibility: Focus Trap và phím Escape
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus vào nút đầu tiên khi mở modal
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstBtn = modalRef.current.querySelector<HTMLElement>('button');
        firstBtn?.focus();
      }
    }, 50);

    // Chặn cuộn trang nền khi mở modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Tính toán gợi ý size dựa trên bảng số đo của shop
  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h < 130 || h > 205 || w < 35 || w > 130) {
      return;
    }

    if (!guide || !guide.measurements || guide.measurements.length === 0) {
      setCalcResult(null);
      return;
    }

    // Thuật toán so khớp với dải cân nặng & chiều cao được lưu trong DB
    const parseRange = (val?: string): [number, number] | null => {
      if (!val) return null;
      const parts = val.split('-').map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
      }
      return null;
    };

    let bestMatch = guide.measurements.find((m) => {
      const hr = parseRange(m.heightRange);
      const wr = parseRange(m.weightRange);
      return hr && wr && h >= hr[0] && h <= hr[1] && w >= wr[0] && w <= wr[1];
    });

    // Nếu không khớp chính xác dải cả hai, tìm theo khoảng cách cân nặng
    if (!bestMatch) {
      const sorted = [...guide.measurements].sort((a, b) => {
        const wrA = parseRange(a.weightRange);
        const wrB = parseRange(b.weightRange);
        const avgWa = wrA ? (wrA[0] + wrA[1]) / 2 : 50;
        const avgWb = wrB ? (wrB[0] + wrB[1]) / 2 : 50;
        return Math.abs(w - avgWa) - Math.abs(w - avgWb);
      });
      bestMatch = sorted[0];
      setCalcResult({
        size: bestMatch?.size || 'M',
        fitNote: 'Kích cỡ được ước lượng theo cân nặng. Nếu bạn thích mặc rộng thoải mái (oversized), hãy cân nhắc tăng thêm 1 size.',
        confidence: 'medium'
      });
    } else {
      setCalcResult({
        size: bestMatch.size,
        fitNote: 'Số đo của bạn hoàn toàn nằm trong chuẩn form may đo sẵn của Atelier Tada cho size này.',
        confidence: 'high'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#FAF8F3] border border-[#E8E4DC] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-[#8A7158]">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h2 id="size-guide-modal-title" className="font-editorial text-lg text-[#171613] font-semibold">
                Hướng Dẫn Chọn Kích Cỡ
              </h2>
              <p className="text-[11px] text-[#747069]">
                {productName ? `Áp dụng cho: ${productName}` : guide?.title || 'Tiêu chuẩn may đo TADA! Atelier'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#747069] hover:text-[#171613] hover:bg-[#FAF8F3] transition-colors"
            aria-label="Đóng bảng hướng dẫn chọn size"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switching */}
        <div className="flex border-b border-[#E8E4DC] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'table'
                ? 'border-[#171613] text-[#171613]'
                : 'border-transparent text-[#747069] hover:text-[#171613]'
            }`}
          >
            Bảng Số Đo Chi Tiết (cm)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'border-[#171613] text-[#171613]'
                : 'border-transparent text-[#747069] hover:text-[#171613]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8A7158]" />
            <span>Gợi Ý Size Thông Minh</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'table' ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-[#E8E4DC] bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F3] text-[#171613] border-b border-[#E8E4DC]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Kích cỡ</th>
                      <th className="py-3 px-3 font-semibold text-center">Vòng Ngực</th>
                      <th className="py-3 px-3 font-semibold text-center">Vòng Eo</th>
                      <th className="py-3 px-3 font-semibold text-center">Vòng Mông</th>
                      <th className="py-3 px-3 font-semibold text-center">Chiều Cao</th>
                      <th className="py-3 px-3 font-semibold text-center">Cân Nặng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC]">
                    {guide?.measurements?.map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F3]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#171613]">
                          Size {row.size}
                        </td>
                        <td className="py-3 px-3 text-center text-[#747069] font-mono">
                          {row.bust ? `${row.bust} cm` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center text-[#747069] font-mono">
                          {row.waist ? `${row.waist} cm` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center text-[#747069] font-mono">
                          {row.hips ? `${row.hips} cm` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center text-[#747069] font-mono">
                          {row.heightRange ? `${row.heightRange} cm` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center text-[#747069] font-mono">
                          {row.weightRange ? `${row.weightRange} kg` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cách đo chuẩn */}
              <div className="bg-white rounded-xl p-4 border border-[#E8E4DC] text-xs space-y-2">
                <span className="font-semibold text-[#171613] block">
                  Lưu ý khi tự lấy số đo cơ thể:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-[#747069]">
                  <li><strong>Vòng Ngực:</strong> Đo ngang qua điểm nhô cao nhất của ngực, giữ thước dây phẳng ngang lưng.</li>
                  <li><strong>Vòng Eo:</strong> Đo quanh phần nhỏ nhất của thắt lưng (thường cách rốn 2-3cm).</li>
                  <li><strong>Vòng Mông:</strong> Đo quanh phần nở nang nhất của vòng ba.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleCalculateSize} className="bg-white p-5 rounded-xl border border-[#E8E4DC] space-y-4">
                <p className="text-xs text-[#747069]">
                  Nhập số đo chiều cao và cân nặng hiện tại để nhận gợi ý size may đo chuẩn xác nhất:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user-height" className="block text-xs font-medium text-[#171613] mb-1">
                      Chiều cao của bạn (cm)
                    </label>
                    <input
                      id="user-height"
                      type="number"
                      min={130}
                      max={205}
                      required
                      placeholder="VD: 162"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8E4DC] focus:outline-none focus:border-[#8A7158] font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="user-weight" className="block text-xs font-medium text-[#171613] mb-1">
                      Cân nặng của bạn (kg)
                    </label>
                    <input
                      id="user-weight"
                      type="number"
                      min={35}
                      max={130}
                      required
                      placeholder="VD: 48"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8E4DC] focus:outline-none focus:border-[#8A7158] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#171613] text-white text-xs font-medium rounded-lg hover:bg-black transition-colors"
                >
                  Tính Kích Cỡ Gợi Ý
                </button>
              </form>

              {calcResult && (
                <div className="bg-white border-2 border-[#8A7158]/30 rounded-xl p-5 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8A7158] uppercase tracking-wider">
                      Kết quả gợi ý từ Atelier
                    </span>
                    <span className="text-[11px] text-[#747069]">
                      Độ chuẩn xác: {calcResult.confidence === 'high' ? 'Rất cao (98%)' : 'Ước lượng theo cân nặng'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-xs text-[#747069]">Kích cỡ khuyên dùng:</span>
                    <span className="font-mono text-3xl font-bold text-[#171613]">
                      Size {calcResult.size}
                    </span>
                  </div>

                  <p className="text-xs text-[#747069] leading-relaxed bg-[#FAF8F3] p-3 rounded-lg border border-[#E8E4DC]">
                    {calcResult.fitNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Banner tư vấn Concierge riêng nếu dáng người khó chọn size */}
          <div className="bg-[#FAF8F3] border border-[#E8E4DC] p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#8A7158] shrink-0" />
              <p className="text-xs text-[#747069]">
                Bạn có số đo đặc biệt hoặc muốn đặt may đo bespoke riêng theo tỷ lệ cơ thể?
              </p>
            </div>
            <Link
              href="/concierge"
              onClick={onClose}
              className="text-xs font-semibold text-[#8A7158] hover:text-[#171613] inline-flex items-center gap-1 underline shrink-0"
            >
              <span>Dịch vụ Concierge Bespoke</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3 border-t border-[#E8E4DC] bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#FAF8F3] text-[#171613] hover:bg-[#E8E4DC] transition-colors"
          >
            Đóng bảng size
          </button>
        </div>
      </div>
    </div>
  );
}
