'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, ChevronDown, Flame, Sparkles, Globe, Layers, ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

const NavigationContent: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories } = useProducts();

  const category = searchParams.get('category');
  const subParam = searchParams.get('sub');
  const origin = searchParams.get('origin');
  const sale = searchParams.get('sale');
  const collection = searchParams.get('collection');

  const isHomeActive = pathname === '/' && !category && !origin && !sale && !collection;
  const isBrandsActive = pathname === '/local-brands' && !origin;
  const isOrderActive = origin === 'international_order';
  const isSaleActive = sale === 'true';

  const closeMenu = () => {
    setActiveMenu(null);
    setIsMegaMenuOpen(false);
  };

  const getNavClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 py-2 border-b-2 transition-colors text-[13px] leading-none ${
      isActive
        ? 'text-[#C78238] font-semibold border-[#C78238]'
        : 'text-[#171613] hover:text-[#C78238] font-medium border-transparent'
    }`;

  return (
    <nav className="hidden lg:block bg-[#FAF8F3] border-b border-[#E8E4DC] relative z-30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 py-1.5">
          {/* Nút Đen "☰ Danh mục" Bên Trái mở Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <Link
              href="/shop"
              onClick={closeMenu}
              className="flex items-center gap-2 px-4 py-2 bg-[#171613] hover:bg-[#333] text-white text-xs font-semibold rounded-lg transition-colors shrink-0 shadow-sm"
            >
              <Menu className="w-4 h-4 text-[#C7A66A]" />
              <span>Danh mục</span>
              <ChevronDown className={`w-3 h-3 text-[#E8D7BD] transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </Link>

            {/* Mega Menu Dropdown khi hover nút Danh Mục */}
            {isMegaMenuOpen && (
              <div className="absolute top-full left-0 w-[860px] bg-white border border-[#E8E4DC] rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E4DC]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#171613] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C78238]" />
                    <span>TẤT CẢ DANH MỤC THỜI TRANG TADA!</span>
                  </span>
                  <Link
                    href="/shop"
                    onClick={closeMenu}
                    className="text-xs font-medium text-[#C78238] hover:underline flex items-center gap-1"
                  >
                    <span>Xem toàn bộ cửa hàng</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-5 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-2.5">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        onClick={closeMenu}
                        className="text-xs font-bold text-[#171613] hover:text-[#C78238] flex items-center gap-1.5 pb-1 border-b border-[#F4F1EA]"
                      >
                        <span>{cat.icon || '🏷️'}</span>
                        <span className="uppercase">{cat.name}</span>
                      </Link>
                      <ul className="space-y-1.5">
                        {(cat.subcategories || []).map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/shop?category=${cat.slug}&sub=${sub.slug}`}
                              onClick={closeMenu}
                              className="text-[12px] text-[#524E48] hover:text-[#C78238] hover:translate-x-1 transition-all block truncate"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dải Menu Điều Hướng Động */}
          <ul className="flex items-center space-x-6 text-[13px] text-[#171613]">
            {/* Trang chủ */}
            <li>
              <Link href="/" onClick={closeMenu} className={getNavClass(isHomeActive)}>
                <span>Trang chủ</span>
              </Link>
            </li>

            {/* Các danh mục cha động (Nữ, Nam, Trẻ em, Đồ bộ, Phụ kiện) */}
            {categories.map((cat) => {
              const isCatActive = category === cat.slug;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;

              return (
                <li
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(cat.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    onClick={closeMenu}
                    className={getNavClass(isCatActive)}
                  >
                    <span>{cat.name}</span>
                    {hasSubs && (
                      <ChevronDown className="w-3 h-3 text-[#747069] group-hover:rotate-180 transition-transform" />
                    )}
                  </Link>

                  {/* Dropdown danh mục con */}
                  {hasSubs && activeMenu === cat.slug && (
                    <div className="absolute top-full left-0 w-60 bg-white border border-[#E8E4DC] rounded-xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-[#F0ECE1]">
                      <div className="py-1">
                        <Link
                          href={`/shop?category=${cat.slug}`}
                          onClick={closeMenu}
                          className="block px-4 py-2 text-xs font-bold text-[#171613] hover:bg-[#F4F1EA]"
                        >
                          Tất cả thời trang {cat.name}
                        </Link>
                      </div>
                      <div className="py-1">
                        {cat.subcategories!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/shop?category=${cat.slug}&sub=${sub.slug}`}
                            onClick={closeMenu}
                            className={`block px-4 py-1.5 text-xs transition-colors ${
                              subParam === sub.slug
                                ? 'text-[#C78238] font-semibold bg-[#FAF6F0]'
                                : 'text-[#524E48] hover:bg-[#F4F1EA] hover:text-[#171613]'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}

            {/* Hàng mới về */}
            <li>
              <Link
                href="/shop?tab=new"
                onClick={closeMenu}
                className={getNavClass(searchParams.get('tab') === 'new')}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
                <span>Hàng Mới</span>
              </Link>
            </li>

            {/* Bán chạy */}
            <li>
              <Link
                href="/shop?tab=best_sellers"
                onClick={closeMenu}
                className={getNavClass(searchParams.get('tab') === 'best_sellers')}
              >
                <Flame className="w-3.5 h-3.5 text-[#B83A3A]" />
                <span>Bán Chạy</span>
              </Link>
            </li>

            {/* Sale Khuyến mãi */}
            <li>
              <Link
                href="/shop?sale=true"
                onClick={closeMenu}
                className={getNavClass(isSaleActive)}
              >
                <span className="text-[#B83A3A] font-bold">Giảm Giá %</span>
              </Link>
            </li>

            {/* Local Brands */}
            <li>
              <Link
                href="/local-brands"
                onClick={closeMenu}
                className={getNavClass(isBrandsActive)}
              >
                <span>Local Brands</span>
              </Link>
            </li>

            {/* Order Quốc Tế */}
            <li>
              <Link
                href="/shop?origin=international_order"
                onClick={closeMenu}
                className={getNavClass(isOrderActive)}
              >
                <Globe className="w-3.5 h-3.5 text-[#C7A66A]" />
                <span>Order Quốc Tế</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export const Navigation: React.FC = () => {
  return (
    <Suspense
      fallback={
        <nav className="hidden lg:block bg-[#FAF8F3] border-b border-[#E8E4DC] relative z-30 h-[48px]" />
      }
    >
      <NavigationContent />
    </Suspense>
  );
};
