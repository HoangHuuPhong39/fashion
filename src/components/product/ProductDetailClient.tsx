'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Ruler,
  ShieldCheck,
  Plane,
  AlertCircle,
  MessageSquare,
  Send,
  CheckCircle2
} from 'lucide-react';
import { BRANDS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/product/ProductCard';
import { SafeImage } from '@/components/ui/SafeImage';
import { Product, Review } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { user, orders } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'material' | 'reviews'>('desc');
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [, setIsLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Sync selection when product changes
  useEffect(() => {
    setSelectedImage(0);
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
    }
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  // Fetch reviews từ API server
  const fetchReviews = async () => {
    if (!product?.id) return;
    setIsLoadingReviews(true);
    try {
      const res = await fetch(`/api/reviews?productId=${product.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviewsList(data.reviews);
        }
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product?.id]);

  // Kiểm tra xem user hiện tại đã mua sản phẩm này chưa
  const eligibleOrder = useMemo(() => {
    if (!user || !product) return null;
    return orders.find(
      (o) =>
        (o.userId === user.id || o.shippingAddress?.email?.toLowerCase() === user.email?.toLowerCase()) &&
        o.status !== 'cancelled' &&
        o.items.some((i) => i.productId === product.id)
    );
  }, [user, orders, product]);

  const canReview = !!eligibleOrder;

  // Tính tồn kho của biến thể hiện tại (Size + Màu)
  const currentVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find(
      (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size.toLowerCase() === selectedSize.toLowerCase()
    );
  }, [product, selectedColor, selectedSize]);

  const currentStock = currentVariant ? currentVariant.stockCount : product?.stockCount || 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  // Đổi ảnh chính nếu màu có ảnh riêng
  useEffect(() => {
    if (!product) return;
    const colorObj = product.colors?.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase());
    if (colorObj?.image) {
      const idx = product.images.findIndex((img) => img === colorObj.image);
      if (idx !== -1) setSelectedImage(idx);
    }
  }, [selectedColor, product]);

  const isFavorite = product ? isInWishlist(product.id) : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const galleryImages = product?.images && product.images.length > 0
    ? product.images
    : ['/images/placeholder-fashion.svg'];

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setErrorMessage('Biến thể này hiện đã hết hàng. Vui lòng chọn màu hoặc kích cỡ khác.');
      return;
    }
    if (quantity > currentStock) {
      setErrorMessage(`Kho chỉ còn ${currentStock} chiếc cho biến thể này.`);
      return;
    }

    setErrorMessage('');
    const res = addToCart(product, selectedColor, selectedSize, quantity);
    if (res.success) {
      setIsAddedSuccess(true);
      setTimeout(() => setIsAddedSuccess(false), 2500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      setErrorMessage('Biến thể này hiện đã hết hàng. Vui lòng chọn màu hoặc kích cỡ khác.');
      return;
    }
    if (quantity > currentStock) {
      setErrorMessage(`Kho chỉ còn ${currentStock} chiếc cho biến thể này.`);
      return;
    }

    setErrorMessage('');
    addToCart(product, selectedColor, selectedSize, quantity);
    router.push('/checkout');
  };

  // Gửi đánh giá mới
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để gửi đánh giá.');
      return;
    }
    if (!reviewContent.trim()) {
      alert('Vui lòng viết nhận xét cảm nhận của bạn.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewSuccessMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user.id,
          author: user.name,
          rating: reviewRating,
          content: reviewContent.trim(),
          orderId: eligibleOrder?.orderCode
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewContent('');
        setReviewSuccessMsg('Cảm ơn bạn! Đánh giá đã được ghi nhận vào hệ thống.');
        await fetchReviews();
      } else {
        alert(data.message || 'Lỗi gửi đánh giá.');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Mask tên bảo mật thông tin cá nhân: "Nguyễn Lê Hoàng Yến" -> "N***g L* H***g Y*n"
  const maskAuthorName = (name: string) => {
    if (!name) return 'Khách hàng TADA!';
    const parts = name.trim().split(' ');
    return parts
      .map((part) => {
        if (part.length <= 2) return `${part[0]}*`;
        return `${part[0]}***${part[part.length - 1]}`;
      })
      .join(' ');
  };

  // Phân bố sao đánh giá
  const approvedReviews = useMemo(() => {
    return reviewsList.filter((r) => r.status === 'approved' || !r.status);
  }, [reviewsList]);

  const ratingStats = useMemo(() => {
    const total = approvedReviews.length;
    if (total === 0) return { avg: 5.0, count: 0, starCounts: [0, 0, 0, 0, 0] };

    const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));

    const starCounts = [0, 0, 0, 0, 0];
    approvedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      starCounts[star - 1]++;
    });

    return { avg, count: total, starCounts };
  }, [approvedReviews]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'nu': return 'Thời trang Nữ';
      case 'nam': return 'Thời trang Nam';
      case 'tre-em': return 'Trẻ em';
      case 'phu-kien': return 'Phụ kiện & Túi xách';
      default: return cat;
    }
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dynamic Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069] flex-wrap">
          <Link href="/" className="hover:text-[#171613]">Trang chủ</Link>
          <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#171613]">
            {getCategoryLabel(product.category)}
          </Link>
          {product.subCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
              <Link href={`/shop?category=${product.category}&sub=${product.subCategory}`} className="hover:text-[#171613]">
                {product.subCategory}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
          <span className="text-[#171613] font-medium truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Khung Chi Tiết Sản Phẩm 2 Cột */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* CỘT TRÁI: GALLERY DỌC THUMBNAIL + ẢNH CHÍNH LỚN (6 Cột) */}
            <div className="lg:col-span-6 flex gap-4">
              {/* Thumbnail Dọc Bên Trái */}
              <div className="flex flex-col gap-3 shrink-0 max-h-[500px] overflow-y-auto pr-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-[#171613] shadow-md ring-1 ring-[#171613]'
                        : 'border-[#E8E4DC] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>

              {/* Ảnh Lớn Chính Bên Phải */}
              <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC] shadow-inner group">
                <SafeImage
                  src={galleryImages[selectedImage] || galleryImages[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Badge giảm giá */}
                {(product.discountPercentage ?? 0) > 0 && (
                  <div className="absolute top-3 right-3 bg-[#B83A3A] text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
                    -{product.discountPercentage}%
                  </div>
                )}
              </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN CHI TIẾT & HÀNH VI MUA (6 Cột) */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
                    className="text-xs font-semibold text-[#8A7158] uppercase tracking-[0.05em] hover:underline"
                  >
                    {product.brand}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="text-[#747069] hover:text-[#B83A3A] transition-colors p-1"
                    aria-label="Yêu thích"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'text-[#B83A3A] fill-[#B83A3A]' : ''}`}
                    />
                  </button>
                </div>

                <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613] mt-1 leading-[1.25]">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-1 text-xs text-[#8A857D]">
                  <span>Mã SP: {product.sku || product.id.toUpperCase()}</span>
                  <span>•</span>
                  <span>{getCategoryLabel(product.category)}</span>
                </div>

                {/* Đánh giá sao */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#D97706]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(ratingStats.avg) ? 'fill-current text-[#D97706]' : 'text-[#E8E4DC]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#747069] tabular-nums">
                    {ratingStats.avg} ({ratingStats.count} đánh giá thực tế)
                  </span>
                </div>

                {/* Giá tiền & Giảm giá */}
                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-2xl sm:text-3xl font-bold text-[#B83A3A] tabular-nums tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {(product.originalPrice ?? 0) > product.price && (
                    <span className="text-sm sm:text-base text-[#8A857D] line-through font-normal tabular-nums">
                      {formatPrice(product.originalPrice!)}
                    </span>
                  )}
                  {(product.discountPercentage ?? 0) > 0 && (
                    <span className="bg-[#B83A3A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Badges nguồn hàng */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {product.origin === 'international_order' ? (
                    <span className="px-3 py-1 bg-[#E0F2FE] text-[#0369A1] font-semibold text-[10px] tracking-[0.03em] rounded-full flex items-center gap-1">
                      <Plane className="w-3 h-3" />
                      ORDER QUỐC TẾ ({product.originCountry || 'Châu Âu'})
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-[#FEF3C7] text-[#B45309] font-semibold text-[10px] tracking-[0.03em] rounded-full">
                      LOCAL BRAND VIỆT NAM
                    </span>
                  )}

                  {product.depositRequired && (
                    <span className="px-3 py-1 bg-[#FDF2F8] text-[#BE185D] font-semibold text-[10px] tracking-[0.03em] rounded-full">
                      CỌC {product.depositPercentage || 50}% KÍCH HOẠT ĐƠN
                    </span>
                  )}
                </div>
              </div>

              {/* Chọn Màu Sắc */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#171613] mb-2">
                    Màu sắc: <span className="font-normal text-[#747069]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          selectedColor === c.name
                            ? 'ring-2 ring-offset-2 ring-[#171613] scale-110 shadow-sm'
                            : 'border-[#D5CEC2] hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Chọn màu ${c.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Chọn Kích Cỡ */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#171613]">
                      Kích cỡ: <span className="font-normal text-[#747069]">{selectedSize}</span>
                    </label>
                    <button type="button" className="text-xs text-[#747069] hover:text-[#171613] flex items-center gap-1 underline">
                      <Ruler className="w-3 h-3" />
                      <span>Hướng dẫn chọn size</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-10 py-1.5 px-3 text-xs font-semibold rounded border transition-all ${
                          selectedSize === s
                            ? 'bg-[#171613] text-white border-[#171613]'
                            : 'border-[#E8E4DC] text-[#747069] hover:border-[#171613]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TÌNH TRẠNG KHO BIẾN THỂ REALTIME */}
              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#171613]">Tồn kho biến thể ({selectedColor} - Size {selectedSize}):</span>
                  {isOutOfStock ? (
                    <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] font-bold rounded text-[11px]">
                      Hết hàng
                    </span>
                  ) : isLowStock ? (
                    <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] font-bold rounded text-[11px]">
                      Chỉ còn {currentStock} chiếc - Đặt sớm!
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] font-bold rounded text-[11px]">
                      Còn hàng ({currentStock} chiếc)
                    </span>
                  )}
                </div>
                {isOutOfStock && (
                  <p className="text-[11px] text-[#DC2626]">
                    * Kích cỡ hoặc màu sắc này tạm thời hết hàng trong kho. Bạn có thể chọn size hoặc màu khác.
                  </p>
                )}
              </div>

              {/* Số Lượng & Thời gian giao hàng dự kiến */}
              <div>
                <label className="block text-xs font-bold text-[#171613] mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E8E4DC] rounded-lg bg-white">
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Giảm số lượng"
                      className="px-3 py-1.5 text-xs text-[#747069] hover:text-[#171613] disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-[#171613]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || quantity >= currentStock}
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Tăng số lượng"
                      className="px-3 py-1.5 text-xs text-[#747069] hover:text-[#171613] disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#747069]">
                    {product.estimatedDelivery || 'Hỏa tốc 2-4h (Nội thành)'}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 2 Nút Bấm: Thêm vào giỏ hàng & Mua ngay */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`py-3 text-xs uppercase font-bold rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isAddedSuccess
                      ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                      : 'border-[#171613] text-[#171613] hover:bg-[#FAF8F3]'
                  }`}
                >
                  {isAddedSuccess ? '✓ Đã thêm vào giỏ' : isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs uppercase font-bold rounded-lg shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? 'Tạm hết hàng' : 'Mua ngay'}
                </button>
              </div>

              {/* 3 Cam Kết Icon */}
              <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#747069] flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#8A7158]" />
                  <span>Miễn phí ship đơn từ 499K</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#8A7158]" />
                  <span>Đổi trả 7 ngày miễn phí</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8A7158]" />
                  <span>Cam kết chính hãng 100%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Khối Tabs Dưới (Mô tả, Thông tin thương hiệu, Chất liệu, Đánh giá thực) */}
          <div className="mt-12 pt-8 border-t border-[#F0ECE1]">
            <div className="flex border-b border-[#E8E4DC] gap-6 text-xs font-bold uppercase tracking-wider flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'desc' ? 'border-[#171613] text-[#171613]' : 'border-transparent text-[#A8A29E]'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'info' ? 'border-[#171613] text-[#171613]' : 'border-transparent text-[#A8A29E]'
                }`}
              >
                Thông tin thương hiệu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('material')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'material' ? 'border-[#171613] text-[#171613]' : 'border-transparent text-[#A8A29E]'
                }`}
              >
                Chất liệu & Bảo quản
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'border-[#171613] text-[#171613]' : 'border-transparent text-[#A8A29E]'
                }`}
              >
                <span>Đánh giá khách hàng ({ratingStats.count})</span>
              </button>
            </div>

            <div className="py-6 text-xs text-[#747069] leading-relaxed max-w-4xl space-y-4">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#171613] leading-relaxed">
                    {product.description}
                  </p>
                  <p>• <strong>Thương hiệu:</strong> {product.brand} ({product.originCountry || 'Chính hãng TADA!'})</p>
                  <p>• <strong>Mã SKU:</strong> {product.sku || product.id}</p>
                  <p>• <strong>Màu sắc có sẵn:</strong> {product.colors?.map((c) => c.name).join(', ')}</p>
                  <p>• <strong>Kích cỡ khả dụng:</strong> {product.sizes?.join(', ')}</p>
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <h4 className="text-sm font-bold text-[#171613] mb-2">Về thương hiệu {product.brand}:</h4>
                  <p className="leading-relaxed">
                    {BRANDS.find((b) => b.name.toLowerCase() === product.brand.toLowerCase())?.story ||
                      `${product.brand} là đối tác thiết kế và thương hiệu thời trang cao cấp được phân phối chính ngạch tại TADA! Studio.`}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
                      className="text-xs font-bold text-[#8A7158] hover:underline"
                    >
                      → Khám phá thêm các thiết kế của {product.brand}
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'material' && (
                <div>
                  <h4 className="text-sm font-bold text-[#171613] mb-2">Chất liệu cao cấp:</h4>
                  <p className="mb-3">{product.material}</p>
                  <h4 className="text-sm font-bold text-[#171613] mb-1">Hướng dẫn bảo quản:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.careInstructions?.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB ĐÁNH GIÁ THỰC TẾ & BẢO VỆ THÔNG TIN CÁ NHÂN */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Bảng tổng kết điểm và phân bố sao */}
                  <div className="p-6 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DC] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-[#E8E4DC] pb-4 md:pb-0 md:pr-4">
                      <span className="font-editorial text-4xl font-bold text-[#171613]">
                        {ratingStats.avg}
                      </span>
                      <div className="flex text-[#D97706] justify-center mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(ratingStats.avg) ? 'fill-current text-[#D97706]' : 'text-[#E8E4DC]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#747069] mt-1 block">
                        Dựa trên {ratingStats.count} đánh giá thực tế
                      </span>
                    </div>

                    <div className="md:col-span-8 space-y-1.5 text-xs">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const cnt = ratingStats.starCounts[star - 1];
                        const pct = ratingStats.count > 0 ? (cnt / ratingStats.count) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="w-12 text-[#747069] font-medium">{star} sao</span>
                            <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-[#E8E4DC]">
                              <div className="bg-[#D97706] h-full" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="w-8 text-right font-medium text-[#171613]">{cnt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FORM GỬI ĐÁNH GIÁ */}
                  <div className="p-5 bg-white rounded-2xl border border-[#E8E4DC] space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                      <h4 className="font-bold text-sm text-[#171613]">
                        Gửi Đánh Giá Của Bạn Về Sản Phẩm
                      </h4>
                      {canReview && (
                        <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] rounded text-[10px] font-bold">
                          ✓ Đã xác thực mua hàng (Đơn {eligibleOrder?.orderCode})
                        </span>
                      )}
                    </div>

                    {canReview ? (
                      <form onSubmit={handleSubmitReview} className="space-y-3">
                        <div>
                          <label className="font-semibold text-[#171613] block mb-1">
                            Chọn mức độ hài lòng:
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                type="button"
                                key={s}
                                onClick={() => setReviewRating(s)}
                                className="p-1 hover:scale-110 transition-transform"
                                aria-label={`Đánh giá ${s} sao`}
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    s <= reviewRating
                                      ? 'fill-current text-[#D97706]'
                                      : 'text-[#E8E4DC]'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-[#8A7158] ml-2">
                              {reviewRating === 5
                                ? 'Rất hài lòng ★★★★★'
                                : reviewRating === 4
                                ? 'Hài lòng ★★★★☆'
                                : reviewRating === 3
                                ? 'Bình thường ★★★☆☆'
                                : reviewRating === 2
                                ? 'Chưa hài lòng ★★☆☆☆'
                                : 'Rất thất vọng ★☆☆☆☆'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-[#171613] block mb-1">
                            Nhận xét chi tiết (chất vải, phom dáng, thời gian giao...):
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm chân thực của bạn để giúp khách hàng khác có thêm lựa chọn..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>

                        {reviewSuccessMsg && (
                          <div className="p-3 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] rounded-xl font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{reviewSuccessMsg}</span>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmittingReview}
                            className="px-5 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá Xác Thực'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#8A7158] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#171613]">
                            Chính Sách Đánh Giá Minh Bạch TADA!
                          </p>
                          <p className="text-xs text-[#747069] mt-1">
                            Để đảm bảo sự trung thực tuyệt đối, chỉ những tài khoản đã đặt mua thành công sản phẩm này mới có thể gửi nhận xét và chấm điểm sao.
                          </p>
                          {!user && (
                            <Link
                              href="/account"
                              className="text-xs font-bold text-[#8A7158] hover:underline block mt-2"
                            >
                              → Đăng nhập để kiểm tra lịch sử đơn hàng của bạn
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DANH SÁCH ĐÁNH GIÁ CỦA KHÁCH HÀNG */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-sm text-[#171613]">
                      Nhận Xét Từ Khách Hàng Thực Tế ({approvedReviews.length})
                    </h4>

                    {approvedReviews.length === 0 ? (
                      <div className="text-center py-8 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DC] p-6">
                        <MessageSquare className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
                        <p className="font-semibold text-[#171613]">Chưa có đánh giá nào</p>
                        <p className="text-xs text-[#747069] mt-1">
                          Hãy là người đầu tiên trải nghiệm thiết kế này và chia sẻ cảm nhận của bạn!
                        </p>
                      </div>
                    ) : (
                      approvedReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-xl border border-[#E8E4DC] bg-white space-y-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#171613]">
                                {maskAuthorName(rev.author)}
                              </span>
                              <span className="px-1.5 py-0.2 bg-[#DCFCE7] text-[#15803D] rounded text-[9px] font-bold">
                                ✓ Đã mua hàng
                              </span>
                            </div>
                            <span className="text-[10px] text-[#A8A29E]">
                              {rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Đã xác thực')}
                            </span>
                          </div>

                          <div className="flex text-[#D97706]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-current text-[#D97706]' : 'text-[#E8E4DC]'
                                }`}
                              />
                            ))}
                          </div>

                          <p className="text-xs text-[#171613] leading-relaxed">
                            {rev.content}
                          </p>

                          {rev.images && rev.images.length > 0 && (
                            <div className="flex gap-2 pt-1">
                              {rev.images.map((img, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E8E4DC]"
                                >
                                  <SafeImage src={img} alt="" fill className="object-cover" sizes="56px" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#171613]">
              Có thể bạn cũng thích
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
