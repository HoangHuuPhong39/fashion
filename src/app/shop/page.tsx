'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Search,
  RotateCcw,
  SlidersHorizontal,
  X,
  Flame,
  Check,
  Package,
  Clock,
  Filter
} from 'lucide-react';
import { BRANDS, CATEGORIES } from '@/data/mockData';
import { useProducts } from '@/context/ProductContext';
import { Product, ProductOrigin } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { SafeImage } from '@/components/ui/SafeImage';

const ITEMS_PER_PAGE = 12;

function ShopContent() {
  const { products, categories, trackSearch } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL query params
  const categoryParam = searchParams.get('category') || '';
  const subParam = searchParams.get('sub') || '';
  const brandParam = searchParams.get('brand') || '';
  const originParam = (searchParams.get('origin') as ProductOrigin | '') || '';
  const saleParam = searchParams.get('sale') || '';
  const collectionParam = searchParams.get('collection') || '';
  const queryParam = searchParams.get('q') || '';
  const tabParam = searchParams.get('tab') || '';

  // Filter states
  const [selectedSubCat, setSelectedSubCat] = useState<string>(subParam);
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? [brandParam] : []
  );
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(3000000);
  const [stockStatus, setStockStatus] = useState<'all' | 'in_stock' | 'order'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'best_seller' | 'most_searched' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>(
    tabParam === 'best_sellers' ? 'best_seller' : tabParam === 'new' ? 'newest' : 'popular'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });
  useEffect(() => {
    if (saleParam !== 'true') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [saleParam]);

  // Sync state when URL params change: reset transient filters (color, size, price) to avoid accidental hiding
  useEffect(() => {
    setSelectedSubCat(subParam);
    if (brandParam) {
      const bObj = BRANDS.find(
        (b) =>
          b.slug.toLowerCase() === brandParam.toLowerCase() ||
          b.name.toLowerCase() === brandParam.toLowerCase()
      );
      setSelectedBrands(bObj ? [bObj.name] : [brandParam]);
    } else {
      setSelectedBrands([]);
    }
    if (tabParam === 'best_sellers') {
      setSortBy('best_seller');
    } else if (tabParam === 'new') {
      setSortBy('newest');
    }
    // Reset ephemeral filters when top-level route params change so products aren't accidentally hidden
    setSelectedColor('');
    setSelectedSizes([]);
    setPriceRange(3000000);
    setStockStatus('all');
    setCurrentPage(1);
  }, [categoryParam, subParam, brandParam, originParam, saleParam, collectionParam, queryParam, tabParam]);

  // Danh mục cha đang chọn
  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
  }, [categories, categoryParam]);

  // Subcategories definition based on dynamic categories or collections
  const subCategoryOptions = useMemo(() => {
    if (activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0) {
      return [
        { id: '', name: `Tất cả đồ ${activeCategoryObj.name}` },
        ...activeCategoryObj.subcategories.map((s) => ({ id: s.slug, name: s.name }))
      ];
    }

    if (collectionParam) {
      return [
        { id: '', name: 'Tất cả sản phẩm' },
        { id: 'thu-dong', name: 'Thu Đông 2026' },
        { id: 'quiet-luxury', name: 'Quiet Luxury Essentials' },
        { id: 'local-design', name: 'Vietnam Designer Lookbook' }
      ];
    }

    return [{ id: '', name: 'Tất cả sản phẩm' }];
  }, [activeCategoryObj, collectionParam]);

  // Brand list with realistic count
  const brandList = useMemo(() => {
    return BRANDS.map((b) => {
      const count = products.filter(
        (p) => p.brand.toLowerCase() === b.name.toLowerCase()
      ).length;
      return {
        slug: b.slug,
        name: b.name,
        country: b.country,
        isLocal: b.isLocalBrand,
        count
      };
    });
  }, []);

  const colors = [
    { name: 'Đen', hex: '#171613' },
    { name: 'Trắng', hex: '#FAF8F3' },
    { name: 'Be', hex: '#E8D7BD' },
    { name: 'Nâu', hex: '#8A7158' },
    { name: 'Xanh Navy', hex: '#1E293B' },
    { name: 'Đỏ Trầm', hex: '#B83A3A' },
    { name: 'Vàng Mù Tạt', hex: '#E5A93C' },
    { name: 'Xám', hex: '#94A3B8' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const toggleBrand = (bName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(bName) ? prev.filter((b) => b !== bName) : [...prev, bName]
    );
    setCurrentPage(1);
  };

  const toggleSize = (sName: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sName) ? prev.filter((s) => s !== sName) : [...prev, sName]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedSubCat('');
    setSelectedBrands([]);
    setSelectedColor('');
    setSelectedSizes([]);
    setPriceRange(3000000);
    setStockStatus('all');
    setSortBy('popular');
    setCurrentPage(1);
    router.push('/shop');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Dynamic banner & breadcrumb metadata calculation
  const bannerInfo = useMemo(() => {
    const matchedBrand = BRANDS.find(
      (b) =>
        b.slug.toLowerCase() === brandParam.toLowerCase() ||
        b.name.toLowerCase() === brandParam.toLowerCase()
    );

    if (matchedBrand) {
      return {
        title: `Bộ Sưu Tập ${matchedBrand.name}`,
        subtitle: `${matchedBrand.aesthetic} — ${matchedBrand.country}`,
        image: matchedBrand.bannerImage || '/images/products/chrome-hearts-ma1-bomber-cream.jpg',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Thương hiệu', href: '/local-brands' },
          { name: matchedBrand.name, href: `/shop?brand=${matchedBrand.slug}` }
        ]
      };
    }

    if (collectionParam === 'thu-dong') {
      return {
        title: 'Bộ Sưu Tập Thu Đông 2026',
        subtitle: 'Sắc thái ấm áp, kết cấu dệt kim mềm mại, trench coat và áo khoác dạ thanh lịch',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Bộ sưu tập', href: '/collections' },
          { name: 'Thu Đông 2026', href: '/shop?collection=thu-dong' }
        ]
      };
    }

    if (collectionParam === 'quiet-luxury') {
      return {
        title: 'Quiet Luxury Essentials',
        subtitle: 'Vẻ đẹp tĩnh tại, đỉnh cao chất liệu lụa, cashmere và da bê từ Lemaire, Gia Studios, COS và Lacoste',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Bộ sưu tập', href: '/collections' },
          { name: 'Quiet Luxury', href: '/shop?collection=quiet-luxury' }
        ]
      };
    }

    if (collectionParam === 'local-design') {
      return {
        title: 'Vietnam Designer Lookbook',
        subtitle: 'Sáng tạo đương đại và bản sắc may đo tinh xảo từ các nhà thiết kế Việt Nam',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Bộ sưu tập', href: '/collections' },
          { name: 'Vietnam Designer', href: '/shop?collection=local-design' }
        ]
      };
    }

    if (categoryParam === 'nu') {
      const subName = subCategoryOptions.find((s) => s.id === selectedSubCat)?.name;
      return {
        title: subName && subName !== 'Tất cả đồ Nữ' ? subName : 'Thời Trang Nữ Tuyển Chọn',
        subtitle: 'Những thiết kế đương đại tôn vinh sự thanh lịch, quý phái và tự tại của phái đẹp',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Nữ', href: '/shop?category=nu' },
          ...(subName && subName !== 'Tất cả đồ Nữ'
            ? [{ name: subName, href: `/shop?category=nu&sub=${selectedSubCat}` }]
            : [])
        ]
      };
    }

    if (categoryParam === 'nam') {
      const subName = subCategoryOptions.find((s) => s.id === selectedSubCat)?.name;
      return {
        title: subName && subName !== 'Tất cả đồ Nam' ? subName : 'Thời Trang Nam Cao Cấp',
        subtitle: 'Cấu trúc sắc sảo, phom dáng đĩnh đạc và tối giản cho quý ông hiện đại',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Nam', href: '/shop?category=nam' },
          ...(subName && subName !== 'Tất cả đồ Nam'
            ? [{ name: subName, href: `/shop?category=nam&sub=${selectedSubCat}` }]
            : [])
        ]
      };
    }

    if (categoryParam === 'tre-em') {
      return {
        title: 'Thời Trang Trẻ Em Tuyển Chọn',
        subtitle: 'Chất liệu hữu cơ tự nhiên êm ái, nâng niu làn da nhạy cảm của bé yêu',
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Trẻ em', href: '/shop?category=tre-em' }
        ]
      };
    }

    if (categoryParam === 'phu-kien') {
      return {
        title: 'Túi Xách & Phụ Kiện Thời Trang',
        subtitle: 'Điểm nhấn hoàn mỹ từ các chất liệu da thuộc và kim loại thượng hạng',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Phụ kiện', href: '/shop?category=phu-kien' }
        ]
      };
    }

    if (categoryParam === 'do-bo') {
      return {
        title: 'Đồ Bộ & Tracksuits Thể Thao Cao Cấp',
        subtitle: 'Bộ nỉ da cá, track jacket retro Beckenbauer và set đồ thể thao terrace năng động',
        image: '/images/products/adidas-varsity-bomber-tracksuit.jpg',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Đồ bộ & Tracksuits', href: '/shop?category=do-bo' }
        ]
      };
    }

    if (categoryParam === 'ao-khoac') {
      return {
        title: 'Áo Khoác, Bomber & Cardigan Cao Cấp',
        subtitle: 'Tuyển chọn áo bomber MA-1, áo khoác dạ và cardigan dệt kim từ các nhà mốt danh tiếng',
        image: '/images/products/chrome-hearts-ma1-bomber-cream.jpg',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Áo khoác', href: '/shop?category=ao-khoac' }
        ]
      };
    }

    if (categoryParam === 'ao-thun') {
      return {
        title: 'Áo Thun, Polo & Sơ Mi Thiết Kế',
        subtitle: 'Áo polo piqué, sơ mi Oxford và áo thun cotton thượng hạng từ Lacoste, Ralph Lauren, Burberry',
        image: '/images/products/lacoste-long-sleeve-polo-white.jpg',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Áo thun & Sơ mi', href: '/shop?category=ao-thun' }
        ]
      };
    }

    if (categoryParam === 'quan') {
      return {
        title: 'Quần Tây May Đo & Jeans Cao Cấp',
        subtitle: 'Phom dáng xếp ly Sartorial Ý và chất liệu denim dệt biên Selvedge thượng hạng',
        image: '/images/products/dolce-gabbana-tailored-trousers-cream.jpg',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Quần', href: '/shop?category=quan' }
        ]
      };
    }

    if (categoryParam === 'vay-dam') {
      return {
        title: 'Váy & Đầm Nữ Thiết Kế',
        subtitle: 'Những thiết kế đầm tiệc, đầm lụa satin và váy dạ hội tôn vinh vóc dáng yêu kiều của phái đẹp',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Nữ', href: '/shop?category=nu' },
          { name: 'Váy & Đầm', href: '/shop?category=vay-dam' }
        ]
      };
    }

    if (categoryParam === 'giay-dep') {
      return {
        title: 'Giày Dép & Loafer Cao Cấp',
        subtitle: 'Từ giày cao gót mũi nhọn thanh lịch đến loafer da bóng và sneaker retro thời thượng',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Phụ kiện', href: '/shop?category=phu-kien' },
          { name: 'Giày dép', href: '/shop?category=giay-dep' }
        ]
      };
    }

    if (categoryParam === 'tui-xach') {
      return {
        title: 'Túi Xách Da Cao Cấp & Clutches',
        subtitle: 'Túi kẹp nách bán nguyệt, túi tote da đựng laptop và túi chần quả trám sang trọng',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Phụ kiện', href: '/shop?category=phu-kien' },
          { name: 'Túi xách', href: '/shop?category=tui-xach' }
        ]
      };
    }

    if (originParam === 'international_order') {
      return {
        title: 'Tuyển Chọn Hàng Order Quốc Tế',
        subtitle: 'Mua trực tiếp từ các Boutique Paris, Seoul, Tokyo và Milan kèm hóa đơn chứng từ',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Hàng Order Quốc Tế', href: '/shop?origin=international_order' }
        ]
      };
    }

    if (saleParam === 'true') {
      return {
        title: 'Ưu Đãi Đặc Biệt — Flash Sale',
        subtitle: 'Cơ hội sở hữu những thiết kế giới hạn với mức giá tốt nhất mùa này',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: 'Ưu Đãi Sale', href: '/shop?sale=true' }
        ]
      };
    }

    if (queryParam) {
      return {
        title: `Kết quả tìm kiếm cho: "${queryParam}"`,
        subtitle: 'Tất cả các sản phẩm, thương hiệu và phong cách phù hợp',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85',
        breadcrumb: [
          { name: 'Trang chủ', href: '/' },
          { name: `Tìm kiếm: "${queryParam}"`, href: `/shop?q=${encodeURIComponent(queryParam)}` }
        ]
      };
    }

    return {
      title: 'Tất Cả Sản Phẩm TADA!',
      subtitle: 'Khám phá các thiết kế thời trang cao cấp từ các nhà mốt Việt Nam và quốc tế',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&auto=format&fit=crop&q=85',
      breadcrumb: [
        { name: 'Trang chủ', href: '/' },
        { name: 'Cửa hàng', href: '/shop' }
      ]
    };
  }, [categoryParam, selectedSubCat, brandParam, originParam, saleParam, collectionParam, queryParam, subCategoryOptions]);

  // Dynamic filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Collection filter
      if (collectionParam) {
        if (collectionParam === 'thu-dong') {
          const isAutumnWinter =
            p.subCategory === 'ao-khoac' ||
            p.subCategory === 'ao-len' ||
            p.category === 'ao-khoac' ||
            p.category === 'ao-len' ||
            p.name.toLowerCase().includes('khoác') ||
            p.name.toLowerCase().includes('len') ||
            p.name.toLowerCase().includes('cardigan') ||
            p.name.toLowerCase().includes('blazer');
          if (!isAutumnWinter) return false;
        } else if (collectionParam === 'quiet-luxury') {
          const quietBrands = ['lemaire', 'gia studios', 'subtle studios', 'lacoste', 'burberry'];
          if (!quietBrands.some((b) => p.brand.toLowerCase().includes(b))) return false;
        } else if (collectionParam === 'local-design') {
          if (p.origin !== 'vietnam_local_brand') return false;
        }
      }

      // 2. Category filter
      if (categoryParam) {
        const catLower = categoryParam.toLowerCase();
        const matchesCategory =
          (p.categoryId && p.categoryId.toLowerCase() === catLower) ||
          (p.category && p.category.toLowerCase() === catLower) ||
          (p.additionalCategoryIds && p.additionalCategoryIds.some((c) => c.toLowerCase() === catLower));
        if (!matchesCategory) return false;
      }

      // 3. Subcategory filter
      if (selectedSubCat && !collectionParam) {
        const subLower = selectedSubCat.toLowerCase();
        const matchesSub =
          (p.subCategoryId && p.subCategoryId.toLowerCase() === subLower) ||
          (p.subCategory && p.subCategory.toLowerCase() === subLower);
        if (!matchesSub) return false;
      }

      // 4. Brands filter
      if (selectedBrands.length > 0) {
        const matchesBrand = selectedBrands.some(
          (b) =>
            p.brand.toLowerCase() === b.toLowerCase() ||
            p.brand.toLowerCase().includes(b.toLowerCase())
        );
        if (!matchesBrand) return false;
      }

      // 5. Origin filter
      if (originParam && p.origin !== originParam) {
        return false;
      }

      // 6. Sale filter (chỉ hiện sản phẩm thực sự đang giảm giá)
      if (saleParam === 'true') {
        const hasDiscount = ((p.discountPercentage ?? 0) > 0) || p.isSale;
        if (!hasDiscount) return false;
      }

      // 7. Color filter
      if (selectedColor) {
        const hasColor = p.colors?.some((c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // 8. Size filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => p.sizes?.includes(s));
        if (!hasSize) return false;
      }

      // 9. Price filter
      if (p.price > priceRange) return false;

      // 10. Stock status
      if (stockStatus === 'in_stock' && p.origin === 'international_order') return false;
      if (stockStatus === 'order' && p.origin !== 'international_order') return false;

      // 11. Search query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') {
        const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return timeB - timeA || (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      if (sortBy === 'best_seller') {
        return (b.salesCount || 0) - (a.salesCount || 0) || (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
      if (sortBy === 'most_searched') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'discount') {
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      }
      // Mặc định: Phổ biến (kết hợp lượt bán + xem + rating)
      const scoreA = (a.salesCount || 0) * 5 + (a.viewsCount || 0) + (a.rating || 5) * 2;
      const scoreB = (b.salesCount || 0) * 5 + (b.viewsCount || 0) + (b.rating || 5) * 2;
      return scoreB - scoreA;
    });
  }, [
    products,
    collectionParam,
    categoryParam,
    selectedSubCat,
    selectedBrands,
    originParam,
    saleParam,
    selectedColor,
    selectedSizes,
    priceRange,
    stockStatus,
    queryParam,
    sortBy
  ]);

  // Real Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Curated recommendations if 3 or fewer items
  const suggestedProducts = useMemo(() => {
    if (filteredProducts.length > 3) return [];
    return products.filter(
      (p) => !filteredProducts.some((fp) => fp.id === p.id)
    ).slice(0, 4);
  }, [products, filteredProducts]);

  // Active filters count and list for chips
  const activeFilters = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];
    if (selectedSubCat) {
      const name = subCategoryOptions.find((s) => s.id === selectedSubCat)?.name || selectedSubCat;
      list.push({ id: 'sub', label: name, onRemove: () => setSelectedSubCat('') });
    }
    selectedBrands.forEach((b) => {
      list.push({ id: `brand-${b}`, label: b, onRemove: () => toggleBrand(b) });
    });
    if (selectedColor) {
      list.push({ id: 'color', label: `Màu: ${selectedColor}`, onRemove: () => setSelectedColor('') });
    }
    selectedSizes.forEach((s) => {
      list.push({ id: `size-${s}`, label: `Size: ${s}`, onRemove: () => toggleSize(s) });
    });
    if (priceRange < 30000000) {
      list.push({ id: 'price', label: `Dưới ${formatPrice(priceRange)}`, onRemove: () => setPriceRange(30000000) });
    }
    if (stockStatus !== 'all') {
      list.push({
        id: 'stock',
        label: stockStatus === 'in_stock' ? 'Hàng có sẵn' : 'Hàng Order',
        onRemove: () => setStockStatus('all')
      });
    }
    return list;
  }, [selectedSubCat, selectedBrands, selectedColor, selectedSizes, priceRange, stockStatus, subCategoryOptions]);

  // Sidebar component reused in desktop & mobile drawer
  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Header Bộ lọc + nút Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
        <span className="text-xs font-bold text-[#171613] uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#C7A66A]" />
          Bộ lọc tìm kiếm
        </span>
        {activeFilters.length > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#B83A3A] hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa lọc ({activeFilters.length})
          </button>
        )}
      </div>

      {/* 1. Danh mục / Phân loại */}
      <div>
        <h3 className="text-xs font-semibold text-[#171613] uppercase tracking-[0.05em] mb-2.5">
          {collectionParam ? 'Bộ Sưu Tập' : 'Phân Loại'}
        </h3>
        <div className="space-y-1 text-xs">
          {subCategoryOptions.map((sub, i) => {
            const isSelected = collectionParam
              ? collectionParam === sub.id
              : selectedSubCat === sub.id;

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (collectionParam) {
                    if (sub.id) {
                      router.push(`/shop?collection=${sub.id}`);
                    } else {
                      router.push('/shop');
                    }
                  } else if (!categoryParam) {
                    if (sub.id) {
                      router.push(`/shop?category=${sub.id}`);
                    } else {
                      setSelectedSubCat('');
                      setCurrentPage(1);
                    }
                  } else {
                    setSelectedSubCat(sub.id);
                    setCurrentPage(1);
                  }
                }}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded transition-colors text-left ${
                  isSelected
                    ? 'bg-[#171613] text-white font-semibold shadow-sm'
                    : 'text-[#747069] hover:bg-[#FAF8F3] hover:text-[#171613]'
                }`}
              >
                <span>{sub.name}</span>
                {isSelected && <Check className="w-3 h-3 text-[#C7A66A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Thương hiệu */}
      <div className="pt-4 border-t border-[#F0ECE1]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[#171613] uppercase tracking-[0.05em]">
            Thương hiệu
          </h3>
          <span className="text-[10px] text-[#A8A29E] font-normal tabular-nums">{BRANDS.length} hãng</span>
        </div>
        <div className="relative mb-2.5">
          <input
            type="text"
            placeholder="Tìm thương hiệu..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 pl-7 text-[11px] text-[#171613] focus:outline-none focus:border-[#171613]"
          />
          <Search className="w-3 h-3 text-[#A8A29E] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1">
          {brandList
            .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .map((b, i) => (
              <label
                key={i}
                className="flex items-center justify-between cursor-pointer py-1 px-1 rounded text-[#747069] hover:bg-[#FAF8F3] hover:text-[#171613]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.name)}
                    onChange={() => toggleBrand(b.name)}
                    className="rounded accent-[#171613]"
                  />
                  <span className={selectedBrands.includes(b.name) ? 'font-bold text-[#171613]' : ''}>
                    {b.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#A8A29E]">({b.country})</span>
              </label>
            ))}
        </div>
      </div>

      {/* 3. Màu sắc */}
      <div className="pt-4 border-t border-[#F0ECE1]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider">
            Màu sắc
          </h3>
          {selectedColor && (
            <button
              onClick={() => setSelectedColor('')}
              className="text-[10px] text-[#B83A3A] hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <button
              key={i}
              title={c.name}
              onClick={() => {
                setSelectedColor(selectedColor === c.name ? '' : c.name);
                setCurrentPage(1);
              }}
              className={`w-6 h-6 rounded-full border transition-all ${
                selectedColor === c.name
                  ? 'ring-2 ring-offset-2 ring-[#171613] scale-110 shadow-sm'
                  : 'border-[#D5CEC2] hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        {selectedColor && (
          <p className="text-[11px] text-[#8A7158] mt-2 font-medium">
            Đang chọn: <strong>{selectedColor}</strong>
          </p>
        )}
      </div>

      {/* 4. Kích thước */}
      <div className="pt-4 border-t border-[#F0ECE1]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider">
            Kích thước
          </h3>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => setSelectedSizes([])}
              className="text-[10px] text-[#B83A3A] hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s, i) => {
            const isChecked = selectedSizes.includes(s);
            return (
              <button
                key={i}
                onClick={() => toggleSize(s)}
                className={`w-9 h-7 rounded text-[11px] font-bold border transition-colors ${
                  isChecked
                    ? 'bg-[#171613] text-white border-[#171613]'
                    : 'bg-[#FAF8F3] text-[#524E48] border-[#E8E4DC] hover:border-[#171613]'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Khoảng giá */}
      <div className="pt-4 border-t border-[#F0ECE1]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider">
            Mức giá tối đa
          </h3>
          <span className="text-xs font-bold text-[#B83A3A]">
            {formatPrice(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="100000"
          max="3000000"
          step="50000"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full accent-[#171613] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#A8A29E] mt-1">
          <span>100.000đ</span>
          <span>3.000.000đ</span>
        </div>
      </div>

      {/* 6. Nguồn gốc & Tình trạng */}
      <div className="pt-4 border-t border-[#F0ECE1]">
        <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider mb-2.5">
          Nguồn gốc & Tình trạng
        </h3>
        <div className="space-y-1.5 text-xs text-[#747069]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockStatus === 'all'}
              onChange={() => {
                setStockStatus('all');
                setCurrentPage(1);
              }}
              className="accent-[#171613]"
            />
            <span>Tất cả nguồn hàng</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockStatus === 'in_stock'}
              onChange={() => {
                setStockStatus('in_stock');
                setCurrentPage(1);
              }}
              className="accent-[#171613]"
            />
            <span>Hàng có sẵn (Giao hỏa tốc 2-24h)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              checked={stockStatus === 'order'}
              onChange={() => {
                setStockStatus('order');
                setCurrentPage(1);
              }}
              className="accent-[#171613]"
            />
            <span>Hàng order quốc tế (Paris, Seoul)</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dynamic Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#747069] flex-wrap">
          {bannerInfo.breadcrumb.map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-[#A8A29E]" />}
              {idx === bannerInfo.breadcrumb.length - 1 ? (
                <span className="text-[#171613] font-semibold">{bc.name}</span>
              ) : (
                <Link href={bc.href} className="hover:text-[#171613] transition-colors">
                  {bc.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Dynamic Editorial Banner with SafeImage */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#D5CEC2]/60 via-[#E8D7BD]/40 to-[#FAF8F3] border border-[#D5CEC2] p-6 sm:p-8 flex items-center justify-between min-h-[140px] shadow-sm">
          <div className="max-w-xl z-10 space-y-2">
            {saleParam === 'true' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B83A3A] text-white text-[11px] font-bold rounded-full shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                <span>FLASH SALE ĐẶC BIỆT</span>
                <span className="text-[#FAF8F3]/80">·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[#171613] leading-[1.2]">
              {bannerInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#747069] line-clamp-2 leading-relaxed">
              {bannerInfo.subtitle}
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px] text-[#8A7158]">
              <span className="font-semibold tabular-nums">{filteredProducts.length} sản phẩm khả dụng</span>
              {collectionParam && (
                <Link
                  href="/collections"
                  className="bg-[#171613] hover:bg-[#333] text-white text-[10px] px-2.5 py-0.5 rounded transition-colors"
                >
                  Xem tất cả Lookbooks →
                </Link>
              )}
              {selectedBrands.length > 0 && (
                <span className="bg-[#171613] text-white text-[10px] px-2 py-0.5 rounded">
                  {selectedBrands.join(', ')}
                </span>
              )}
            </div>
          </div>
          <div className="relative w-36 h-36 sm:w-52 sm:h-44 shrink-0 -my-6 sm:-my-8 mr-2 hidden sm:block rounded-xl overflow-hidden shadow-inner border border-white/40">
            <SafeImage
              src={bannerInfo.image}
              alt={bannerInfo.title}
              fill
              className="object-cover object-top"
              sizes="200px"
            />
          </div>
        </div>

        {/* Bố Cục 2 Cột: Sidebar Bộ Lọc Trái + Lưới Sản Phẩm Phải */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* CỘT TRÁI: DESKTOP SIDEBAR BỘ LỌC (3 Cột) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-[#E8E4DC] p-5 shadow-sm sticky top-24">
            {renderFilterSidebar()}
          </aside>

          {/* MOBILE FILTER TRIGGER BAR (Hiển thị trên Mobile & Tablet < 1024px) */}
          <div className="lg:hidden col-span-1 flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E8E4DC] shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#171613] text-white text-xs font-semibold rounded-lg"
            >
              <Filter className="w-3.5 h-3.5 text-[#C7A66A]" />
              <span>Bộ lọc tìm kiếm</span>
              {activeFilters.length > 0 && (
                <span className="w-4 h-4 bg-[#B83A3A] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF8F3] border border-[#E8E4DC] text-[#171613] text-xs py-2 px-3 rounded-lg focus:outline-none"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="best_seller">Bán chạy nhất</option>
              <option value="most_searched">Được tìm kiếm nhiều</option>
              <option value="newest">Hàng mới về</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="discount">Giảm giá nhiều nhất</option>
            </select>
          </div>

          {/* MOBILE FILTER MODAL DRAWER */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-[#171613]/60 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#F4F1EA]">
                  <span className="font-editorial text-base font-bold text-[#171613]">Bộ lọc tìm kiếm</span>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1.5 rounded-full hover:bg-[#E8E4DC] text-[#171613]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                  {renderFilterSidebar()}
                </div>
                <div className="p-4 border-t border-[#E8E4DC] bg-[#FAF8F3]">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-2.5 bg-[#171613] text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wider"
                  >
                    Áp dụng ({filteredProducts.length} sản phẩm)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CỘT PHẢI: LƯỚI SẢN PHẨM (9 Cột) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Thanh Công Cụ & Sắp Xếp Trên Desktop */}
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-[#E8E4DC] shadow-sm">
              <div className="text-xs text-[#747069]">
                Hiển thị <strong className="text-[#171613]">{filteredProducts.length}</strong> sản phẩm
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#747069]">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF8F3] border border-[#E8E4DC] text-[#171613] text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-[#171613] font-medium"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="best_seller">Bán chạy nhất</option>
                  <option value="most_searched">Được tìm kiếm nhiều</option>
                  <option value="newest">Hàng mới về</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="discount">Giảm giá nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Dải Chips Bộ Lọc Đang Áp Dụng */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#747069] mr-1">Đang lọc:</span>
                {activeFilters.map((af) => (
                  <span
                    key={af.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#171613] text-white text-[11px] rounded-full shadow-sm"
                  >
                    <span>{af.label}</span>
                    <button
                      onClick={af.onRemove}
                      className="hover:text-[#C78238] transition-colors"
                      title="Xóa bộ lọc này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#B83A3A] hover:underline ml-2 font-medium"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* LƯỚI SẢN PHẨM: Tự Thích Ứng Theo Chiều Rộng */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-5 sm:gap-6 ${
                  filteredProducts.length === 1
                    ? 'grid-cols-1 max-w-sm'
                    : filteredProducts.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                    : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                }`}
              >
                {paginatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE CHUYÊN NGHIỆP */
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-[#FAF8F3] border border-[#E8E4DC] rounded-full flex items-center justify-center mx-auto text-[#8A7158]">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-base font-editorial font-bold text-[#171613]">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại
                </h3>
                <p className="text-xs text-[#747069] max-w-md mx-auto leading-relaxed">
                  Có thể các tiêu chí về màu sắc, kích cỡ hoặc mức giá của bạn đang quá giới hạn. Hãy thử điều chỉnh lại bộ lọc để khám phá các thiết kế khác.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-[#171613] hover:bg-[#333] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C7A66A]" />
                    <span>Xóa toàn bộ bộ lọc và xem tất cả</span>
                  </button>
                </div>
              </div>
            )}

            {/* GỢI Ý THÊM NẾU DANH MỤC CÓ ÍT SẢN PHẨM (Ví dụ Trẻ Em) */}
            {suggestedProducts.length > 0 && (
              <div className="pt-8 border-t border-[#E8E4DC] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#171613]">
                      Gợi Ý Các Thiết Kế Được Yêu Thích Khác
                    </h3>
                    <p className="text-xs text-[#747069]">
                      Tuyển chọn sản phẩm bán chạy nhất tại TADA! dành cho bạn
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="text-xs text-[#8A7158] hover:text-[#171613] font-medium"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {suggestedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PHÂN TRANG THỰC TẾ (CHỈ HIỂN THỊ KHI TOTAL PAGES > 1) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-[#E8E4DC] bg-white text-xs text-[#747069] hover:bg-[#FAF8F3] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                  aria-label="Trang trước"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-[#171613] text-white shadow-sm'
                        : 'border border-[#E8E4DC] bg-white text-[#747069] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-[#E8E4DC] bg-white text-xs text-[#747069] hover:bg-[#FAF8F3] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold"
                  aria-label="Trang tiếp"
                >
                  ›
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm font-editorial">Đang tải cửa hàng TADA!...</div>}>
      <ShopContent />
    </Suspense>
  );
}
