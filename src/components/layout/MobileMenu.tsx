'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronRight, ChevronDown, Sparkles, Globe, Heart, ShoppingBag, User, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { BRANDS } from '@/data/mockData';
import { useMounted } from '@/hooks/useMounted';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { totalWishlist } = useWishlist();
  const { totalItems } = useCart();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const mounted = useMounted();

  if (!isOpen) return null;

  const toggleSection = (name: string) => {
    setExpandedSection(expandedSection === name ? null : name);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171613]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F3] shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
        {/* Header Drawer */}
        <div className="p-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#F4F1EA]">
          <div>
            <span className="font-editorial text-xl font-bold tracking-[0.08em] text-[#171613] block">
              TADA<span className="text-[#C78238]">!</span>
            </span>
            <span className="text-[9px] tracking-[0.2em] text-[#8A7158] uppercase">
              Style for your story
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#171613] hover:text-[#8A7158] rounded-full hover:bg-[#E8E4DC]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-4 divide-y divide-[#E8E4DC]">
          <div className="py-2 space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="block py-2 text-sm font-semibold text-[#171613] hover:text-[#C78238]"
            >
              Trang chủ
            </Link>

            {/* Nữ */}
            <div>
              <button
                onClick={() => toggleSection('nu')}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#171613]"
              >
                <span>Thời trang Nữ</span>
                {expandedSection === 'nu' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSection === 'nu' && (
                <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                  <Link href="/shop?category=nu" onClick={onClose} className="block py-1 hover:text-[#171613]">Tất cả đồ Nữ</Link>
                  <Link href="/shop?category=nu&sub=vay-dam" onClick={onClose} className="block py-1 hover:text-[#171613]">Váy & Đầm tiệc</Link>
                  <Link href="/shop?category=nu&sub=ao-khoac" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo khoác dạ</Link>
                  <Link href="/shop?category=nu&sub=ao-len" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo len & Cardigan</Link>
                  <Link href="/shop?category=nu&sub=ao-thun" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo sơ mi & Blouse</Link>
                  <Link href="/shop?category=nu&sub=quan" onClick={onClose} className="block py-1 hover:text-[#171613]">Quần tây & Chân váy</Link>
                </div>
              )}
            </div>

            {/* Nam */}
            <div>
              <button
                onClick={() => toggleSection('nam')}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#171613]"
              >
                <span>Thời trang Nam</span>
                {expandedSection === 'nam' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSection === 'nam' && (
                <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                  <Link href="/shop?category=nam" onClick={onClose} className="block py-1 hover:text-[#171613]">Tất cả đồ Nam</Link>
                  <Link href="/shop?category=nam&sub=ao-khoac" onClick={onClose} className="block py-1 hover:text-[#171613]">Blazer & Áo khoác</Link>
                  <Link href="/shop?category=nam&sub=ao-thun" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo sơ mi & Polo</Link>
                  <Link href="/shop?category=nam&sub=ao-len" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo len & Cardigan</Link>
                  <Link href="/shop?category=do-bo" onClick={onClose} className="block py-1 font-medium text-[#8A7158] hover:text-[#171613]">Đồ bộ & Tracksuits</Link>
                  <Link href="/shop?category=nam&sub=quan" onClick={onClose} className="block py-1 hover:text-[#171613]">Quần tây & Jeans</Link>
                </div>
              )}
            </div>

            {/* Đồ bộ & Tracksuits */}
            <Link
              href="/shop?category=do-bo"
              onClick={onClose}
              className="block py-2 text-sm font-medium text-[#171613] hover:text-[#C78238]"
            >
              Đồ bộ & Tracksuits
            </Link>

            {/* Trẻ em */}
            <div>
              <button
                onClick={() => toggleSection('tre-em')}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#171613]"
              >
                <span>Thời trang Trẻ em</span>
                {expandedSection === 'tre-em' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSection === 'tre-em' && (
                <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                  <Link href="/shop?category=tre-em" onClick={onClose} className="block py-1 hover:text-[#171613]">Tất cả đồ Trẻ em</Link>
                  <Link href="/shop?category=tre-em&sub=be-gai" onClick={onClose} className="block py-1 hover:text-[#171613]">Bé gái</Link>
                  <Link href="/shop?category=tre-em&sub=be-trai" onClick={onClose} className="block py-1 hover:text-[#171613]">Bé trai</Link>
                  <Link href="/shop?category=tre-em&sub=ao-len" onClick={onClose} className="block py-1 hover:text-[#171613]">Áo len ấm áp</Link>
                </div>
              )}
            </div>

            {/* Phụ kiện */}
            <div>
              <button
                onClick={() => toggleSection('phu-kien')}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#171613]"
              >
                <span>Túi xách & Phụ kiện</span>
                {expandedSection === 'phu-kien' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSection === 'phu-kien' && (
                <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                  <Link href="/shop?category=phu-kien" onClick={onClose} className="block py-1 hover:text-[#171613]">Tất cả Phụ kiện</Link>
                  <Link href="/shop?category=phu-kien&sub=tui-xach" onClick={onClose} className="block py-1 hover:text-[#171613]">Túi xách cao cấp</Link>
                  <Link href="/shop?category=phu-kien&sub=giay-dep" onClick={onClose} className="block py-1 hover:text-[#171613]">Giày dép & Loafer</Link>
                  <Link href="/shop?category=phu-kien&sub=that-lung" onClick={onClose} className="block py-1 hover:text-[#171613]">Thắt lưng da</Link>
                  <Link href="/shop?category=phu-kien&sub=phu-kien" onClick={onClose} className="block py-1 hover:text-[#171613]">Kính mắt & Trang sức</Link>
                </div>
              )}
            </div>
          </div>

          {/* Local Brands Vietnam */}
          <div className="py-2">
            <button
              onClick={() => toggleSection('local')}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold text-[#8A7158]"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C7A66A]" />
                Local Brands Việt Nam
              </span>
              {expandedSection === 'local' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSection === 'local' && (
              <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                <Link
                  href="/local-brands"
                  onClick={onClose}
                  className="block py-1 font-semibold text-[#171613] hover:text-[#8A7158]"
                >
                  Khám phá câu chuyện thương hiệu →
                </Link>
                {BRANDS.filter((b) => b.isLocalBrand).map((b) => (
                  <Link
                    key={b.id}
                    href={`/shop?brand=${b.slug}`}
                    onClick={onClose}
                    className="block py-1 hover:text-[#171613]"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hàng Order Quốc Tế */}
          <div className="py-2">
            <button
              onClick={() => toggleSection('intl')}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold text-[#8A7158]"
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#C7A66A]" />
                Order Quốc Tế
              </span>
              {expandedSection === 'intl' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {expandedSection === 'intl' && (
              <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                <Link
                  href="/order-info"
                  onClick={onClose}
                  className="block py-1 font-semibold text-[#171613] hover:text-[#8A7158]"
                >
                  Quy trình & Cam kết order →
                </Link>
                {BRANDS.filter((b) => !b.isLocalBrand).map((b) => (
                  <Link
                    key={b.id}
                    href={`/shop?brand=${b.slug}`}
                    onClick={onClose}
                    className="block py-1 hover:text-[#171613]"
                  >
                    {b.name} ({b.country})
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sale & Bộ sưu tập */}
          <div className="py-2 space-y-1">
            <Link
              href="/shop?sale=true"
              onClick={onClose}
              className="flex items-center gap-1.5 py-2 text-sm font-semibold text-[#B83A3A]"
            >
              <Flame className="w-4 h-4 fill-[#B83A3A]" />
              Ưu Đãi Đặc Biệt (Sale)
            </Link>

            <div>
              <button
                onClick={() => toggleSection('collections')}
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-[#171613]"
              >
                <span>Bộ Sưu Tập & Lookbook</span>
                {expandedSection === 'collections' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {expandedSection === 'collections' && (
                <div className="pl-4 pb-2 space-y-1.5 text-xs text-[#747069]">
                  <Link href="/collections" onClick={onClose} className="block py-1 font-semibold text-[#8A7158] hover:text-[#171613]">
                    Khám phá Editorial Lookbooks →
                  </Link>
                  <Link href="/shop?collection=thu-dong" onClick={onClose} className="block py-1 hover:text-[#171613]">
                    BST Thu Đông 2026
                  </Link>
                  <Link href="/shop?collection=quiet-luxury" onClick={onClose} className="block py-1 hover:text-[#171613]">
                    Quiet Luxury Essentials
                  </Link>
                  <Link href="/shop?collection=local-design" onClick={onClose} className="block py-1 hover:text-[#171613]">
                    Vietnam Designer Lookbook
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Tiện ích người dùng */}
          <div className="py-4 space-y-2.5 text-xs text-[#747069]">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2 hover:text-[#171613]"
            >
              <User className="w-4 h-4 text-[#8A7158]" />
              <span>{mounted && user ? user.name : 'Tài khoản & Đăng nhập'}</span>
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between hover:text-[#171613]"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8A7158]" />
                Danh sách yêu thích
              </span>
              {mounted && totalWishlist > 0 && (
                <span className="bg-[#B83A3A] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {totalWishlist}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-between hover:text-[#171613]"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8A7158]" />
                Giỏ hàng của bạn
              </span>
              {mounted && totalItems > 0 && (
                <span className="bg-[#171613] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
