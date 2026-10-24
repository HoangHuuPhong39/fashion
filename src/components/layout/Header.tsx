'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Gift, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const router = useRouter();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { products, trendingSearches, trackSearch } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live search filtering với debounce nhẹ
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length >= 2) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(term))
      ).slice(0, 6);
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      setIsSearchOpen(false);
      trackSearch(query, searchResults.length);
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickKeywordClick = (keyword: string) => {
    setSearchTerm(keyword);
    setIsSearchOpen(false);
    trackSearch(keyword, 1);
    router.push(`/shop?q=${encodeURIComponent(keyword)}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <header className="w-full bg-[#FAF8F3] border-b border-[#E8E4DC]/80 relative z-40 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Icon */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 text-[#171613] hover:text-[#8A7158] transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo TADA! (Theo nhận diện thương hiệu TADA! Premium Fashion) */}
          <div className="shrink-0">
            <Link href="/" className="block group">
              <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-[0.06em] text-[#171613] flex items-center">
                TADA<span className="text-[#C78238]">!</span>
              </span>
              <span className="text-[9px] tracking-[0.12em] text-[#8A7158] uppercase font-medium block -mt-1 pl-0.5">
                Style for your story
              </span>
            </Link>
          </div>

          {/* Search Bar Trung Tâm (Bo tròn pill + nút đen icon kính lúp như ảnh mẫu) */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative"
          >
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu, phong cách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-[#FAF8F3] text-[#171613] placeholder-[#8A857D] text-xs py-2.5 pl-5 pr-14 rounded-full border border-[#D5CEC2] focus:border-[#171613] focus:outline-none transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#171613] hover:bg-[#333] text-white flex items-center justify-center transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Live Search Popup */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E8E4DC] rounded-xl shadow-2xl overflow-hidden z-50">
                {searchTerm.trim().length >= 2 ? (
                  <>
                    <div className="p-3 bg-[#F4F1EA] border-b border-[#E8E4DC] flex justify-between text-xs text-[#747069]">
                      <span>Gợi ý cho: &quot;{searchTerm}&quot;</span>
                      <span className="text-[11px] text-[#8A7158] font-bold">{searchResults.length} kết quả</span>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-[#E8E4DC]">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-3 hover:bg-[#F4F1EA] transition-colors"
                          >
                            <div className="relative w-10 h-12 rounded overflow-hidden bg-[#E8E4DC] shrink-0">
                              <SafeImage src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#171613] truncate">{product.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-[#B83A3A]">{formatPrice(product.price)}</span>
                                <span className="text-[10px] text-[#747069]">{product.brand}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-[#747069]">
                        Không tìm thấy sản phẩm phù hợp
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4">
                    <p className="text-[11px] font-bold text-[#8A7158] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>🔥 TÌM KIẾM PHỔ BIẾN</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickKeywordClick(item.query)}
                          className="px-2.5 py-1 text-xs bg-[#F4F1EA] hover:bg-[#E8E4DC] text-[#171613] rounded-full transition-colors flex items-center gap-1"
                        >
                          <span>{item.query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tiện Ích Bên Phải: Voucher Box + Giỏ Hàng Tròn (Như ảnh mẫu) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Box Đăng ký ngay nhận voucher 100K */}
            <Link
              href="/account"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8D7BD] bg-[#F9F5EC] hover:bg-[#F3EDE0] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#E88E38]/20 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-[#E88E38]" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-[10px] font-bold text-[#E88E38] block">Đăng ký ngay</span>
                <span className="text-[10px] text-[#747069] font-medium block">Nhận voucher 100K</span>
              </div>
            </Link>

            {/* Nút Giỏ Hàng Tròn Badge Đỏ (Chuẩn 100% như ảnh) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative w-10 h-10 rounded-full bg-white border border-[#D5CEC2] hover:border-[#171613] flex items-center justify-center transition-all shadow-sm"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-[#171613]" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B83A3A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF8F3] text-xs py-2 pl-4 pr-10 rounded-full border border-[#D5CEC2]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#171613] text-white flex items-center justify-center"
            >
              <Search className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
