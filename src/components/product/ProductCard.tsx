'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
}

const ProductCardBase: React.FC<ProductCardProps> = ({ product, onQuickView, className = '' }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [isAdded, setIsAdded] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorite = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCart(product, selectedColor, selectedSize, 1);
    if (result.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  // Select image to show
  const primaryImage = product.images?.[0] || '/images/placeholder-fashion.svg';
  const hasSecondary = Boolean(product.images && product.images.length > 1 && product.images[1] !== primaryImage);
  const secondaryImage = hasSecondary ? product.images![1] : null;

  return (
    <div
      className={`group flex flex-col bg-white rounded-xl border border-[#E8E4DC] overflow-hidden transition-all duration-300 hover:border-[#C7A66A] hover:shadow-[0_10px_25px_rgba(23,22,19,0.08)] ${className}`}
    >
      {/* Khung ảnh tỷ lệ chuẩn 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F1EA]">
        <Link href={`/product/${product.id}`} className="block w-full h-full relative">
          <SafeImage
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ease-out ${
              hasSecondary ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {secondaryImage && (
            <SafeImage
              src={secondaryImage}
              alt={`${product.name} - 2`}
              fill
              className="object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Badges ở góc trên bên trái */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {(product.discountPercentage ?? 0) > 0 && (
            <span className="px-2 py-0.5 bg-[#B83A3A] text-white text-[10px] font-bold rounded shadow-sm">
              -{product.discountPercentage}%
            </span>
          )}
          {product.origin === 'international_order' && (
            <span className="px-2.5 py-0.5 bg-[#0369A1] text-white text-[9px] font-semibold rounded-full shadow-sm tracking-[0.04em] uppercase">
              ORDER QUỐC TẾ
            </span>
          )}
          {product.origin === 'vietnam_local_brand' && (
            <span className="px-2.5 py-0.5 bg-[#B45309] text-white text-[9px] font-semibold rounded-full shadow-sm tracking-[0.04em] uppercase">
              LOCAL BRAND
            </span>
          )}
        </div>

        {/* Wishlist Button ở góc trên bên phải */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-[#171613] text-[#B83A3A] shadow-md scale-105'
              : 'bg-white/85 backdrop-blur-sm text-[#171613] hover:bg-white hover:text-[#B83A3A] shadow-sm'
          }`}
          title={isFavorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
          aria-label="Yêu thích"
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-[#B83A3A]' : ''}`} />
        </button>

        {/* Quick View Button hiển thị khi hover trên desktop */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="hidden sm:flex absolute bottom-12 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-[#FAF8F3]/95 hover:bg-white text-[#171613] text-[11px] uppercase tracking-[0.05em] font-medium rounded shadow-md backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-10 items-center gap-1.5 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem nhanh</span>
          </button>
        )}

        {/* Quick Add Button hiển thị khi hover ở đáy ảnh */}
        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-[#171613]/70 via-[#171613]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`w-full py-2 text-xs uppercase tracking-[0.05em] font-semibold rounded flex items-center justify-center gap-2 transition-all shadow-md ${
              isAdded
                ? 'bg-[#15803D] text-white'
                : 'bg-[#171613] text-[#FAF8F3] hover:bg-[#8A7158]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm vào giỏ</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#E8D7BD]" />
                <span>Thêm nhanh {selectedSize ? `(${selectedSize})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Brand & Origin country */}
          <div className="flex items-center justify-between text-[11px] text-[#8A7158] font-semibold tracking-[0.04em] uppercase">
            <span className="truncate">{product.brand}</span>
            {product.originCountry && (
              <span className="text-[10px] text-[#747069] lowercase font-normal shrink-0 ml-1">
                {product.originCountry}
              </span>
            )}
          </div>

          {/* Product Name (Đúng 2 dòng tối đa, chiều cao cố định để không bị lệch thẻ) */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#8A7158] transition-colors mt-1">
            <h4 className="text-[13px] sm:text-sm font-medium text-[#171613] line-clamp-2 leading-[1.38] min-h-[2.4rem]">
              {product.name}
            </h4>
          </Link>
        </div>

        {/* Swatch màu & Sizes */}
        {((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) && (
          <div className="flex items-center justify-between pt-0.5">
            {/* Color dots */}
            <div className="flex items-center space-x-1.5">
              {product.colors?.slice(0, 4).map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'border-[#171613] scale-110 shadow-sm ring-1 ring-[#C7A66A]'
                      : 'border-[#D5CEC2] hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors && product.colors.length > 4 && (
                <span className="text-[10px] text-[#747069] tabular-nums">+{product.colors.length - 4}</span>
              )}
            </div>

            {/* Size pills */}
            <div className="flex items-center space-x-1">
              {product.sizes?.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                    selectedSize === s
                      ? 'bg-[#171613] text-white font-medium'
                      : 'text-[#747069] hover:bg-[#E8E4DC]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 pt-1.5 border-t border-[#F0ECE1]">
          <span className="text-sm sm:text-base font-bold text-[#B83A3A] tabular-nums tracking-tight">
            {formatPrice(product.price)}
          </span>
          {(product.originalPrice ?? 0) > product.price && (
            <span className="text-xs text-[#8A857D] line-through font-normal tabular-nums">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Rating & Sales count & Freeship */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <div className="flex items-center gap-1 text-[#747069]">
            <Star className="w-3.5 h-3.5 text-[#E5A93C] fill-[#E5A93C]" />
            <span className="font-semibold text-[#171613] tabular-nums">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            <span className="text-[10px] text-[#A8A29E] tabular-nums">
              ({(product.salesCount ?? 0) > 0 ? `${product.salesCount} đã bán` : `${product.reviewCount ?? 0} đánh giá`})
            </span>
          </div>

          {/* Badge Freeship */}
          <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] font-semibold text-[10px] rounded-full">
            Freeship
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardBase);
