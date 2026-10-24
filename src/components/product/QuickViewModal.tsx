'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Star, ShoppingBag, ShieldCheck, Truck, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/ui/SafeImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isOpen?: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, isOpen = true }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      setValidationError('Vui lòng chọn màu sắc');
      return;
    }
    if (!selectedSize) {
      setValidationError('Vui lòng chọn kích cỡ');
      return;
    }
    setValidationError('');

    const result = addToCart(product, selectedColor, selectedSize, quantity);
    if (result.success) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#171613]/70 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-[#FAF8F3] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-[#E8E4DC] z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#747069] hover:text-[#171613] rounded-full hover:bg-[#E8E4DC]/50 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="p-6 bg-[#F4F1EA] flex flex-col justify-between">
              <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden bg-[#E8E4DC] shadow-inner">
                <SafeImage
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.badges.map((b, i) => (
                    <Badge key={i} type={b} />
                  ))}
                </div>
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-20 rounded overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-[#C7A66A] scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={img} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Right */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-[#8A7158] font-semibold tracking-[0.05em] uppercase">
                  <span>{product.brand}</span>
                  <span className="font-normal text-[#747069]">
                    {product.originCountry}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-medium text-[#171613] mt-1.5 leading-[1.3]">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#C7A66A]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#747069] tabular-nums">
                    {product.rating} ({product.reviewCount ?? 0} đánh giá xác thực)
                  </span>
                </div>

                {/* Pricing - Chuẩn font sans rõ nét */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-[#171613] tabular-nums tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {(product.originalPrice ?? 0) > product.price && (
                    <span className="text-sm text-[#8A857D] line-through font-normal tabular-nums">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                  {(product.discountPercentage ?? 0) > 0 && (
                    <Badge type="SALE" discountText={`Tiết kiệm ${product.discountPercentage}%`} />
                  )}
                </div>

                {/* Shipping & origin note */}
                <div className="mt-4 p-3 bg-[#F4F1EA] rounded-md text-xs space-y-1.5 text-[#747069]">
                  <div className="flex items-center gap-2 text-[#171613] font-medium">
                    <Truck className="w-4 h-4 text-[#8A7158]" />
                    <span>{product.estimatedDelivery}</span>
                  </div>
                  {product.origin === 'international_order' && (
                    <div className="flex items-start gap-2 text-[#8A7158]">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Hàng đặt trước tại boutique nước ngoài. Đặt cọc 50%, bảo đảm hoàn tiền nếu không đúng mô tả.
                      </span>
                    </div>
                  )}
                </div>

                {/* Color Selector */}
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-[#171613] uppercase tracking-wider mb-2">
                    Màu sắc: <span className="font-normal text-[#8A7158]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c.name);
                          setValidationError('');
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                          selectedColor === c.name
                            ? 'border-[#171613] bg-[#FAF8F3] font-medium shadow-sm'
                            : 'border-[#E8E4DC] hover:border-[#8A7158]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#171613] uppercase tracking-wider mb-2">
                    Kích cỡ: <span className="font-normal text-[#8A7158]">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSize(s);
                          setValidationError('');
                        }}
                        className={`min-w-10 py-1.5 px-3 text-xs font-medium rounded border transition-all ${
                          selectedSize === s
                            ? 'bg-[#171613] text-white border-[#171613]'
                            : 'border-[#E8E4DC] text-[#171613] hover:border-[#8A7158]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {validationError && (
                  <p className="mt-2 text-xs text-[#B83A3A] font-medium">
                    {validationError}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E8E4DC] space-y-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 text-xs uppercase tracking-widest font-bold rounded flex items-center justify-center gap-2 shadow-md transition-all ${
                    isAdded
                      ? 'bg-[#2E4F3E] text-white'
                      : 'bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã thêm vào giỏ hàng!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#E8D7BD]" />
                      <span>Thêm vào giỏ hàng</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="text-xs text-[#8A7158] font-medium hover:text-[#171613] inline-flex items-center gap-1.5 underline underline-offset-4"
                  >
                    <span>Xem toàn bộ thông số chi tiết & chất liệu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
