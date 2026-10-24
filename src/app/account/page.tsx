'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  User as UserIcon,
  MapPin,
  Package,
  Heart,
  Tag,
  Headphones,
  Settings,
  ChevronRight,
  ArrowRight,
  Check,
  Copy,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  KeyRound,
  ShieldAlert,
  Award,
  Gift,
  Sparkles,
  TrendingUp,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  ExternalLink,
  Crown,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  RefreshCw,
  LogOut,
  Camera,
  Upload,
  Landmark,
  Building2,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth, LOYALTY_TIERS } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { SafeImage } from '@/components/ui/SafeImage';
import { AddressCascadeSelect } from '@/components/checkout/AddressCascadeSelect';
import { Product, ProductOrigin } from '@/types';

export default function AccountPage() {
  const {
    user,
    orders,
    isAdmin,
    isLoading,
    activeTierDetails,
    getMembershipDiscountPercent,
    getNextTierInfo,
    loginWithEmail,
    loginWithAdmin,
    register,
    logout,
    updateProfile
  } = useAuth();

  const { products, addProduct, updatePrice, deleteProduct } = useProducts();
  const { totalWishlist, wishlist } = useWishlist();

  // Tránh tình trạng loading xoay vô hạn nếu mạng chậm hoặc lỗi
  const [forceReady, setForceReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setForceReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Active Menu trong hồ sơ
  const [activeMenu, setActiveMenu] = useState<'overview' | 'membership' | 'admin_panel' | 'orders' | 'profile' | 'addresses' | 'wishlist' | 'coupons' | 'support' | 'settings'>('overview');

  // Form đăng nhập / đăng ký state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAdminLoginForm, setIsAdminLoginForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sửa giá inline cho Admin
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempOriginalPrice, setTempOriginalPrice] = useState<number>(0);

  // Modal thêm sản phẩm mới cho Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('TADA! Signature');
  const [newProdPrice, setNewProdPrice] = useState<number>(850000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(1100000);
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdCategory, setNewProdCategory] = useState('nu');
  const [newProdOrigin, setNewProdOrigin] = useState<ProductOrigin>('vietnam_local_brand');
  const [newProdImage, setNewProdImage] = useState('/images/products/dress-1.jpg');

  // Filter tìm sản phẩm trong Admin Panel
  const [productSearch, setProductSearch] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const nextTierInfo = getNextTierInfo();

  // Profile customization state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileCover, setProfileCover] = useState('');
  const [profileAddress, setProfileAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: ''
  });

  // Admin Bank Info State
  const [bankName, setBankName] = useState('MBBank');
  const [bankAccount, setBankAccount] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankHotline, setBankHotline] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileAvatar(user.avatar || '');
      setProfileCover(user.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80');
      if (user.addresses && user.addresses.length > 0) {
        setProfileAddress({
          fullName: user.addresses[0].fullName || user.name || '',
          phone: user.addresses[0].phone || user.phone || '',
          address: user.addresses[0].address || '',
          ward: user.addresses[0].ward || '',
          district: user.addresses[0].district || '',
          city: user.addresses[0].city || ''
        });
      } else {
        setProfileAddress({
          fullName: user.name || '',
          phone: user.phone || '',
          address: '',
          ward: '',
          district: '',
          city: ''
        });
      }
      if (user.bankInfo) {
        setBankName(user.bankInfo.bankName || 'MBBank');
        setBankAccount(user.bankInfo.accountNumber || '');
        setBankHolder(user.bankInfo.accountHolder || '');
        setBankBranch(user.bankInfo.branch || '');
        setBankHotline(user.bankInfo.hotline || '');
      }
    });
  }, [user]);

  const handleUploadImageFile = async (file: File, target: 'avatar' | 'cover') => {
    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === 'avatar') {
          setProfileAvatar(data.url);
        } else {
          setProfileCover(data.url);
        }
      } else {
        alert(data.message || 'Tải ảnh thất bại');
      }
    } catch {
      alert('Không thể kết nối máy chủ để tải ảnh.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const updates: any = {
        name: profileName,
        phone: profilePhone,
        avatar: profileAvatar,
        coverImage: profileCover,
        addresses: profileAddress.address.trim() ? [
          {
            fullName: profileAddress.fullName || profileName,
            phone: profileAddress.phone || profilePhone,
            email: user?.email || '',
            address: profileAddress.address.trim(),
            ward: profileAddress.ward.trim(),
            district: profileAddress.district.trim(),
            city: profileAddress.city.trim()
          }
        ] : []
      };

      if (isAdmin) {
        updates.bankInfo = {
          bankName,
          accountNumber: bankAccount,
          accountHolder: bankHolder.toUpperCase(),
          branch: bankBranch,
          hotline: bankHotline
        };

        // Đồng bộ trực tiếp vào cấu hình thanh toán shop
        fetch('/api/bank-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates.bankInfo)
        }).catch(() => {});
      }

      const res = await updateProfile(updates);
      if (res.success) {
        setProfileSuccessMsg('Đã lưu thông tin hồ sơ và cấu hình thành công!');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      } else {
        setProfileErrorMsg(res.message);
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Lỗi khi lưu thông tin');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Xử lý đăng nhập khách hàng & Admin
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!emailInput.trim()) {
      setAuthError('Vui lòng nhập địa chỉ email.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isAdminLoginForm || emailInput.trim().toLowerCase() === 'admin@tada.vn') {
        const res = await loginWithAdmin(emailInput, passwordInput, adminPinInput);
        if (res.success) {
          setAuthSuccess(res.message);
          setActiveMenu('overview');
        } else {
          setAuthError(res.message);
        }
      } else {
        const res = await loginWithEmail(emailInput, passwordInput);
        if (res.success) {
          setAuthSuccess(res.message);
        } else {
          setAuthError(res.message);
          if (res.requires2FA) {
            setIsAdminLoginForm(true);
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý đăng ký thành viên mới
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!nameInput.trim() || !emailInput.trim() || !phoneInput.trim()) {
      setAuthError('Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(nameInput, emailInput, phoneInput, passwordInput);
      if (res.success) {
        setAuthSuccess(res.message);
      } else {
        setAuthError(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý lưu sửa giá
  const handleSavePrice = (id: string) => {
    if (tempPrice <= 0) return;
    updatePrice(id, tempPrice, tempOriginalPrice);
    setEditingPriceId(null);
  };

  // Xử lý thêm sản phẩm
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || newProdPrice <= 0) return;

    addProduct({
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: newProdBrand,
      origin: newProdOrigin,
      badges: [newProdOrigin === 'vietnam_local_brand' ? 'LOCAL BRAND' : 'ORDER QUỐC TẾ'],
      category: newProdCategory,
      price: newProdPrice,
      originalPrice: newProdOriginalPrice,
      rating: 5,
      reviewCount: 0,
      inStock: newProdStock > 0,
      stockCount: newProdStock,
      estimatedDelivery: newProdOrigin === 'international_order' ? '7-12 ngày (Order Quốc Tế)' : 'Hỏa tốc 2-4h (Nội thành)',
      images: [newProdImage],
      colors: [{ name: 'Màu Tiêu Chuẩn', hex: '#171613' }],
      sizes: ['S', 'M', 'L'],
      description: 'Sản phẩm thời trang cao cấp được kiểm duyệt bởi TADA! Studio.',
      material: 'Chất liệu thượng hạng thoáng mát',
      careInstructions: ['Giặt khô hoặc giặt nhẹ bằng tay', 'Ủi ở nhiệt độ thấp']
    });

    setIsAddModalOpen(false);
    setNewProdName('');
  };

  // Loading state khi đang kiểm tra phiên làm việc từ server (tối đa 1.5s, không bao giờ treo vô hạn)
  if (isLoading && !forceReady) {
    return (
      <div className="bg-[#FAF8F3] min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#171613] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#747069]">Đang tải thông tin tài khoản...</p>
          <button
            onClick={() => setForceReady(true)}
            className="text-[11px] text-[#8A7158] underline hover:text-[#171613] transition-colors"
          >
            Bỏ qua chờ và vào ngay
          </button>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP C: NGƯỜI CHƯA ĐĂNG NHẬP -> GIAO DIỆN ĐĂNG NHẬP / ĐĂNG KÝ
  if (!user) {
    return (
      <div className="bg-[#FAF8F3] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header chào mừng */}
          <div className="text-center space-y-2">
            <span className="text-[11px] font-semibold text-[#8A7158] uppercase tracking-[0.08em]">
              TÀI KHOẢN TADA!
            </span>
            <h1 className="font-editorial text-3xl font-medium text-[#171613]">
              Chào Mừng Đến Với TADA!
            </h1>
            <p className="text-xs text-[#747069]">
              Đăng nhập để theo dõi đơn hàng, quản lý hồ sơ và nhận ưu đãi độc quyền.
            </p>
          </div>

          {/* Form Card chính */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-8 shadow-sm">
            {/* 2 Tabs: Đăng Nhập | Đăng Ký */}
            <div className="flex border-b border-[#E8E4DC] mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'border-[#171613] text-[#171613]'
                    : 'border-transparent text-[#A8A29E] hover:text-[#171613]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'register'
                    ? 'border-[#171613] text-[#171613]'
                    : 'border-transparent text-[#A8A29E] hover:text-[#171613]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký</span>
              </button>
            </div>

            {/* Thông báo lỗi / thành công */}
            {authError && (
              <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* FORM 1: ĐĂNG NHẬP */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Email tài khoản *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (e.target.value.toLowerCase().includes('admin')) {
                        setIsAdminLoginForm(true);
                      }
                    }}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                {/* Nếu là tài khoản Admin: hiển thị thêm ô nhập PIN 2FA */}
                {isAdminLoginForm && (
                  <div className="p-3.5 bg-[#FAF4E8] border border-[#E8D7BD] rounded-xl space-y-2">
                    <label className="text-xs font-bold text-[#8A5A36] flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Mã PIN Xác Thực Quản Trị Viên (2FA PIN) *</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mã PIN (Mặc định: 1234 hoặc 888999)"
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      className="w-full bg-white border border-[#E8E4DC] rounded-lg p-2.5 text-xs text-center font-mono tracking-widest text-[#171613] focus:outline-none focus:border-[#8A5A36]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập'}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8E4DC]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#A8A29E] font-medium text-[10px]">Hoặc tiếp tục với</span>
                  </div>
                </div>

                <a
                  href="/api/auth/google"
                  className="w-full py-2.5 px-4 border border-[#E8E4DC] hover:border-[#171613] rounded-xl flex items-center justify-center gap-3 text-xs font-semibold text-[#171613] bg-white hover:bg-[#FAF8F3] transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Tiếp tục với Google</span>
                </a>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminLoginForm(!isAdminLoginForm)}
                    className="text-[11px] text-[#747069] hover:text-[#171613] underline"
                  >
                    {isAdminLoginForm ? 'Chuyển về form đăng nhập khách hàng' : 'Đăng nhập với tư cách Quản trị viên'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: ĐĂNG KÝ MỚI */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Trần Minh Anh"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Địa chỉ Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Số điện thoại nhận hàng *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0908 123 456"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#171613] block mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                  />
                </div>

                <div className="p-3 bg-[#FFF9E6] border border-[#FDE68A] rounded-xl text-[11px] text-[#92400E] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>Đăng ký thành viên nhận ngay 2.000 điểm thưởng chào mừng!</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản Thành Viên'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP A & B: ĐÃ ĐĂNG NHẬP (ADMIN HOẶC KHÁCH HÀNG THẬT)
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* BỐ CỤC 2 CỘT CHUẨN: MENU TRÁI (3 CỘT) + NỘI DUNG PHẢI (9 CỘT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT MENU ĐIỀU HƯỚNG BÊN TRÁI (CHUẨN 100% THEO ẢNH) */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Card thông tin user tóm tắt ở đầu sidebar */}
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E8E4DC] bg-[#FAF8F3] shrink-0">
                {user.avatar ? (
                  <SafeImage
                    src={user.avatar}
                    fallbackSrc="/images/placeholder-fashion.svg"
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#171613] text-[#FAF8F3] flex items-center justify-center font-bold text-base">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-xs text-[#171613] truncate">{user.name}</h3>
                <span className="text-[10px] text-[#747069] block mt-0.5">
                  {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </div>
            </div>

            {/* Menu điều hướng */}
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-3 shadow-xs space-y-1">
              {/* Nếu là Admin: hiển thị liên kết Quản Trị Hệ Thống trang nhã */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors bg-[#171613] text-[#C7A66A] hover:bg-[#8A7158] hover:text-white mb-2 shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#C7A66A]" />
                    <span>Trang Quản Trị Kho & Đơn</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Các menu chung */}
              {[
                { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
                { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
                { id: 'addresses', label: 'Địa chỉ nhận hàng', icon: MapPin },
                { id: 'coupons', label: 'Mã giảm giá', icon: Tag },
                ...(!isAdmin ? [{ id: 'membership', label: 'Điểm thưởng & Hạng', icon: Award }] : []),
                { id: 'wishlist', label: `Yêu thích (${totalWishlist})`, icon: Heart },
                { id: 'profile', label: 'Hồ sơ cá nhân', icon: UserIcon },
                { id: 'settings', label: 'Cài đặt', icon: Settings }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveMenu(m.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded-xl transition-colors text-left ${
                      activeMenu === m.id
                        ? 'bg-[#FAF8F3] text-[#171613] font-semibold'
                        : 'text-[#747069] hover:bg-[#FAF8F3] hover:text-[#171613]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0 text-[#8A7158]" />
                      <span>{m.label}</span>
                    </div>
                  </button>
                );
              })}

              {/* Nút Đăng Xuất nằm ở cuối sidebar */}
              <div className="pt-2 border-t border-[#F0ECE1]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]/50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>

          {/* CỘT NỘI DUNG CHÍNH (9 CỘT) */}
          <main className="lg:col-span-9 space-y-6">
            {/* TAB: TỔNG QUAN (OVERVIEW) */}
            {activeMenu === 'overview' && (
              <div className="space-y-6">
                {/* Banner chào mừng & Lookbook */}
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="space-y-1.5 z-10 max-w-lg">
                    <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613]">
                      Xin chào, {user.name}!
                    </h1>
                    <p className="text-xs text-[#747069]">
                      Cảm ơn bạn đã đồng hành cùng TADA!
                    </p>
                    <p className="text-xs text-[#747069] pt-1">
                      Khám phá những sản phẩm thời trang yêu thích và trải nghiệm mua sắm tuyệt vời nhé!
                    </p>
                  </div>

                  <div className="relative w-48 h-28 rounded-xl overflow-hidden shrink-0 border border-[#E8E4DC] bg-[#FAF8F3]">
                    <SafeImage
                      src="/images/products/lacoste-hooded-knit-cardigan-navy.jpg"
                      alt="TADA! Lookbook"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2.5">
                      <span className="text-[10px] text-white font-editorial italic tracking-wider">Style For Your Story</span>
                    </div>
                  </div>
                </div>

                {/* 4 Thẻ tóm tắt chỉ số */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#8A7158]" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-[#171613] block tabular-nums">
                        {orders.length}
                      </span>
                      <span className="text-[10px] text-[#747069]">Đơn hàng</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0">
                      <Heart className="w-5 h-5 text-[#8A7158]" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-[#171613] block tabular-nums">
                        {totalWishlist}
                      </span>
                      <span className="text-[10px] text-[#747069]">Sản phẩm yêu thích</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-[#8A7158]" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-[#171613] block tabular-nums">
                        3
                      </span>
                      <span className="text-[10px] text-[#747069]">Mã giảm giá</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5 text-[#8A7158]" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-[#C78238] block tabular-nums">
                        {user.points ? user.points.toLocaleString('vi-VN') : 0} đ
                      </span>
                      <span className="text-[10px] text-[#747069]">Điểm thưởng</span>
                    </div>
                  </div>
                </div>

                {/* Đơn hàng gần đây */}
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                    <h2 className="text-sm font-bold text-[#171613]">
                      Đơn hàng gần đây
                    </h2>
                    <button
                      onClick={() => setActiveMenu('orders')}
                      className="text-xs text-[#747069] hover:text-[#171613] flex items-center gap-1 font-medium"
                    >
                      <span>Xem tất cả đơn hàng →</span>
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-[#747069] py-4 text-center">
                      Bạn chưa có đơn hàng nào tại TADA!.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#F0ECE1]">
                      {orders.slice(0, 3).map((ord) => {
                        const firstItem = ord.items[0];
                        const dateFormatted = new Date(ord.createdAt).toLocaleDateString('vi-VN');
                        const totalQty = ord.items.reduce((sum, i) => sum + i.quantity, 0);

                        return (
                          <div
                            key={ord.id}
                            className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-14 rounded-lg bg-[#FAF8F3] overflow-hidden shrink-0 border border-[#E8E4DC]">
                                <SafeImage
                                  src={firstItem?.image || '/images/products/dress-1.jpg'}
                                  alt={firstItem?.productName || ''}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-[#171613]">
                                    {ord.orderCode || `#${ord.id}`}
                                  </span>
                                  <span className="text-[11px] text-[#A8A29E]">{dateFormatted}</span>
                                </div>
                                <div className="mt-1">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                      ord.status === 'delivered'
                                        ? 'bg-[#DCFCE7] text-[#15803D]'
                                        : ord.status === 'cancelled'
                                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                                        : ord.status === 'shipping'
                                        ? 'bg-[#E0F2FE] text-[#0369A1]'
                                        : 'bg-[#FEF3C7] text-[#D97706]'
                                    }`}
                                  >
                                    {ord.statusLabel || ord.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-center text-[11px] text-[#747069] hidden sm:block">
                              {totalQty} sản phẩm
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-4">
                              <span className="font-bold text-[#171613] text-sm">
                                {formatPrice(ord.total)}
                              </span>
                              <Link
                                href={`/order-success/${ord.id}`}
                                className="px-3 py-1 bg-[#FAF8F3] hover:bg-[#E8D7BD] text-[#171613] rounded-lg border border-[#E8E4DC] text-xs font-semibold"
                              >
                                Xem chi tiết &gt;
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2 Khối chân: Địa chỉ giao hàng mặc định & Mã giảm giá */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                      <h4 className="font-bold text-[#171613]">Địa chỉ giao hàng mặc định</h4>
                      <button onClick={() => setActiveMenu('addresses')} className="text-[#8A7158] hover:underline">
                        Chỉnh sửa →
                      </button>
                    </div>
                    {user.addresses && user.addresses.length > 0 ? (
                      <div className="text-[#747069] space-y-1">
                        <p className="font-semibold text-[#171613]">{user.addresses[0].fullName}</p>
                        <p>{user.addresses[0].phone}</p>
                        <p>{user.addresses[0].address}, {user.addresses[0].ward}, {user.addresses[0].district}, {user.addresses[0].city}</p>
                      </div>
                    ) : (
                      <p className="text-[#747069]">Chưa có địa chỉ giao hàng nào được lưu.</p>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                      <h4 className="font-bold text-[#171613]">Mã giảm giá của bạn</h4>
                      <button onClick={() => setActiveMenu('coupons')} className="text-[#8A7158] hover:underline">
                        Xem tất cả →
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC]">
                      <div>
                        <span className="font-mono font-bold text-[#171613] block">TADAVIP</span>
                        <span className="text-[10px] text-[#747069]">Giảm 10% tổng đơn hàng</span>
                      </div>
                      <button
                        onClick={() => handleCopyCoupon('TADAVIP')}
                        className="px-2.5 py-1 bg-white border border-[#E8E4DC] rounded-lg text-[10px] font-semibold text-[#171613]"
                      >
                        {copiedCoupon === 'TADAVIP' ? 'Đã sao chép' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ĐƠN HÀNG CỦA TÔI */}
            {activeMenu === 'orders' && (
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
                  <h2 className="text-sm font-bold text-[#171613]">
                    Lịch sử đơn hàng của tôi ({orders.length})
                  </h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-10 h-10 text-[#A8A29E] mx-auto" />
                    <p className="text-xs text-[#747069]">Bạn chưa có đơn hàng nào.</p>
                    <Link
                      href="/shop"
                      className="inline-block px-4 py-2 bg-[#171613] text-white text-xs font-semibold rounded-xl"
                    >
                      Bắt đầu mua sắm
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const dateFormatted = new Date(ord.createdAt).toLocaleDateString('vi-VN');
                      return (
                        <div
                          key={ord.id}
                          className="border border-[#E8E4DC] rounded-2xl p-4 space-y-3 hover:border-[#171613] transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0ECE1] text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#171613]">
                                {ord.orderCode || `#${ord.id}`}
                              </span>
                              <span className="text-[#747069]">· Ngày đặt: {dateFormatted}</span>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                ord.status === 'delivered'
                                  ? 'bg-[#DCFCE7] text-[#15803D]'
                                  : ord.status === 'cancelled'
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : ord.status === 'shipping'
                                  ? 'bg-[#E0F2FE] text-[#0369A1]'
                                  : 'bg-[#FEF3C7] text-[#D97706]'
                              }`}
                            >
                              {ord.statusLabel || ord.status}
                            </span>
                          </div>

                          <div className="divide-y divide-[#F0ECE1]">
                            {ord.items.map((item, i) => (
                              <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-[#E8E4DC] bg-[#FAF8F3] shrink-0">
                                    <SafeImage src={item.image} alt={item.productName} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-[#171613] line-clamp-1">{item.productName}</h4>
                                    <p className="text-[11px] text-[#747069]">
                                      {item.brand} · {item.color} · Size: {item.size} · x{item.quantity}
                                    </p>
                                    {(ord.status === 'delivered' || ord.status === 'confirmed' || ord.status === 'shipping') && (
                                      <Link
                                        href={`/product/${item.productId}`}
                                        className="inline-block mt-1 text-[10px] font-bold text-[#8A7158] hover:underline"
                                      >
                                        ★ Đánh giá sản phẩm này
                                      </Link>
                                    )}
                                  </div>
                                </div>
                                <span className="font-bold text-[#171613]">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE1] text-xs">
                            <div className="text-[#747069] text-[11px]">
                              <span>Vận chuyển: {ord.carrier || 'TADA! Express'} · Thanh toán: {ord.paymentMethod.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/order-success/${ord.id}`}
                                className="text-[11px] font-semibold text-[#8A7158] hover:underline"
                              >
                                Xem phiếu đơn hàng
                              </Link>
                              <div className="text-right">
                                <span className="text-[#747069] mr-2">Tổng tiền:</span>
                                <strong className="text-sm text-[#B83A3A] font-bold">{formatPrice(ord.total)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: HỒ SƠ CÁ NHÂN */}
            {activeMenu === 'profile' && (
              <form onSubmit={handleSaveProfileForm} className="space-y-6">
                {/* Ẩn file input phục vụ đổi avatar và cover image */}
                <input
                  type="file"
                  ref={avatarInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadImageFile(e.target.files[0], 'avatar');
                    }
                  }}
                />
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadImageFile(e.target.files[0], 'cover');
                    }
                  }}
                />

                {/* KHUNG HÌNH NỀN & AVATAR PROFILE (HỖ TRỢ KÉO THẢ & CHỌN TỆP) */}
                <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden shadow-xs">
                  {/* Khu vực Cover Image */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleUploadImageFile(e.dataTransfer.files[0], 'cover');
                      }
                    }}
                    className="relative h-44 sm:h-52 w-full bg-[#FAF8F3] group cursor-pointer overflow-hidden border-b border-[#E8E4DC]"
                    onClick={() => coverInputRef.current?.click()}
                    title="Nhấp hoặc kéo thả ảnh để đổi hình nền"
                  >
                    {profileCover ? (
                      <SafeImage
                        src={profileCover}
                        alt="Hình nền hồ sơ"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#2A2925] to-[#171613]" />
                    )}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="px-3.5 py-1.5 bg-black/70 text-white text-xs font-semibold rounded-lg flex items-center gap-2 backdrop-blur-xs">
                        <Camera className="w-4 h-4 text-[#C7A66A]" />
                        <span>Đổi hình nền (Kéo thả hoặc chọn tệp)</span>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          coverInputRef.current?.click();
                        }}
                        className="px-3 py-1 bg-white/90 hover:bg-white text-[#171613] text-[11px] font-semibold rounded-lg shadow-sm border border-[#E8E4DC] flex items-center gap-1.5 backdrop-blur-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#8A7158]" />
                        <span>Tải hình nền từ máy</span>
                      </button>
                    </div>
                  </div>

                  {/* Khu vực Avatar & Header thông tin */}
                  <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
                    <div className="flex items-end gap-4">
                      {/* Avatar container */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleUploadImageFile(e.dataTransfer.files[0], 'avatar');
                          }
                        }}
                        onClick={() => avatarInputRef.current?.click()}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#FAF8F3] group cursor-pointer shrink-0"
                        title="Nhấp hoặc kéo thả ảnh để đổi đại diện"
                      >
                        {profileAvatar ? (
                          <SafeImage
                            src={profileAvatar}
                            alt={profileName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#171613] text-[#FAF8F3] flex items-center justify-center font-bold text-2xl">
                            {profileName.charAt(0) || 'T'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-5 h-5 text-white mb-0.5" />
                          <span>Đổi ảnh</span>
                        </div>
                      </div>

                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-[#171613]">{profileName || user.name}</h2>
                          {isAdmin ? (
                            <span className="text-[10px] bg-[#171613] text-[#C7A66A] px-2 py-0.5 rounded font-bold">
                              🛡️ QUẢN TRỊ VIÊN
                            </span>
                          ) : (
                            <span className="text-[10px] bg-[#8A7158] text-white px-2 py-0.5 rounded font-bold uppercase">
                              {user.membershipTier}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#747069] mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#FAF8F3] hover:bg-[#E8D7BD] text-[#171613] border border-[#E8E4DC] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-[#8A7158]" />
                        <span>Đổi Avatar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* THÔNG BÁO KẾT QUẢ LƯU */}
                {profileSuccessMsg && (
                  <div className="p-3.5 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] rounded-xl text-xs flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}
                {profileErrorMsg && (
                  <div className="p-3.5 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs flex items-center gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                {/* THÔNG TIN CƠ BẢN */}
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#8A7158]" />
                    <span>Thông tin định danh tài khoản</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[#171613] font-semibold block mb-1">
                        Tên hiển thị *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Nhập họ và tên hiển thị..."
                        className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                      />
                    </div>

                    <div>
                      <label className="text-[#171613] font-semibold block mb-1">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="0908 123 456"
                        className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                      />
                    </div>

                    <div>
                      <label className="text-[#747069] block mb-1">
                        Địa chỉ Email (Định danh đăng nhập)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="w-full bg-[#F4F1EA] border border-[#E8E4DC] rounded-xl p-3 text-[#747069] font-medium cursor-not-allowed pl-9"
                        />
                        <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3.5" />
                      </div>
                      <span className="text-[10px] text-[#A8A29E] mt-1 block">Email được bảo mật cố định theo tài khoản.</span>
                    </div>

                    <div>
                      <label className="text-[#747069] block mb-1">
                        Vai trò trong hệ thống
                      </label>
                      <input
                        type="text"
                        disabled
                        value={isAdmin ? 'Quản trị viên toàn quyền (Admin)' : `Khách hàng (${activeTierDetails.name})`}
                        className="w-full bg-[#F4F1EA] border border-[#E8E4DC] rounded-xl p-3 text-[#747069] font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* SỔ ĐỊA CHỈ NHẬN HÀNG MẶC ĐỊNH */}
                <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-[#171613] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8A7158]" />
                    <span>Địa chỉ nhận hàng mặc định</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[#171613] font-semibold block mb-1">Người nhận</label>
                      <input
                        type="text"
                        value={profileAddress.fullName}
                        onChange={(e) => setProfileAddress({ ...profileAddress, fullName: e.target.value })}
                        placeholder="Họ tên người nhận hàng"
                        className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] focus:outline-none focus:border-[#171613]"
                      />
                    </div>
                    <div>
                      <label className="text-[#171613] font-semibold block mb-1">Số điện thoại nhận</label>
                      <input
                        type="tel"
                        value={profileAddress.phone}
                        onChange={(e) => setProfileAddress({ ...profileAddress, phone: e.target.value })}
                        placeholder="Số điện thoại nhận hàng"
                        className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] focus:outline-none focus:border-[#171613]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[#171613] font-semibold block mb-1">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                      <input
                        type="text"
                        value={profileAddress.address}
                        onChange={(e) => setProfileAddress({ ...profileAddress, address: e.target.value })}
                        placeholder="Ví dụ: 720A Điện Biên Phủ, Căn hộ 18.04..."
                        className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] focus:outline-none focus:border-[#171613]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <AddressCascadeSelect
                        province={profileAddress.city}
                        district={profileAddress.district}
                        ward={profileAddress.ward}
                        onChange={({ province, district, ward }) =>
                          setProfileAddress({
                            ...profileAddress,
                            city: province,
                            district,
                            ward
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* RIÊNG VỚI QUẢN TRỊ VIÊN: CẤU HÌNH SỐ TÀI KHOẢN NGÂN HÀNG & THANH TOÁN */}
                {isAdmin && (
                  <div className="bg-white rounded-2xl border-2 border-[#C7A66A]/60 p-6 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8E4DC] gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#171613] text-[#C7A66A] px-2 py-0.5 rounded font-bold tracking-wider uppercase">
                            DÀNH RIÊNG QUẢN TRỊ VIÊN
                          </span>
                          <h3 className="text-sm font-bold text-[#171613]">
                            Cấu Hình Tài Khoản Ngân Hàng & Nhận Thanh Toán Shop
                          </h3>
                        </div>
                        <p className="text-xs text-[#747069] mt-1">
                          Thông tin số tài khoản này sẽ hiển thị trực tiếp trên trang thanh toán đơn hàng VietQR cho khách hàng quét mã chuyển tiền.
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#FFF9E6] text-[#B45309] flex items-center justify-center shrink-0">
                        <Landmark className="w-4 h-4 text-[#D97706]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="font-semibold text-[#171613] block mb-1">
                          Ngân hàng thụ hưởng *
                        </label>
                        <select
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-semibold focus:outline-none focus:border-[#171613]"
                        >
                          <option value="Techcombank">Techcombank (Ngân hàng Kỹ Thương)</option>
                          <option value="Vietcombank">Vietcombank (Ngoại Thương Việt Nam)</option>
                          <option value="MBBank">MB Bank (Quân Đội)</option>
                          <option value="VPBank">VPBank (Việt Nam Thịnh Vượng)</option>
                          <option value="ACB">ACB (Á Châu)</option>
                          <option value="BIDV">BIDV (Đầu Tư & Phát Triển)</option>
                          <option value="Agribank">Agribank (Nông Nghiệp)</option>
                          <option value="TPBank">TPBank (Tiên Phong)</option>
                          <option value="Sacombank">Sacombank (Sài Gòn Thương Tín)</option>
                          <option value="VIB">VIB (Quốc Tế Việt Nam)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-[#171613] block mb-1">
                          Số tài khoản ngân hàng *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value.replace(/\s+/g, ''))}
                          placeholder="Nhập số tài khoản ngân hàng..."
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-mono font-bold tracking-wider focus:outline-none focus:border-[#171613]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#171613] block mb-1">
                          Tên chủ tài khoản (In hoa không dấu) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankHolder}
                          onChange={(e) => setBankHolder(e.target.value.toUpperCase())}
                          placeholder="NGUYEN QUAN TRI HOAC TADA FASHION"
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-bold uppercase tracking-wider focus:outline-none focus:border-[#171613]"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-[#171613] block mb-1">
                          Chi nhánh ngân hàng
                        </label>
                        <input
                          type="text"
                          value={bankBranch}
                          onChange={(e) => setBankBranch(e.target.value)}
                          placeholder="Ví dụ: Hội sở TP.HCM, Chi nhánh Quận 1..."
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] focus:outline-none focus:border-[#171613]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="font-semibold text-[#171613] block mb-1">
                          Hotline / Zalo hỗ trợ thanh toán & xác nhận ủy nhiệm chi
                        </label>
                        <input
                          type="text"
                          value={bankHotline}
                          onChange={(e) => setBankHotline(e.target.value)}
                          placeholder="0909 999 999"
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-[#171613] font-semibold focus:outline-none focus:border-[#171613]"
                        />
                      </div>
                    </div>

                    {/* Preview mã VietQR theo thời gian thực */}
                    <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-[#E8E4DC] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.vietqr.io/image/${bankName}-${bankAccount}-compact2.png?accountName=${encodeURIComponent(bankHolder)}`}
                          alt="VietQR Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1 text-xs text-[#171613]">
                        <span className="font-bold text-[#8A7158] block">Mã VietQR Demo Trực Tiếp Của Bạn:</span>
                        <p className="text-[#747069]">
                          Khi khách hàng chọn phương thức <strong>Chuyển khoản ngân hàng VietQR</strong> ở trang thanh toán, hệ thống sẽ tự động hiển thị mã QR này cùng số tiền và nội dung đơn hàng.
                        </p>
                        <p className="text-[11px] font-mono text-[#171613]">
                          {bankName} • {bankAccount} • {bankHolder}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* NÚT LƯU THAY ĐỔI */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile || isUploadingMedia}
                    className="px-6 py-3 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Đang lưu hồ sơ...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SỔ ĐỊA CHỈ */}
            {activeMenu === 'addresses' && (
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#171613] pb-3 border-b border-[#F0ECE1]">
                  Sổ địa chỉ nhận hàng
                </h2>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {user.addresses.map((addr, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-[#E8E4DC] bg-[#FAF8F3] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#171613]">{addr.fullName}</strong>
                          <span className="text-[10px] bg-[#171613] text-white px-2 py-0.5 rounded">Mặc định</span>
                        </div>
                        <p className="text-[#747069]">SĐT: {addr.phone}</p>
                        <p className="text-[#747069]">{addr.address}, {addr.ward}, {addr.district}, {addr.city}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#747069]">Chưa có địa chỉ nào được lưu.</p>
                )}
              </div>
            )}

            {/* TAB: YÊU THÍCH */}
            {activeMenu === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#171613] pb-3 border-b border-[#F0ECE1]">
                  Sản phẩm yêu thích ({totalWishlist})
                </h2>
                {wishlist.length === 0 ? (
                  <p className="text-xs text-[#747069] py-8 text-center">
                    Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod.id} className="border border-[#E8E4DC] rounded-xl p-3 space-y-2">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#FAF8F3]">
                          <SafeImage src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                        </div>
                        <h4 className="text-xs font-semibold text-[#171613] truncate">{prod.name}</h4>
                        <p className="text-xs font-bold text-[#B83A3A]">{formatPrice(prod.price)}</p>
                        <Link
                          href={`/product/${prod.slug || prod.id}`}
                          className="block text-center py-1.5 bg-[#171613] text-white rounded-lg text-xs font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MÃ GIẢM GIÁ */}
            {activeMenu === 'coupons' && (
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-[#171613] pb-3 border-b border-[#F0ECE1]">
                  Mã ưu đãi dành riêng cho bạn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { code: 'TADAVIP', desc: 'Giảm 10% tổng hóa đơn thanh toán' },
                    { code: 'FREESHIP', desc: 'Miễn phí vận chuyển toàn quốc cho mọi đơn' },
                    { code: 'FALL2026', desc: 'Giảm 15% cho Bộ sưu tập Thu Đông mới' }
                  ].map((c) => (
                    <div key={c.code} className="p-4 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#171613] block">{c.code}</span>
                        <span className="text-[11px] text-[#747069]">{c.desc}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCoupon(c.code)}
                        className="px-3 py-1.5 bg-white border border-[#E8E4DC] text-xs font-bold rounded-lg hover:bg-[#171613] hover:text-white transition-colors"
                      >
                        {copiedCoupon === c.code ? '✓ Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CÀI ĐẶT */}
            {activeMenu === 'settings' && (
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs space-y-4 text-xs">
                <h2 className="text-sm font-bold text-[#171613] pb-3 border-b border-[#F0ECE1]">
                  Cài đặt tài khoản
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC]">
                    <div>
                      <span className="font-semibold text-[#171613] block">Nhận thông báo qua email</span>
                      <span className="text-[11px] text-[#747069]">Cập nhật về đơn hàng và khuyến mãi mới</span>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#171613] w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC]">
                    <div>
                      <span className="font-semibold text-[#171613] block">Bảo mật 2 lớp (2FA)</span>
                      <span className="text-[11px] text-[#747069]">Bảo vệ tài khoản an toàn</span>
                    </div>
                    <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-2 py-0.5 rounded">Đã kích hoạt</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
