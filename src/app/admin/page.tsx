'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Users,
  TrendingUp,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Lock,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Crown,
  Gift,
  Upload,
  History,
  FileSpreadsheet,
  Printer,
  Eye,
  AlertTriangle,
  ArrowUpDown,
  Bell,
  Check,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  ShieldAlert,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link2,
  Maximize2,
  Landmark,
  Truck,
  Home,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth, LOYALTY_TIERS } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { OrderStatus, Order, ProductOrigin, Product, ProductVariant, InventoryLog, ProductStatus, User, Category, ProductTag } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { ProductCard } from '@/components/product/ProductCard';
import { DashboardTab } from '@/components/admin/tabs/DashboardTab';
import { ProductsTab } from '@/components/admin/tabs/ProductsTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { InventoryLogsTab } from '@/components/admin/tabs/InventoryLogsTab';
import { LoyaltyTab } from '@/components/admin/tabs/LoyaltyTab';
import { CouponsTab } from '@/components/admin/tabs/CouponsTab';
import { CategoriesTab } from '@/components/admin/tabs/CategoriesTab';

export default function AdminPage() {
  const { orders, updateOrderStatus, user, isAdmin, loginWithAdmin, logout, refreshOrders } = useAuth();
  const { products, categories, addProduct, updateProduct, updatePrice, adjustStock, deleteProduct, refreshProducts, saveCategory, deleteCategory } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory_logs' | 'dashboard' | 'loyalty' | 'coupons' | 'categories'>('products');
  const [adminEmail, setAdminEmail] = useState('admin@tada.vn');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);

  // Tải danh sách khách hàng thật từ server
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          setUserList(data.users);
        }
      })
      .catch(() => {});
  }, []);

  // Thông báo đơn mới
  const [newOrderAlertCount, setNewOrderAlertCount] = useState(0);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  // Lọc & tìm kiếm sản phẩm
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState<string>('all');
  const [prodStockFilter, setProdStockFilter] = useState<'all' | 'out_of_stock' | 'low_stock' | 'in_stock' | 'hidden'>('all');
  const [prodSortBy, setProdSortBy] = useState<'name' | 'stock_asc' | 'stock_desc' | 'price_asc' | 'price_desc' | 'updated'>('updated');

  // Modal Quản Lý Danh Mục
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catParentId, setCatParentId] = useState<string | null>(null);
  const [catNameInput, setCatNameInput] = useState('');
  const [catSlugInput, setCatSlugInput] = useState('');
  const [catIconInput, setCatIconInput] = useState('🏷️');
  const [catImageInput, setCatImageInput] = useState('');
  const [catDescInput, setCatDescInput] = useState('');
  const [catOrderInput, setCatOrderInput] = useState(1);
  const [catIsActiveInput, setCatIsActiveInput] = useState(true);
  const [catError, setCatError] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Modal Điều Chỉnh Kho Hàng
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('all');
  const [adjustType, setAdjustType] = useState<'import' | 'export' | 'set'>('import');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('Nhập bổ sung lô hàng mới');
  const [stockAdjustError, setStockAdjustError] = useState<string>('');
  const [isSubmittingStock, setIsSubmittingStock] = useState<boolean>(false);

  // Modal Sửa / Thêm sản phẩm & Live Preview & Validation
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductPreviewOpen, setIsProductPreviewOpen] = useState(false);
  const [prodValidationErrors, setProdValidationErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [showOriginalPrice, setShowOriginalPrice] = useState(true);
  const [selectedColorChip, setSelectedColorChip] = useState('Trắng Ivory');
  const [selectedSizeChip, setSelectedSizeChip] = useState('S');
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVarColor, setNewVarColor] = useState('Trắng Ivory');
  const [newVarSize, setNewVarSize] = useState('M');
  const [newVarStock, setNewVarStock] = useState(5);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lịch sử kho
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Quản lý đơn hàng: Tìm kiếm, lọc, phân trang, in phiếu
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [orderDateRange, setOrderDateRange] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 8;
  const [viewingOrderDetail, setViewingOrderDetail] = useState<Order | null>(null);

  // Dashboard filter
  const [dashboardTimeRange, setDashboardTimeRange] = useState<'all' | 'today' | '7days' | '30days' | 'this_month'>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Tải nhật ký kho
  const fetchInventoryLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/inventory/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setInventoryLogs(data.logs);
        }
      }
    } catch (e) {
      console.error('Failed to fetch inventory logs', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (activeTab === 'inventory_logs') {
      void (async () => {
        setIsLoadingLogs(true);
        try {
          const res = await fetch('/api/admin/inventory/logs');
          if (res.ok && active) {
            const data = await res.json();
            if (data.success && Array.isArray(data.logs)) {
              setInventoryLogs(data.logs);
            }
          }
        } catch (e) {
          console.error('Failed to fetch inventory logs', e);
        } finally {
          if (active) setIsLoadingLogs(false);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [activeTab]);

  // Bộ đếm đơn hàng chờ xác nhận mới
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'pending_confirmation').length;
  }, [orders]);

  useEffect(() => {
    if (pendingOrdersCount > 0) {
      queueMicrotask(() => {
        setNewOrderAlertCount(pendingOrdersCount);
        setHasNewAlert(true);
      });
    }
  }, [pendingOrdersCount]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPinError('');
    try {
      const res = await loginWithAdmin(adminEmail, adminPassword, adminPin);
      if (!res.success) {
        setPinError(res.message);
      }
    } catch (err: any) {
      setPinError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (prodSearch.trim()) {
      const q = prodSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (prodStockFilter === 'out_of_stock') {
      list = list.filter((p) => p.stockCount <= 0);
    } else if (prodStockFilter === 'low_stock') {
      list = list.filter((p) => p.stockCount > 0 && p.stockCount <= 5);
    } else if (prodStockFilter === 'in_stock') {
      list = list.filter((p) => p.stockCount > 5);
    } else if (prodStockFilter === 'hidden') {
      list = list.filter((p) => p.status === 'hidden');
    }

    list.sort((a, b) => {
      if (prodSortBy === 'name') return a.name.localeCompare(b.name);
      if (prodSortBy === 'stock_asc') return a.stockCount - b.stockCount;
      if (prodSortBy === 'stock_desc') return b.stockCount - a.stockCount;
      if (prodSortBy === 'price_asc') return a.price - b.price;
      if (prodSortBy === 'price_desc') return b.price - a.price;
      if (prodSortBy === 'updated') {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return db - da;
      }
      return 0;
    });

    return list;
  }, [products, prodSearch, prodStockFilter, prodSortBy]);

  // Xử lý điều chỉnh kho an toàn
  const handleOpenStockModal = (product: Product) => {
    setStockModalProduct(product);
    setSelectedVariantId('all');
    setAdjustType('import');
    setAdjustQuantity(5);
    setAdjustReason('Nhập bổ sung lô hàng mới');
    setStockAdjustError('');
  };

  const handleConfirmStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalProduct) return;

    if (adjustQuantity <= 0) {
      setStockAdjustError('Vui lòng nhập số lượng lớn hơn 0.');
      return;
    }

    setIsSubmittingStock(true);
    setStockAdjustError('');

    let change = adjustQuantity;
    let type: 'import' | 'manual_adjust' = 'manual_adjust';

    if (adjustType === 'import') {
      change = adjustQuantity;
      type = 'import';
    } else if (adjustType === 'export') {
      change = -adjustQuantity;
      type = 'manual_adjust';
    } else if (adjustType === 'set') {
      // Đặt số tồn kho mới
      const currentQty =
        selectedVariantId !== 'all' && stockModalProduct.variants
          ? stockModalProduct.variants.find((v) => v.id === selectedVariantId)?.stockCount || 0
          : stockModalProduct.stockCount;
      change = adjustQuantity - currentQty;
      type = 'manual_adjust';
    }

    const variantIdToPass = selectedVariantId === 'all' ? null : selectedVariantId;

    const res = await adjustStock(
      stockModalProduct.id,
      variantIdToPass,
      change,
      type,
      adjustReason,
      'Admin'
    );

    setIsSubmittingStock(false);

    if (res.success) {
      setStockModalProduct(null);
      await refreshProducts();
      if (activeTab === 'inventory_logs') {
        fetchInventoryLogs();
      }
    } else {
      setStockAdjustError(res.message);
    }
  };

  // Upload ảnh thực tế từ chọn file hoặc kéo thả
  const handleProcessUploadFiles = async (fileList: FileList | File[]) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success && data.urls) {
        if (editingProduct) {
          const currentImages = editingProduct.images || [];
          const updated = [...currentImages, ...data.urls];
          setEditingProduct({
            ...editingProduct,
            images: updated
          });
          // Tự động chọn xem ảnh vừa tải
          setActiveImageIndex(updated.length - 1);
        }
      } else {
        alert(data.message || 'Lỗi khi tải ảnh lên.');
      }
    } catch {
      alert('Không thể kết nối đến máy chủ để tải ảnh.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleProcessUploadFiles(e.target.files);
    }
  };

  // Cập nhật số lượng tồn kho biến thể trực tiếp từ stepper
  const handleStepVariantStock = (variantId: string, delta: number) => {
    if (!editingProduct) return;
    const variants = editingProduct.variants || [];
    const updated = variants.map((v) => {
      if (v.id === variantId) {
        const nextStock = Math.max(0, (v.stockCount || 0) + delta);
        return {
          ...v,
          stockCount: nextStock,
          inStock: nextStock > 0
        };
      }
      return v;
    });
    const total = updated.reduce((sum, v) => sum + v.stockCount, 0);
    setEditingProduct({
      ...editingProduct,
      variants: updated,
      stockCount: total,
      inStock: total > 0
    });
  };

  // Thêm biến thể mới vào bảng
  const handleAddNewVariantRow = (colorName: string, sizeName: string, stock: number) => {
    if (!editingProduct) return;
    const curVariants = editingProduct.variants || [];
    const exists = curVariants.some(
      (v) => v.color.toLowerCase() === colorName.toLowerCase() && v.size.toUpperCase() === sizeName.toUpperCase()
    );
    if (exists) {
      alert(`Biến thể màu "${colorName}" - Size "${sizeName}" đã có trong danh sách.`);
      return;
    }

    const colorHexMap: Record<string, string> = {
      'Trắng Ivory': '#F5F2EB',
      'Trắng': '#FFFFFF',
      'Đen': '#171613',
      'Be': '#D9C3B0',
      'Xanh Navy': '#1B2A4A',
      'Nâu Đất': '#5C3D2E',
      'Đỏ Rượu': '#722F37'
    };

    const newV: ProductVariant = {
      id: `var-${editingProduct.id}-${Date.now()}`,
      sku: `${editingProduct.sku || 'TADA'}-${colorName.slice(0, 2).toUpperCase()}-${sizeName}`,
      color: colorName,
      colorHex: colorHexMap[colorName] || '#8A7158',
      size: sizeName,
      stockCount: stock,
      inStock: stock > 0,
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice
    };

    const updated = [...curVariants, newV];
    const total = updated.reduce((sum, v) => sum + v.stockCount, 0);
    setEditingProduct({
      ...editingProduct,
      variants: updated,
      stockCount: total,
      inStock: total > 0
    });
    setIsAddingVariant(false);
  };

  // Xóa một biến thể khỏi danh sách
  const handleRemoveVariant = (variantId: string) => {
    if (!editingProduct) return;
    const updated = (editingProduct.variants || []).filter((v) => v.id !== variantId);
    const total = updated.reduce((sum, v) => sum + v.stockCount, 0);
    setEditingProduct({
      ...editingProduct,
      variants: updated,
      stockCount: total,
      inStock: total > 0
    });
  };

  // Tự động sinh tổ hợp biến thể (Màu sắc x Kích cỡ)
  const handleAutoGenerateVariants = (selectedColors: { name: string; hex: string }[], selectedSizes: string[]) => {
    if (!editingProduct) return;
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      alert('Vui lòng chọn ít nhất một màu sắc và một kích cỡ để sinh biến thể.');
      return;
    }

    const currentVariants = editingProduct.variants || [];
    const generated: ProductVariant[] = [];

    selectedColors.forEach((c) => {
      selectedSizes.forEach((s) => {
        const existing = currentVariants.find(
          (v) => v.color.toLowerCase() === c.name.toLowerCase() && v.size.toUpperCase() === s.toUpperCase()
        );
        if (existing) {
          generated.push(existing);
        } else {
          generated.push({
            id: `var-${editingProduct.id}-${c.name.slice(0, 3)}-${s}-${Date.now()}`,
            sku: `${editingProduct.sku || 'TADA'}-${c.name.slice(0, 2).toUpperCase()}-${s}`,
            color: c.name,
            colorHex: c.hex,
            size: s,
            stockCount: 10,
            inStock: true,
            price: editingProduct.price,
            originalPrice: editingProduct.originalPrice
          });
        }
      });
    });

    const total = generated.reduce((sum, v) => sum + v.stockCount, 0);
    setEditingProduct({
      ...editingProduct,
      variants: generated,
      stockCount: total,
      inStock: total > 0
    });
  };

  // Xóa ảnh hoặc đặt làm ảnh đại diện
  const handleSetMainImage = (index: number) => {
    if (!editingProduct) return;
    const imgs = [...editingProduct.images];
    const [selected] = imgs.splice(index, 1);
    imgs.unshift(selected);
    setEditingProduct({ ...editingProduct, images: imgs });
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const imgs = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({
      ...editingProduct,
      images: imgs.length > 0 ? imgs : ['/images/products/dress-1.jpg']
    });
  };

  // Mở modal thêm sản phẩm mới
  const handleOpenAddProduct = () => {
    const defaultParent = categories[0]?.slug || 'nu';
    const defaultSub = categories[0]?.subcategories?.[0]?.slug || 'ao-so-mi-nu';

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: '',
      slug: '',
      sku: `TADA-${defaultParent.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      barcode: '',
      brand: 'TADA! Signature',
      origin: 'vietnam_local_brand',
      originCountry: 'Việt Nam',
      badges: ['LOCAL BRAND'],
      category: defaultParent,
      categoryId: defaultParent,
      subCategoryId: defaultSub,
      additionalCategoryIds: [],
      tags: ['new'],
      price: 790000,
      originalPrice: 950000,
      discountPercentage: 17,
      costPrice: 420000,
      rating: 5,
      reviewCount: 0,
      viewsCount: 0,
      salesCount: 0,
      inStock: true,
      stockCount: 15,
      status: 'active',
      estimatedDelivery: 'Hỏa tốc 2-4h (Nội thành)',
      images: ['/images/products/dress-1.jpg'],
      coverImageIndex: 0,
      colors: [{ name: 'Đen Tiêu Chuẩn', hex: '#171613' }],
      sizes: ['S', 'M', 'L'],
      shortDescription: 'Thiết kế độc quyền từ TADA! Studio với đường may sắc nét và chất liệu cao cấp.',
      description: 'Thiết kế độc quyền từ TADA! Studio với đường may sắc nét và chất liệu cao cấp.',
      material: 'Cotton Silk thoáng mát, giữ phom hoàn hảo',
      careInstructions: ['Giặt tay hoặc giặt máy chế độ nhẹ', 'Không sấy nhiệt độ cao'],
      style: 'Regular fit',
      pattern: 'Trơn',
      gender: 'nu',
      season: 'bon-mua',
      fashionStyle: 'Thanh lịch đương đại',
      seoTitle: '',
      seoDescription: ''
    };
    setEditingProduct(newProd);
    setProdValidationErrors({});
    setIsProductModalOpen(true);
  };

  // Lưu sản phẩm từ Modal Sửa/Thêm kèm Kiểm tra dữ liệu (Validation)
  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const errors: Record<string, string> = {};

    // 1. Kiểm tra Tên sản phẩm
    if (!editingProduct.name || !editingProduct.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm.';
    } else if (editingProduct.name.trim().length < 3) {
      errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự.';
    }

    // 2. Kiểm tra Giá bán
    if (editingProduct.price === undefined || editingProduct.price < 0) {
      errors.price = 'Giá bán không được nhỏ hơn 0.';
    }

    // 3. Kiểm tra Danh mục
    if (!editingProduct.categoryId && !editingProduct.category) {
      errors.categoryId = 'Vui lòng chọn danh mục chính cho sản phẩm.';
    }

    // 4. Kiểm tra trùng mã SKU
    if (editingProduct.sku && editingProduct.sku.trim()) {
      const isDuplicateSku = products.some(
        (p) => p.sku && p.sku.toLowerCase() === editingProduct.sku!.trim().toLowerCase() && p.id !== editingProduct.id
      );
      if (isDuplicateSku) {
        errors.sku = `Mã SKU "${editingProduct.sku}" đã tồn tại trên một sản phẩm khác. Vui lòng nhập SKU riêng biệt.`;
      }
    }

    // 5. Kiểm tra tồn kho của từng biến thể
    if (editingProduct.variants && editingProduct.variants.length > 0) {
      const hasNegativeStock = editingProduct.variants.some((v) => v.stockCount < 0);
      if (hasNegativeStock) {
        errors.variants = 'Tồn kho của các biến thể không được âm.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setProdValidationErrors(errors);
      return;
    }

    setProdValidationErrors({});

    // Tự sinh slug nếu chưa có
    const finalSlug =
      editingProduct.slug && editingProduct.slug.trim()
        ? editingProduct.slug.trim()
        : editingProduct.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const finalProductToSave: Product = {
      ...editingProduct,
      slug: finalSlug,
      category: editingProduct.categoryId || editingProduct.category || 'nu',
      categoryId: editingProduct.categoryId || 'nu',
      seoTitle: editingProduct.seoTitle || editingProduct.name,
      seoDescription: editingProduct.seoDescription || editingProduct.shortDescription || editingProduct.name
    };

    if (editingProduct.id && products.some((p) => p.id === editingProduct.id)) {
      await updateProduct(editingProduct.id, finalProductToSave);
    } else {
      await addProduct(finalProductToSave);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    await refreshProducts();
  };

  // Quản lý Danh mục (Thêm / Sửa / Xóa)
  const handleOpenAddCategory = (parentId: string | null = null) => {
    setEditingCat(null);
    setCatParentId(parentId);
    setCatNameInput('');
    setCatSlugInput('');
    setCatIconInput(parentId ? '👕' : '👗');
    setCatImageInput('');
    setCatDescInput('');
    setCatOrderInput(1);
    setCatIsActiveInput(true);
    setCatError('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category, parentId: string | null = null) => {
    setEditingCat(cat);
    setCatParentId(parentId || cat.parentId || null);
    setCatNameInput(cat.name);
    setCatSlugInput(cat.slug);
    setCatIconInput(cat.icon || '🏷️');
    setCatImageInput(cat.image || '');
    setCatDescInput(cat.description || '');
    setCatOrderInput(cat.order || 1);
    setCatIsActiveInput(cat.isActive !== false);
    setCatError('');
    setIsCatModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) {
      setCatError('Vui lòng nhập tên danh mục.');
      return;
    }

    setIsSubmittingCat(true);
    setCatError('');

    const slug =
      catSlugInput.trim() ||
      catNameInput
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const res = await saveCategory({
      id: editingCat?.id,
      parentId: catParentId,
      name: catNameInput.trim(),
      slug,
      icon: catIconInput,
      image: catImageInput.trim() || undefined,
      description: catDescInput.trim() || undefined,
      order: Number(catOrderInput) || 1,
      isActive: catIsActiveInput
    });

    setIsSubmittingCat(false);
    if (res.success) {
      setIsCatModalOpen(false);
      setEditingCat(null);
    } else {
      setCatError(res.message);
    }
  };

  const handleDeleteCategoryConfirm = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này sẽ không bị xóa.`)) {
      await deleteCategory(id);
    }
  };

  // Lọc và tìm kiếm đơn hàng
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.shippingAddress.fullName.toLowerCase().includes(q) ||
          o.shippingAddress.phone.toLowerCase().includes(q)
      );
    }

    if (orderStatusFilter !== 'all') {
      list = list.filter((o) => o.status === orderStatusFilter);
    }

    if (orderPaymentFilter !== 'all') {
      list = list.filter((o) => o.paymentMethod === orderPaymentFilter);
    }

    if (orderDateRange !== 'all') {
      const now = new Date().getTime();
      list = list.filter((o) => {
        const orderTime = new Date(o.createdAt).getTime();
        const diffDays = (now - orderTime) / (1000 * 3600 * 24);
        if (orderDateRange === 'today') return diffDays <= 1;
        if (orderDateRange === '7days') return diffDays <= 7;
        if (orderDateRange === '30days') return diffDays <= 30;
        return true;
      });
    }

    // Sắp xếp đơn mới nhất lên đầu
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [orders, orderSearch, orderStatusFilter, orderPaymentFilter, orderDateRange]);

  // Phân trang đơn hàng
  const totalOrderPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  // Xuất file CSV chuẩn UTF-8 có BOM để mở bằng Excel tiếng Việt hoàn hảo
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('Không có dữ liệu đơn hàng để xuất.');
      return;
    }

    const headers = [
      'Mã Đơn Hàng',
      'Thời Gian Đặt',
      'Họ Tên Khách Hàng',
      'Số Điện Thoại',
      'Địa Chỉ Giao Hàng',
      'Danh Sách Sản Phẩm',
      'Tổng Số Lượng',
      'Tạm Tính (VNĐ)',
      'Phí Vận Chuyển (VNĐ)',
      'Giảm Giá (VNĐ)',
      'Tổng Tiền (VNĐ)',
      'Phương Thức Thanh Toán',
      'Trạng Thái Thanh Toán',
      'Trạng Thái Đơn Hàng'
    ];

    const rows = filteredOrders.map((o) => {
      const itemsDesc = o.items
        .map((i) => `${i.productName} [${i.color || ''} - Size ${i.size || ''}] x${i.quantity}`)
        .join('; ');
      const totalQty = o.items.reduce((sum, i) => sum + i.quantity, 0);

      return [
        `"${o.orderCode}"`,
        `"${formatDate(o.createdAt)}"`,
        `"${o.shippingAddress.fullName}"`,
        `"${o.shippingAddress.phone}"`,
        `"${o.shippingAddress.address}, ${o.shippingAddress.ward}, ${o.shippingAddress.district}, ${o.shippingAddress.city}"`,
        `"${itemsDesc}"`,
        totalQty,
        o.subtotal,
        o.shippingFee,
        o.discountAmount,
        o.total,
        `"${o.paymentMethod}"`,
        `"${o.paymentStatus === 'paid' ? 'Đã thanh toán' : o.paymentStatus === 'partially_paid' ? 'Đã cọc' : 'Chưa thanh toán'}"`,
        `"${o.statusLabel}"`
      ].join(',');
    });

    // Thêm UTF-8 BOM (\uFEFF) để Excel mở không bị vỡ font tiếng Việt
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TADA_Don_Hang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Thống kê Dashboard thực tế
  const dashboardStats = useMemo(() => {
    let targetOrders = [...orders];
    const now = new Date();

    if (dashboardTimeRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      targetOrders = targetOrders.filter((o) => new Date(o.createdAt).getTime() >= startOfDay);
    } else if (dashboardTimeRange === '7days') {
      const start = now.getTime() - 7 * 86400000;
      targetOrders = targetOrders.filter((o) => new Date(o.createdAt).getTime() >= start);
    } else if (dashboardTimeRange === '30days') {
      const start = now.getTime() - 30 * 86400000;
      targetOrders = targetOrders.filter((o) => new Date(o.createdAt).getTime() >= start);
    } else if (dashboardTimeRange === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      targetOrders = targetOrders.filter((o) => new Date(o.createdAt).getTime() >= startOfMonth);
    }

    const totalOrdersCount = targetOrders.length;
    const pendingCount = targetOrders.filter((o) => o.status === 'pending_confirmation').length;
    const shippingCount = targetOrders.filter((o) => o.status === 'shipping').length;
    const deliveredCount = targetOrders.filter((o) => o.status === 'delivered').length;
    const cancelledCount = targetOrders.filter((o) => o.status === 'cancelled').length;

    // Doanh thu thực nhận: Chỉ tính các đơn đã thanh toán hoặc đã giao thành công (không tính đơn hủy hay đang chờ)
    const validRevenueOrders = targetOrders.filter(
      (o) => o.status !== 'cancelled' && (o.paymentStatus === 'paid' || o.status === 'delivered')
    );
    const actualRevenue = validRevenueOrders.reduce((sum, o) => sum + o.total, 0);

    // Giá trị đơn hàng trung bình (AOV)
    const aov = validRevenueOrders.length > 0 ? Math.round(actualRevenue / validRevenueOrders.length) : 0;

    // Tổng sản phẩm đã bán từ các đơn không bị hủy
    const nonCancelledOrders = targetOrders.filter((o) => o.status !== 'cancelled');
    const totalItemsSold = nonCancelledOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
      0
    );

    // Top sản phẩm bán chạy
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number; image: string }> = {};
    nonCancelledOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            image: item.image
          };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Sản phẩm sắp hết hàng
    const lowStockProducts = products.filter((p) => p.stockCount <= 5);

    return {
      totalOrdersCount,
      pendingCount,
      shippingCount,
      deliveredCount,
      cancelledCount,
      actualRevenue,
      aov,
      totalItemsSold,
      topSellingProducts,
      lowStockProducts
    };
  }, [orders, products, dashboardTimeRange]);

  // TRƯỜNG HỢP: KHÁCH HÀNG THƯỜNG THỬ TRUY CẬP TRỰC TIẾP URL /admin -> TỪ CHỐI
  if (user && user.role !== 'admin') {
    return (
      <div className="bg-[#FAF8F3] min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-[0.25em]">
            TRUY CẬP BỊ TỪ CHỐI (403 FORBIDDEN)
          </span>

          <h1 className="font-editorial text-2xl font-bold text-[#171613]">
            Không Có Quyền Quản Trị
          </h1>

          <p className="text-xs text-[#747069]">
            Tài khoản <strong>{user.name}</strong> là tài khoản khách hàng thông thường và không có quyền truy cập khu vực Quản Trị Hệ Thống TADA!.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/account"
              className="px-5 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Về Trang Cá Nhân
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-[#FAF8F3] hover:bg-[#FEE2E2] border border-[#E8E4DC] text-[#DC2626] text-xs font-bold rounded-xl transition-colors"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP -> YÊU CẦU ĐĂNG NHẬP ADMIN VỚI MẬT KHẨU & 2FA
  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-[#FAF8F3] min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#171613] text-[#C7A66A] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-bold text-[#8A7158] uppercase tracking-[0.25em]">
            BẢO MẬT HỆ THỐNG
          </span>

          <h1 className="font-editorial text-2xl font-medium text-[#171613]">
            Đăng Nhập Quản Trị Viên TADA!
          </h1>

          <p className="text-xs text-[#747069]">
            Khu vực bảo vệ nghiêm ngặt. Vui lòng đăng nhập bằng tài khoản Quản trị viên và mã xác thực 2 lớp:
          </p>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-3.5 text-left text-xs">
            <div>
              <label className="text-[#747069] block mb-1 font-medium">Email quản trị viên</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
              />
            </div>

            <div>
              <label className="text-[#747069] block mb-1 font-medium">Mật khẩu</label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu quản trị..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
              />
            </div>

            <div>
              <label className="text-[#8A5A36] block mb-1 font-bold">Mã xác thực 2 lớp (2FA PIN)</label>
              <input
                type="password"
                placeholder="Mã PIN 2FA (Mặc định: 1234 hoặc 888999)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-center text-sm font-mono tracking-widest text-[#171613] focus:outline-none focus:border-[#C7A66A]"
              />
            </div>

            {pinError && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-medium">
                {pinError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#171613] hover:bg-[#8A7158] text-[#FAF8F3] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              {isLoggingIn ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
            </button>
          </form>

          <div className="pt-2">
            <Link href="/" className="text-xs text-[#747069] hover:text-[#171613] underline">
              ← Quay về Trang chủ TADA!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      {/* 1. TOP HEADER (CHUẨN 100% THEO ẢNH ADMIN TADA!) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3] border-b border-[#E8E4DC] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo TADA! */}
          <div className="shrink-0">
            <Link href="/" className="block group">
              <span className="font-editorial text-2xl font-bold tracking-[0.06em] text-[#171613] flex items-center">
                TADA<span className="text-[#C78238]">!</span>
              </span>
              <span className="text-[9px] tracking-[0.14em] text-[#8A7158] uppercase font-medium block -mt-1 pl-0.5">
                STYLE FOR YOUR STORY
              </span>
            </Link>
          </div>

          {/* Search bar trung tâm */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
                value={prodSearch || adminGlobalSearch}
                onChange={(e) => {
                  setProdSearch(e.target.value);
                  setAdminGlobalSearch(e.target.value);
                }}
                className="w-full bg-[#FAF8F3] text-[#171613] placeholder-[#8A857D] text-xs py-2.5 pl-5 pr-14 rounded-full border border-[#D5CEC2] focus:border-[#171613] focus:outline-none transition-colors shadow-inner"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#171613] hover:bg-[#333] text-white flex items-center justify-center transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tiện ích phải: Thông báo chuông + Profile admin */}
          <div className="flex items-center gap-3">
            {/* Chuông thông báo */}
            <button
              onClick={() => {
                setIsProductModalOpen(false);
                setActiveTab('orders');
                setOrderStatusFilter('pending_confirmation');
              }}
              className="relative p-2 text-[#171613] hover:text-[#8A7158] transition-colors"
              title="Thông báo đơn hàng"
            >
              <Bell className="w-5 h-5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            {/* Profile widget */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E8E4DC]">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E8E4DC] bg-[#FAF8F3] shrink-0">
                {user?.avatar ? (
                  <SafeImage src={user.avatar} alt={user?.name || ''} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#171613] text-white flex items-center justify-center font-bold text-xs">
                    {(user?.name || 'A').charAt(0)}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-bold text-[#171613] block">{user?.name || 'Nguyễn Quản Trị'}</span>
                <span className="text-[10px] text-[#747069] block">Admin</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#747069] hidden sm:block" />
            </div>

            {/* Nút thoát / chuyển nhanh */}
            <div className="hidden lg:flex items-center gap-2 ml-2">
              <Link
                href="/shop"
                className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#E8D7BD] text-[#171613] text-[11px] font-semibold rounded-lg border border-[#E8E4DC] transition-colors"
              >
                Cửa hàng
              </Link>
              <button
                onClick={logout}
                className="px-2.5 py-1 bg-[#B83A3A] text-white text-[11px] font-semibold rounded-lg hover:bg-[#991B1B] transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG CHÍNH (SIDEBAR TRÁI + WORKSPACE PHẢI) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SIDEBAR TRÁI ADMIN CHUẨN THEO ẢNH */}
          <aside className="lg:col-span-3 xl:col-span-2 space-y-4">
            <div className="bg-[#FAF8F3] rounded-2xl p-2 space-y-4">
              {/* Nhóm: Trang chủ */}
              <div>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('dashboard');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'dashboard'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </button>
              </div>

              {/* Nhóm: QUẢN LÝ SẢN PHẨM */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A8A29E] px-3">
                  QUẢN LÝ SẢN PHẨM
                </span>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('products');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'products'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Tất cả sản phẩm</span>
                </button>

                <button
                  onClick={handleOpenAddProduct}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    isProductModalOpen && !products.some((p) => p.id === editingProduct?.id)
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm sản phẩm</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('categories');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'categories'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4" />
                    <span>Cây danh mục</span>
                  </div>
                  <span className="text-[10px] bg-[#FAF8F3] px-1.5 py-0.5 rounded-full border border-[#E8E4DC] font-semibold text-[#747069]">
                    {categories.length}
                  </span>
                </button>
              </div>

              {/* Nhóm: QUẢN LÝ ĐƠN HÀNG */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A8A29E] px-3">
                  QUẢN LÝ ĐƠN HÀNG
                </span>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('orders');
                    setOrderStatusFilter('all');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'orders' && orderStatusFilter === 'all'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tất cả đơn hàng</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('orders');
                    setOrderStatusFilter('pending_confirmation');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'orders' && orderStatusFilter === 'pending_confirmation'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#D97706]" />
                    <span>Đơn mới</span>
                  </div>
                  {pendingOrdersCount > 0 && (
                    <span className="bg-[#D97706] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('orders');
                    setOrderStatusFilter('shipping');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613] transition-colors text-left"
                >
                  <Truck className="w-4 h-4" />
                  <span>Đang giao</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('orders');
                    setOrderStatusFilter('delivered');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613] transition-colors text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  <span>Đã giao</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('orders');
                    setOrderStatusFilter('cancelled');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613] transition-colors text-left"
                >
                  <X className="w-4 h-4 text-[#DC2626]" />
                  <span>Đã hủy</span>
                </button>
              </div>

              {/* Nhóm: KHO HÀNG */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A8A29E] px-3">
                  KHO HÀNG
                </span>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('products');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'products'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Quản lý kho</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('inventory_logs');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'inventory_logs'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Nhật ký kho</span>
                </button>
              </div>

              {/* Nhóm: THỐNG KÊ */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A8A29E] px-3">
                  THỐNG KÊ
                </span>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('dashboard');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'dashboard'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tổng quan</span>
                </button>

                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setActiveTab('loyalty');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    !isProductModalOpen && activeTab === 'loyalty'
                      ? 'bg-[#E8D7BD] text-[#171613] font-bold'
                      : 'text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Khách hàng & VIP</span>
                </button>
              </div>

              {/* Nhóm: CÀI ĐẶT */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#A8A29E] px-3">
                  CÀI ĐẶT
                </span>
                <Link
                  href="/account"
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#747069] hover:bg-[#F4F1EA] hover:text-[#171613] transition-colors text-left"
                >
                  <Landmark className="w-4 h-4 text-[#C7A66A]" />
                  <span>Tài khoản ngân hàng Shop</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 xl:col-span-10 space-y-6">
            {isProductModalOpen && editingProduct ? (
              /* =========================================================================
                 GIAO DIỆN CHỈNH SỬA / THÊM SẢN PHẨM (CHUẨN 100% THEO ẢNH NGƯỜI DÙNG CUNG CẤP)
                 ========================================================================= */
              <form onSubmit={handleSaveProductModal} className="space-y-6">
                {/* Ẩn file input phục vụ chọn nhiều ảnh từ máy tính */}
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleUploadFiles}
                  className="hidden"
                />

                {/* HEADER WORKSPACE: Quay lại danh sách + Tiêu đề + Trạng thái */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setEditingProduct(null);
                      }}
                      className="text-xs text-[#747069] hover:text-[#171613] flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại danh sách</span>
                    </button>
                    <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171613]">
                      {products.some((p) => p.id === editingProduct.id)
                        ? 'Chỉnh sửa sản phẩm'
                        : 'Thêm sản phẩm mới'}
                    </h1>
                  </div>

                  {/* Nút Xem Trước & Status pill top-right */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsProductPreviewOpen(true)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] text-[#171613] flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Xem trước thẻ sản phẩm hiển thị trên website"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8A7158]" />
                      <span>Xem trước hiển thị</span>
                    </button>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        editingProduct.status === 'active' || !editingProduct.status
                          ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                          : editingProduct.status === 'hidden'
                          ? 'bg-[#FFF9E6] text-[#B45309] border border-[#FDE68A]'
                          : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          editingProduct.status === 'active' || !editingProduct.status
                            ? 'bg-[#2E7D32]'
                            : editingProduct.status === 'hidden'
                            ? 'bg-[#B45309]'
                            : 'bg-[#DC2626]'
                        }`}
                      />
                      <span>
                        {editingProduct.status === 'active' || !editingProduct.status
                          ? 'Đang kinh doanh'
                          : editingProduct.status === 'hidden'
                          ? 'Tạm ẩn'
                          : 'Ngừng kinh doanh'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 2 CỘT CHÍNH: CỘT TRÁI (ẢNH + THÔNG TIN CƠ BẢN + BỔ SUNG) & CỘT PHẢI (GIÁ + BIẾN THỂ) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* CỘT TRÁI (7 CỘT HOẶC 8 CỘT) */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                    {/* 1. KHUNG HÌNH ẢNH SẢN PHẨM (KÉO THẢ & CHỌN TỆP) */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingFiles(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingFiles(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDraggingFiles(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleProcessUploadFiles(e.dataTransfer.files);
                        }
                      }}
                      className={`bg-white rounded-2xl border transition-all p-5 shadow-xs relative ${
                        isDraggingFiles ? 'border-[#171613] bg-[#FAF8F3] ring-2 ring-[#C7A66A]' : 'border-[#E8E4DC]'
                      }`}
                    >
                      {/* Ảnh preview lớn */}
                      <div className="relative aspect-[3/4] sm:aspect-[4/5] max-h-[460px] w-full mx-auto rounded-xl overflow-hidden bg-[#FAF8F3] border border-[#E8E4DC]">
                        {editingProduct.images && editingProduct.images.length > 0 ? (
                          <SafeImage
                            src={editingProduct.images[activeImageIndex] || editingProduct.images[0]}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#A8A29E] gap-2">
                            <ImageIcon className="w-10 h-10" />
                            <span className="text-xs">Chưa có ảnh sản phẩm</span>
                          </div>
                        )}

                        {/* Badge Ảnh đại diện */}
                        <div className="absolute top-3 left-3 z-10">
                          {activeImageIndex === 0 ? (
                            <span className="px-3 py-1 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1.5">
                              <span>Ảnh đại diện</span>
                              <Edit3 className="w-3 h-3 text-[#C7A66A]" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleSetMainImage(activeImageIndex);
                                setActiveImageIndex(0);
                              }}
                              className="px-3 py-1 bg-white/90 hover:bg-white text-[#171613] text-[11px] font-semibold rounded-lg shadow-sm border border-[#E8E4DC] flex items-center gap-1.5 transition-colors"
                            >
                              <span>Đặt làm ảnh đại diện</span>
                            </button>
                          )}
                        </div>

                        {/* Nút Phóng to / Chi tiết ảnh */}
                        <div className="absolute top-3 right-3 z-10">
                          <button
                            type="button"
                            onClick={() => window.open(editingProduct.images[activeImageIndex] || editingProduct.images[0], '_blank')}
                            className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs transition-colors"
                            title="Xem ảnh gốc phóng to"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Overlay khi đang kéo thả file vào */}
                        {isDraggingFiles && (
                          <div className="absolute inset-0 bg-[#171613]/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 gap-2">
                            <Upload className="w-10 h-10 text-[#C7A66A] animate-bounce" />
                            <span className="text-sm font-bold">Thả ảnh vào đây để tải lên ngay</span>
                            <span className="text-[11px] text-[#E8D7BD]">Hỗ trợ JPG, PNG, WEBP</span>
                          </div>
                        )}

                        {/* Overlay khi đang tải ảnh lên */}
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-20 gap-2">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-semibold">Đang tải ảnh lên máy chủ...</span>
                          </div>
                        )}
                      </div>

                      {/* Dải Thumbnails bên dưới + Nút + Thêm ảnh (100% như ảnh) */}
                      <div className="flex items-center gap-3 pt-4 overflow-x-auto">
                        {editingProduct.images.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer group bg-[#FAF8F3] ${
                              activeImageIndex === idx ? 'border-[#171613] ring-2 ring-[#C7A66A]/40' : 'border-[#E8E4DC] hover:border-[#8A7158]'
                            }`}
                          >
                            <SafeImage src={img} alt="" fill className="object-cover" sizes="64px" />
                            {idx === 0 && (
                              <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-bold py-0.5 text-center">
                                Chính
                              </div>
                            )}
                            {/* Hover xóa ảnh */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                                if (activeImageIndex >= editingProduct.images.length - 1) {
                                  setActiveImageIndex(Math.max(0, editingProduct.images.length - 2));
                                }
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-[#DC2626] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Xóa ảnh này"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* Nút + Thêm ảnh (Click chọn tệp hoặc kéo thả ảnh vào) */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-20 rounded-lg border-2 border-dashed border-[#D5CEC2] hover:border-[#171613] hover:bg-white flex flex-col items-center justify-center text-center shrink-0 cursor-pointer transition-colors bg-[#FAF8F3] group p-1"
                          title="Chọn tệp ảnh từ máy tính hoặc kéo thả ảnh vào đây"
                        >
                          <Plus className="w-4 h-4 text-[#747069] group-hover:text-[#171613] mb-1" />
                          <span className="text-[10px] font-bold text-[#747069] group-hover:text-[#171613] leading-tight">
                            Thêm ảnh
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. THÔNG TIN CƠ BẢN */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <h3 className="font-bold text-xs text-[#171613]">1. Thông tin cơ bản & Phân loại</h3>
                        <span className="text-[10px] text-[#8A7158] font-medium">* Bắt buộc điền</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[#171613] font-semibold">Tên sản phẩm *</label>
                          {prodValidationErrors.name && (
                            <span className="text-[#DC2626] text-[11px] font-semibold">{prodValidationErrors.name}</span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="Ví dụ: Đầm lụa cắt xẻ tà nghệ thuật Silk Midi Dress"
                          className={`w-full bg-[#FAF8F3] border rounded-xl p-3 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613] ${
                            prodValidationErrors.name ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#E8E4DC]'
                          }`}
                        />
                      </div>

                      {/* Phân cấp danh mục thời trang: Danh mục cha -> Danh mục con */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[#171613] font-semibold">Danh mục chính *</label>
                            {prodValidationErrors.categoryId && (
                              <span className="text-[#DC2626] text-[10px] font-semibold">{prodValidationErrors.categoryId}</span>
                            )}
                          </div>
                          <select
                            value={editingProduct.categoryId || editingProduct.category || ''}
                            onChange={(e) => {
                              const newParentId = e.target.value;
                              const subs = categories.filter((c) => c.parentId === newParentId);
                              setEditingProduct({
                                ...editingProduct,
                                categoryId: newParentId,
                                category: newParentId,
                                subCategoryId: subs.length > 0 ? subs[0].id : ''
                              });
                            }}
                            className={`w-full bg-[#FAF8F3] border rounded-xl p-3 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613] ${
                              prodValidationErrors.categoryId ? 'border-[#DC2626]' : 'border-[#E8E4DC]'
                            }`}
                          >
                            <option value="">-- Chọn danh mục chính --</option>
                            {categories
                              .filter((c) => !c.parentId)
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.icon || '📁'} {cat.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Danh mục con (Cụ thể)</label>
                          <select
                            value={editingProduct.subCategoryId || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, subCategoryId: e.target.value })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="">-- Không chọn / Toàn bộ mục --</option>
                            {categories
                              .filter((c) => c.parentId === (editingProduct.categoryId || editingProduct.category))
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                  {sub.icon || '👕'} {sub.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Thương hiệu</label>
                          <select
                            value={editingProduct.brand}
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="GIA STUDIOS">GIA STUDIOS</option>
                            <option value="TADA! Signature">TADA! Signature</option>
                            <option value="LSEOUL">LSEOUL</option>
                            <option value="Subtle Le Chic">Subtle Le Chic</option>
                            <option value="CHATS by C.Dam">CHATS by C.Dam</option>
                            <option value="D.CHIC">D.CHIC</option>
                            <option value="Local Brand Tuyển Chọn">Local Brand Tuyển Chọn</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Xuất xứ / Dòng hàng</label>
                          <select
                            value={editingProduct.origin || 'vietnam_local_brand'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value as ProductOrigin })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="vietnam_local_brand">Vietnam Local Brand Tuyển Chọn</option>
                            <option value="ready_to_wear">Ready-to-Wear Cao Cấp</option>
                            <option value="luxury_import">Nhập Khẩu Chính Hãng</option>
                          </select>
                        </div>
                      </div>

                      {/* Hệ thống Tags & Nhãn nổi bật */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[#171613] font-semibold">Nhãn nổi bật (Tags)</label>
                          <span className="text-[10px] text-[#747069]">Bấm để bật / tắt nhãn</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: 'new', label: 'Mới về (New)' },
                            { key: 'bestseller', label: 'Bán chạy (Best Seller)' },
                            { key: 'trending', label: 'Xu hướng (Trending)' },
                            { key: 'sale', label: 'Ưu đãi đặc biệt' },
                            { key: 'featured', label: 'Nổi bật tuyển chọn' },
                            { key: 'order', label: 'Hàng thiết kế đặt trước' }
                          ].map((t) => {
                            const isSelected = (editingProduct.tags || []).includes(t.key as ProductTag);
                            return (
                              <button
                                key={t.key}
                                type="button"
                                onClick={() => {
                                  const curTags = editingProduct.tags || [];
                                  const nextTags = isSelected
                                    ? curTags.filter((k) => k !== t.key)
                                    : [...curTags, t.key as ProductTag];
                                  setEditingProduct({ ...editingProduct, tags: nextTags });
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                  isSelected
                                    ? 'bg-[#171613] text-white border-[#171613] shadow-xs'
                                    : 'bg-[#FAF8F3] text-[#747069] border-[#E8E4DC] hover:text-[#171613]'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {t.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tùy chọn Nổi bật trang chủ */}
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={Boolean(editingProduct.featured)}
                          onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#171613] accent-[#171613]"
                        />
                        <span className="text-[#171613] font-semibold">Hiển thị trong mục &quot;Bộ Sưu Tập Nổi Bật&quot; trên Trang chủ</span>
                      </label>

                      <div>
                        <label className="text-[#171613] font-semibold block mb-1">Mô tả ngắn *</label>
                        <textarea
                          rows={2}
                          value={editingProduct.shortDescription || editingProduct.description?.split('\n\n')[0] || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                          placeholder="Mô tả tóm tắt phong cách thiết kế và ưu điểm nổi bật..."
                          className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                        />
                      </div>

                      {/* Mô tả chi tiết với Toolbar định dạng Rich Text */}
                      <div>
                        <label className="text-[#171613] font-semibold block mb-1">Mô tả chi tiết *</label>
                        <div className="border border-[#E8E4DC] rounded-xl overflow-hidden bg-[#FAF8F3]">
                          <div className="flex items-center gap-1 p-2 bg-white border-b border-[#E8E4DC] text-[#747069] flex-wrap">
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded text-[#171613] font-bold"><Bold className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded italic"><Italic className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded underline"><Underline className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded line-through"><Strikethrough className="w-3.5 h-3.5" /></button>
                            <span className="w-px h-4 bg-[#E8E4DC] mx-1" />
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded"><List className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded"><ListOrdered className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded"><Quote className="w-3.5 h-3.5" /></button>
                            <span className="w-px h-4 bg-[#E8E4DC] mx-1" />
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded"><Link2 className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1 hover:bg-[#FAF8F3] rounded"><ImageIcon className="w-3.5 h-3.5" /></button>
                            <button type="button" className="p-1 hover:bg-[#FAF8F3] rounded ml-auto"><Maximize2 className="w-3.5 h-3.5" /></button>
                          </div>

                          <textarea
                            rows={5}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            placeholder="Nhập thông tin chất liệu, phom dáng, hướng dẫn phối đồ và bảng size..."
                            className="w-full bg-[#FAF8F3] p-3 text-xs text-[#171613] focus:outline-none resize-y"
                          />
                          <div className="p-2 text-right text-[10px] text-[#A8A29E] bg-white border-t border-[#E8E4DC]">
                            {(editingProduct.description || '').length}/2000 ký tự
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. THÔNG TIN BỔ SUNG & MÃ SẢN PHẨM */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <h3 className="font-bold text-xs text-[#171613]">2. Mã quản lý & Thông số vật liệu</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[#171613] font-semibold">Mã SKU chung</label>
                            {prodValidationErrors.sku && (
                              <span className="text-[#DC2626] text-[10px] font-semibold">{prodValidationErrors.sku}</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={editingProduct.sku || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                            placeholder="TADA-DR-001"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs font-mono text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Mã vạch (Barcode / EAN-13)</label>
                          <input
                            type="text"
                            value={editingProduct.barcode || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                            placeholder="8938500000000"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs font-mono text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Chất liệu chính</label>
                          <input
                            type="text"
                            value={editingProduct.material || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                            placeholder="Ví dụ: Cotton 100% 250gsm, Lụa tơ tằm"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Xuất xứ sản xuất</label>
                          <input
                            type="text"
                            value={editingProduct.originCountry || 'Việt Nam'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, originCountry: e.target.value })}
                            placeholder="Việt Nam, Hàn Quốc, Ý,..."
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. THUỘC TÍNH THỜI TRANG CHUYÊN SÂU */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <h3 className="font-bold text-xs text-[#171613]">3. Thuộc tính thời trang chuyên sâu</h3>
                        <span className="text-[10px] text-[#747069]">Hỗ trợ bộ lọc Shop & Gợi ý</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Đối tượng (Gender)</label>
                          <select
                            value={editingProduct.gender || 'nu'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="nu">Thời trang Nữ</option>
                            <option value="nam">Thời trang Nam</option>
                            <option value="unisex">Unisex (Nam & Nữ)</option>
                            <option value="tre-em">Trẻ em</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Phom dáng (Fit)</label>
                          <select
                            value={editingProduct.style || 'Regular fit'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, style: e.target.value })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="Regular fit">Regular fit (Tiêu chuẩn)</option>
                            <option value="Slim fit">Slim fit (Ôm vừa)</option>
                            <option value="Oversized">Oversized (Rộng rãi)</option>
                            <option value="Suông">Dáng suông thanh lịch</option>
                            <option value="Dáng chữ A">Dáng chữ A</option>
                            <option value="Bodycon">Ôm sát Bodycon</option>
                            <option value="Croptop">Croptop cá tính</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Họa tiết</label>
                          <select
                            value={editingProduct.pattern || 'Trơn'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, pattern: e.target.value })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="Trơn">Trơn / Tối giản</option>
                            <option value="Kẻ sọc">Kẻ sọc</option>
                            <option value="Ca-rô">Ca-rô (Plaid)</option>
                            <option value="Hoa nhí">Hoa nhí Vintage</option>
                            <option value="Chữ in">Chữ in nghệ thuật</option>
                            <option value="Họa tiết chìm">Họa tiết chìm Jacquard</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Mùa phù hợp</label>
                          <select
                            value={editingProduct.season || 'bon-mua'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, season: e.target.value as any })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-medium focus:outline-none focus:border-[#171613]"
                          >
                            <option value="bon-mua">Bốn mùa quanh năm</option>
                            <option value="xuan-he">Xuân - Hè thoáng mát</option>
                            <option value="thu-dong">Thu - Đông ấm áp</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Phong cách thiết kế</label>
                          <input
                            type="text"
                            value={editingProduct.fashionStyle || 'Thanh lịch đương đại'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, fashionStyle: e.target.value })}
                            placeholder="Thanh lịch công sở, Quiet Luxury, Minimalist..."
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 5. CÀI ĐẶT SEO & ĐƯỜNG DẪN TĨNH */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <h3 className="font-bold text-xs text-[#171613]">4. Tối ưu tìm kiếm (SEO & URL)</h3>
                        <button
                          type="button"
                          onClick={() => {
                            if (editingProduct.name) {
                              const autoSlug = editingProduct.name
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '');
                              setEditingProduct({
                                ...editingProduct,
                                slug: autoSlug,
                                seoTitle: editingProduct.name,
                                seoDescription: editingProduct.shortDescription || editingProduct.name
                              });
                            }
                          }}
                          className="text-[10px] text-[#8A7158] font-bold hover:underline"
                        >
                          ⚡ Tự sinh SEO từ Tên
                        </button>
                      </div>

                      <div>
                        <label className="text-[#171613] font-semibold block mb-1">Đường dẫn tĩnh (Slug URL)</label>
                        <div className="flex items-center">
                          <span className="px-3 py-2.5 bg-[#FAF8F3] border border-r-0 border-[#E8E4DC] rounded-l-xl text-xs text-[#747069] font-mono select-none">
                            /shop/
                          </span>
                          <input
                            type="text"
                            value={editingProduct.slug || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                            placeholder="dam-lua-cat-xe-ta"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-r-xl p-2.5 text-xs font-mono text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">SEO Title</label>
                          <input
                            type="text"
                            value={editingProduct.seoTitle || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                            placeholder="Tiêu đề trên kết quả Google"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">SEO Description</label>
                          <input
                            type="text"
                            value={editingProduct.seoDescription || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, seoDescription: e.target.value })}
                            placeholder="Tóm tắt ngắn gọn dưới tiêu đề Google"
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI (5 CỘT HOẶC 4 CỘT) */}
                  <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                    {/* 1. GIÁ & TỒN KHO & LỢI NHUẬN */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <h3 className="font-bold text-xs text-[#171613]">5. Giá bán & Biên lợi nhuận</h3>
                        {prodValidationErrors.price && (
                          <span className="text-[#DC2626] text-[10px] font-semibold">{prodValidationErrors.price}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Giá bán hiện tại *</label>
                          <div className="relative">
                            <input
                              type="number"
                              required
                              min={1000}
                              step={1000}
                              value={editingProduct.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const orig = editingProduct.originalPrice || val;
                                const disc = orig > val ? Math.round(((orig - val) / orig) * 100) : 0;
                                setEditingProduct({
                                  ...editingProduct,
                                  price: val,
                                  discountPercentage: disc
                                });
                              }}
                              className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 pr-8 text-xs font-bold text-[#171613] focus:outline-none focus:border-[#171613]"
                            />
                            <span className="absolute right-3 top-3 text-[#747069] font-bold">đ</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Giá gốc (Niêm yết)</label>
                          <div className="relative">
                            <input
                              type="number"
                              min={1000}
                              step={1000}
                              value={editingProduct.originalPrice || editingProduct.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const cur = editingProduct.price;
                                const disc = val > cur ? Math.round(((val - cur) / val) * 100) : 0;
                                setEditingProduct({
                                  ...editingProduct,
                                  originalPrice: val,
                                  discountPercentage: disc
                                });
                              }}
                              className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 pr-8 text-xs text-[#747069] focus:outline-none focus:border-[#171613]"
                            />
                            <span className="absolute right-3 top-3 text-[#747069]">đ</span>
                          </div>
                        </div>
                      </div>

                      {/* Giá vốn nội bộ & Tính toán lợi nhuận */}
                      <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[#171613] font-semibold">Giá vốn / Giá nhập xưởng (Admin)</label>
                          <span className="text-[10px] text-[#747069]">Chỉ nội bộ thấy</span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={editingProduct.costPrice || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                            placeholder="Nhập giá vốn"
                            className="w-full bg-white border border-[#E8E4DC] rounded-lg p-2 pr-8 text-xs font-mono text-[#171613]"
                          />
                          <span className="absolute right-3 top-2 text-[#747069]">đ</span>
                        </div>
                        {Boolean(editingProduct.costPrice && editingProduct.costPrice > 0) && (
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-[#747069]">Lợi nhuận gộp ước tính:</span>
                            <span className="font-bold text-[#15803D]">
                              +{formatPrice(editingProduct.price - (editingProduct.costPrice || 0))} (
                              {editingProduct.price > 0
                                ? Math.round(((editingProduct.price - (editingProduct.costPrice || 0)) / editingProduct.price) * 100)
                                : 0}
                              % biên độ)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Toggle Hiển thị giá gốc */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-[#747069]">Hiển thị giá gốc gạch ngang trên web</span>
                        <button
                          type="button"
                          onClick={() => setShowOriginalPrice(!showOriginalPrice)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            showOriginalPrice ? 'bg-[#2E7D32]' : 'bg-[#D5CEC2]'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              showOriginalPrice ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Giảm giá (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={99}
                              value={editingProduct.discountPercentage || 0}
                              onChange={(e) => {
                                const pct = Number(e.target.value);
                                const orig = editingProduct.originalPrice || editingProduct.price;
                                const newPrice = Math.round(orig * (1 - pct / 100));
                                setEditingProduct({
                                  ...editingProduct,
                                  discountPercentage: pct,
                                  price: newPrice
                                });
                              }}
                              className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 pr-7 text-xs text-[#171613] font-bold focus:outline-none focus:border-[#171613]"
                            />
                            <span className="absolute right-3 top-3 text-[#747069]">%</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-[#171613] font-semibold block mb-1">Trạng thái kinh doanh</label>
                          <select
                            value={editingProduct.status || 'active'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as ProductStatus })}
                            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#171613] font-semibold focus:outline-none focus:border-[#171613]"
                          >
                            <option value="active">🟢 Đang kinh doanh</option>
                            <option value="hidden">🟡 Tạm ẩn</option>
                            <option value="discontinued">🔴 Ngừng kinh doanh</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 2. BIẾN THỂ SẢN PHẨM & TỔN KHO */}
                    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-xs space-y-4 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE1]">
                        <div>
                          <h3 className="font-bold text-xs text-[#171613]">6. Biến thể & Quản lý tồn kho</h3>
                          <span className="text-[10px] text-[#747069]">Tổng tồn: {editingProduct.stockCount || 0} chiếc</span>
                        </div>
                        {prodValidationErrors.variants && (
                          <span className="text-[#DC2626] text-[10px] font-semibold">{prodValidationErrors.variants}</span>
                        )}
                      </div>

                      {/* Công cụ sinh biến thể tự động */}
                      <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#171613] text-[11px] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
                            <span>Tạo nhanh tổ hợp biến thể (Màu × Size)</span>
                          </span>
                        </div>

                        {/* Màu sắc Chips */}
                        <div>
                          <span className="text-[10px] text-[#747069] font-medium block mb-1.5">Chọn màu kích hoạt:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { name: 'Trắng Ivory', hex: '#F5F2EB' },
                              { name: 'Đen', hex: '#171613' },
                              { name: 'Be', hex: '#D9C3B0' },
                              { name: 'Xanh Navy', hex: '#1B2A4A' },
                              { name: 'Nâu Đất', hex: '#5C3D2E' },
                              { name: 'Đỏ Rượu', hex: '#722F37' }
                            ].map((c) => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => setSelectedColorChip(c.name)}
                                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center gap-1.5 transition-all ${
                                  selectedColorChip === c.name
                                    ? 'bg-[#171613] text-white border-[#171613] font-bold shadow-xs'
                                    : 'bg-white text-[#747069] border-[#E8E4DC]'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                                <span>{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Kích cỡ Pills */}
                        <div>
                          <span className="text-[10px] text-[#747069] font-medium block mb-1.5">Chọn size kích hoạt:</span>
                          <div className="flex items-center gap-1.5">
                            {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setSelectedSizeChip(s)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                  selectedSizeChip === s
                                    ? 'bg-[#171613] text-white'
                                    : 'bg-white text-[#747069] border border-[#E8E4DC] hover:text-[#171613]'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Nút sinh tự động tổ hợp */}
                        <div className="pt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const standardColors = [
                                { name: 'Trắng Ivory', hex: '#F5F2EB' },
                                { name: 'Đen', hex: '#171613' },
                                { name: 'Be', hex: '#D9C3B0' }
                              ];
                              handleAutoGenerateVariants(standardColors, ['S', 'M', 'L']);
                            }}
                            className="w-full py-2 bg-white hover:bg-[#E8D7BD] text-[#171613] border border-[#E8E4DC] rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
                            <span>Sinh tổ hợp chuẩn (3 Màu × 3 Size = 9 biến thể)</span>
                          </button>
                        </div>
                      </div>

                      {/* Bảng tồn kho theo biến thể */}
                      <div className="space-y-2 pt-1">
                        <span className="font-bold text-[#171613] block">Danh sách biến thể ({editingProduct.variants?.length || 0})</span>

                        <div className="border border-[#E8E4DC] rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-[#FAF8F3] text-[#747069] uppercase font-bold text-[9px] border-b border-[#E8E4DC] sticky top-0 z-10">
                              <tr>
                                <th className="p-2">Màu sắc</th>
                                <th className="p-2">Size</th>
                                <th className="p-2">SKU</th>
                                <th className="p-2 text-center">Tồn kho</th>
                                <th className="p-2 text-right">Trạng thái</th>
                                <th className="p-2 text-center">Xóa</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E4DC]">
                              {(editingProduct.variants || []).map((v) => (
                                <tr key={v.id} className="hover:bg-[#FAF8F3]">
                                  <td className="p-2 font-medium text-[#171613] flex items-center gap-1.5">
                                    <span
                                      className="w-3 h-3 rounded-full border border-[#D5CEC2] shrink-0"
                                      style={{ backgroundColor: v.colorHex || '#8A7158' }}
                                    />
                                    <span className="truncate max-w-[65px]">{v.color}</span>
                                  </td>
                                  <td className="p-2 font-bold text-[#171613]">{v.size}</td>
                                  <td className="p-2 font-mono text-[9px] text-[#747069] truncate max-w-[70px]">{v.sku}</td>
                                  <td className="p-2">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleStepVariantStock(v.id, -1)}
                                        className="w-5 h-5 rounded bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] flex items-center justify-center font-bold text-xs"
                                      >
                                        -
                                      </button>
                                      <span className="w-6 text-center font-bold text-[#171613] tabular-nums">
                                        {v.stockCount}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleStepVariantStock(v.id, 1)}
                                        className="w-5 h-5 rounded bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] flex items-center justify-center font-bold text-xs"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="p-2 text-right">
                                    {v.stockCount > 0 ? (
                                      <span className="px-1.5 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded text-[8px] font-bold">
                                        Còn hàng
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded text-[8px] font-bold">
                                        Hết hàng
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariant(v.id)}
                                      className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors"
                                      title="Xóa biến thể này"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Nút + Thêm biến thể khác thủ công */}
                        {isAddingVariant ? (
                          <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2 mt-2">
                            <span className="font-bold text-[#171613] block">Thêm biến thể thủ công:</span>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Tên màu"
                                value={newVarColor}
                                onChange={(e) => setNewVarColor(e.target.value)}
                                className="bg-white border border-[#E8E4DC] rounded-lg p-1.5 text-xs text-[#171613]"
                              />
                              <select
                                value={newVarSize}
                                onChange={(e) => setNewVarSize(e.target.value)}
                                className="bg-white border border-[#E8E4DC] rounded-lg p-1.5 text-xs text-[#171613]"
                              >
                                <option value="XS">Size XS</option>
                                <option value="S">Size S</option>
                                <option value="M">Size M</option>
                                <option value="L">Size L</option>
                                <option value="XL">Size XL</option>
                              </select>
                              <input
                                type="number"
                                min={0}
                                placeholder="Số lượng"
                                value={newVarStock}
                                onChange={(e) => setNewVarStock(Number(e.target.value))}
                                className="bg-white border border-[#E8E4DC] rounded-lg p-1.5 text-xs text-[#171613]"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setIsAddingVariant(false)}
                                className="px-2.5 py-1 text-[#747069] text-xs"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddNewVariantRow(newVarColor, newVarSize, newVarStock)}
                                className="px-3 py-1 bg-[#171613] text-white rounded-lg text-xs font-bold"
                              >
                                Thêm vào bảng
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsAddingVariant(true)}
                            className="w-full py-2.5 border border-[#E8E4DC] rounded-xl text-xs font-semibold text-[#171613] hover:bg-[#FAF8F3] transition-colors flex items-center justify-center gap-1.5 mt-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm biến thể thủ công khác</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* THANH THAO TÁC CỐ ĐỊNH PHÍA DƯỚI (HỦY / LƯU THAY ĐỔI) */}
                <div className="pt-4 border-t border-[#E8E4DC] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="px-6 py-2.5 border border-[#E8E4DC] bg-white hover:bg-[#FAF8F3] text-[#747069] hover:text-[#171613] text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#C7A66A]" />
                    <span>{products.some((p) => p.id === editingProduct.id) ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* CÁC TAB QUẢN TRỊ BÌNH THƯỜNG */
              <>
                {activeTab === 'products' && (
                  <ProductsTab
                    filteredProducts={filteredProducts}
                    handleOpenAddProduct={handleOpenAddProduct}
                    prodSearch={prodSearch}
                    setProdSearch={setProdSearch}
                    prodStockFilter={prodStockFilter}
                    setProdStockFilter={setProdStockFilter}
                    prodSortBy={prodSortBy}
                    setProdSortBy={setProdSortBy}
                    formatPrice={formatPrice}
                    handleOpenStockModal={handleOpenStockModal}
                    setEditingProduct={setEditingProduct}
                    setIsProductModalOpen={setIsProductModalOpen}
                    deleteProduct={deleteProduct}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersTab
                    filteredOrders={filteredOrders}
                    paginatedOrders={paginatedOrders}
                    handleExportCSV={handleExportCSV}
                    refreshOrders={refreshOrders}
                    orderSearch={orderSearch}
                    setOrderSearch={setOrderSearch}
                    orderStatusFilter={orderStatusFilter}
                    setOrderStatusFilter={setOrderStatusFilter}
                    orderPaymentFilter={orderPaymentFilter}
                    setOrderPaymentFilter={setOrderPaymentFilter}
                    orderDateRange={orderDateRange}
                    setOrderDateRange={setOrderDateRange}
                    orderPage={orderPage}
                    setOrderPage={setOrderPage}
                    totalOrderPages={totalOrderPages}
                    formatDate={formatDate}
                    formatPrice={formatPrice}
                    updateOrderStatus={updateOrderStatus}
                    refreshProducts={refreshProducts}
                    setViewingOrderDetail={setViewingOrderDetail}
                  />
                )}

                {activeTab === 'inventory_logs' && (
                  <InventoryLogsTab
                    inventoryLogs={inventoryLogs}
                    fetchInventoryLogs={fetchInventoryLogs}
                    formatDate={formatDate}
                  />
                )}

                {activeTab === 'dashboard' && (
                  <DashboardTab
                    dashboardTimeRange={dashboardTimeRange}
                    setDashboardTimeRange={setDashboardTimeRange}
                    dashboardStats={dashboardStats}
                    formatPrice={formatPrice}
                  />
                )}

                {activeTab === 'loyalty' && (
                  <LoyaltyTab
                    userList={userList}
                    formatPrice={formatPrice}
                  />
                )}

                {activeTab === 'coupons' && <CouponsTab />}

                {activeTab === 'categories' && (
                  <CategoriesTab
                    categories={categories}
                    products={products}
                    handleOpenAddCategory={handleOpenAddCategory}
                    handleOpenEditCategory={handleOpenEditCategory}
                    handleDeleteCategoryConfirm={handleDeleteCategoryConfirm}
                  />
                )}
          </>
        )}
      </main>
    </div>
  </div>

      {/* =========================================================================
          MODAL: ĐIỀU CHỈNH KHO HÀNG AN TOÀN
         ========================================================================= */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <div>
                <h3 className="font-bold text-base text-[#171613]">Điều Chỉnh Tồn Kho</h3>
                <p className="text-xs text-[#747069]">{stockModalProduct.name}</p>
              </div>
              <button
                onClick={() => setStockModalProduct(null)}
                className="p-1 text-[#747069] hover:text-[#171613]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmStockAdjust} className="space-y-4 text-xs">
              {/* Chọn biến thể (nếu có) */}
              {stockModalProduct.variants && stockModalProduct.variants.length > 0 && (
                <div>
                  <label className="font-semibold text-[#171613] block mb-1">
                    Chọn Biến Thể Size / Màu Cần Điều Chỉnh:
                  </label>
                  <select
                    value={selectedVariantId}
                    onChange={(e) => setSelectedVariantId(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-xs text-[#171613]"
                  >
                    <option value="all">
                      Toàn bộ sản phẩm (Tổng tồn: {stockModalProduct.stockCount} chiếc)
                    </option>
                    {stockModalProduct.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.color} - Size {v.size} (Hiện còn: {v.stockCount} chiếc) - SKU: {v.sku}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Loại điều chỉnh */}
              <div>
                <label className="font-semibold text-[#171613] block mb-1">Loại Thao Tác:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('import')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      adjustType === 'import'
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-[#FAF8F3] text-[#171613] border-[#E8E4DC]'
                    }`}
                  >
                    + Nhập thêm
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('export')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      adjustType === 'export'
                        ? 'bg-[#DC2626] text-white border-[#DC2626]'
                        : 'bg-[#FAF8F3] text-[#171613] border-[#E8E4DC]'
                    }`}
                  >
                    - Xuất giảm/hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('set')}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      adjustType === 'set'
                        ? 'bg-[#171613] text-white border-[#171613]'
                        : 'bg-[#FAF8F3] text-[#171613] border-[#E8E4DC]'
                    }`}
                  >
                    = Đặt số mới
                  </button>
                </div>
              </div>

              {/* Số lượng */}
              <div>
                <label className="font-semibold text-[#171613] block mb-1">
                  {adjustType === 'set' ? 'Số Lượng Tồn Kho Mới (Chiếc) *' : 'Số Lượng Thay Đổi (Chiếc) *'}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-xs font-bold text-[#171613]"
                />
              </div>

              {/* Lý do */}
              <div>
                <label className="font-semibold text-[#171613] block mb-1">Lý Do Điều Chỉnh & Ghi Chú *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nhập hàng lô xưởng mới, kiểm kê định kỳ..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2.5 text-xs text-[#171613]"
                />
              </div>

              {stockAdjustError && (
                <div className="p-2.5 bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] rounded-lg text-xs font-medium">
                  {stockAdjustError}
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 border border-[#E8E4DC] text-[#747069] rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStock}
                  className="px-4 py-2 bg-[#171613] hover:bg-[#8A7158] text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {isSubmittingStock ? 'Đang cập nhật...' : 'Xác Nhận Lưu Kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* =========================================================================
          MODAL: CHI TIẾT ĐƠN HÀNG & IN HÓA ĐƠN
         ========================================================================= */}
      {viewingOrderDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl print:m-0 print:p-0 print:shadow-none">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC] print:hidden">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#8A7158]" />
                <h3 className="font-bold text-base text-[#171613]">
                  Chi Tiết Đơn Hàng {viewingOrderDetail.orderCode}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Phiếu</span>
                </button>
                <button
                  onClick={() => setViewingOrderDetail(null)}
                  className="p-1 text-[#747069] hover:text-[#171613]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Khung Phiếu Đơn Hàng Tinh Tế TADA! */}
            <div className="space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-[#E8E4DC]">
                <h2 className="font-editorial text-2xl font-bold text-[#171613]">TADA! STUDIO</h2>
                <p className="text-[10px] text-[#747069]">PHIẾU GIAO HÀNG & XÁC NHẬN ĐƠN HÀNG</p>
                <p className="text-[11px] font-mono font-bold mt-1 text-[#171613]">{viewingOrderDetail.orderCode}</p>
                <p className="text-[10px] text-[#747069]">Ngày đặt: {formatDate(viewingOrderDetail.createdAt)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC]">
                <div>
                  <span className="font-bold text-[#171613] block mb-1">THÔNG TIN KHÁCH HÀNG:</span>
                  <p>Họ tên: <strong>{viewingOrderDetail.shippingAddress.fullName}</strong></p>
                  <p>Số điện thoại: <strong>{viewingOrderDetail.shippingAddress.phone}</strong></p>
                  <p>Email: {viewingOrderDetail.shippingAddress.email}</p>
                </div>
                <div>
                  <span className="font-bold text-[#171613] block mb-1">ĐỊA CHỈ GIAO HÀNG:</span>
                  <p>{viewingOrderDetail.shippingAddress.address}</p>
                  <p>
                    {viewingOrderDetail.shippingAddress.ward}, {viewingOrderDetail.shippingAddress.district},{' '}
                    {viewingOrderDetail.shippingAddress.city}
                  </p>
                </div>
              </div>

              {/* Danh sách mặt hàng */}
              <div className="border border-[#E8E4DC] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F3] border-b border-[#E8E4DC] text-[#171613] font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Sản phẩm</th>
                      <th className="p-2.5">Biến thể</th>
                      <th className="p-2.5 text-center">SL</th>
                      <th className="p-2.5 text-right">Đơn giá</th>
                      <th className="p-2.5 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E4DC]">
                    {viewingOrderDetail.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-[#171613]">{item.productName}</td>
                        <td className="p-2.5 text-[#747069]">{item.color} - Size {item.size}</td>
                        <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="p-2.5 text-right">{formatPrice(item.price)}</td>
                        <td className="p-2.5 text-right font-bold text-[#171613]">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tổng kết tiền */}
              <div className="space-y-1 text-right text-xs pt-2">
                <div>Tạm tính: <strong>{formatPrice(viewingOrderDetail.subtotal)}</strong></div>
                <div>Phí giao hàng: <strong>{formatPrice(viewingOrderDetail.shippingFee)}</strong></div>
                {viewingOrderDetail.discountAmount > 0 && (
                  <div className="text-[#15803D]">
                    Giảm giá: <strong>-{formatPrice(viewingOrderDetail.discountAmount)}</strong>
                  </div>
                )}
                <div className="text-sm font-bold text-[#B83A3A] pt-1 border-t border-[#E8E4DC]">
                  TỔNG CỘNG THANH TOÁN: {formatPrice(viewingOrderDetail.total)}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                <p>
                  Phương thức thanh toán: <strong>{viewingOrderDetail.paymentMethod.toUpperCase()}</strong>
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span>Trạng thái thanh toán:</span>
                  <select
                    value={viewingOrderDetail.paymentStatus || 'pending'}
                    onChange={async (e) => {
                      const newPay = e.target.value as Order['paymentStatus'];
                      await updateOrderStatus(
                        viewingOrderDetail.id,
                        viewingOrderDetail.status,
                        viewingOrderDetail.statusLabel,
                        `Admin cập nhật thanh toán: ${newPay}`,
                        newPay
                      );
                      setViewingOrderDetail({
                        ...viewingOrderDetail,
                        paymentStatus: newPay
                      });
                    }}
                    className="text-xs font-bold p-1 rounded border border-[#E8E4DC] bg-white"
                  >
                    <option value="pending">pending (Chưa thanh toán)</option>
                    <option value="partially_paid">partially_paid (Đã cọc)</option>
                    <option value="paid">paid (Đã thanh toán)</option>
                    <option value="refunded">refunded (Đã hoàn tiền)</option>
                  </select>
                </div>
                <p>
                  Trạng thái đơn hàng: <strong>{viewingOrderDetail.statusLabel}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / CHỈNH SỬA DANH MỤC THỜI TRANG ĐA CẤP
         ========================================================================= */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#8A7158]" />
                <h3 className="font-bold text-base text-[#171613]">
                  {editingCat ? `Chỉnh sửa: ${editingCat.name}` : catParentId ? 'Thêm Danh Mục Con' : 'Thêm Danh Mục Chính'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-[#747069] hover:text-[#171613]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4 text-xs">
              {/* Chọn danh mục cha */}
              <div>
                <label className="text-[#171613] font-semibold block mb-1">Cấp danh mục</label>
                <select
                  value={catParentId || ''}
                  onChange={(e) => setCatParentId(e.target.value || null)}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-medium"
                >
                  <option value="">📁 Danh mục gốc (Cấp 1 - Cha)</option>
                  {categories
                    .filter((c) => !c.parentId && (!editingCat || c.id !== editingCat.id))
                    .map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        ↳ Con của: {parent.icon || '📁'} {parent.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Tên danh mục */}
              <div>
                <label className="text-[#171613] font-semibold block mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Áo sơ mi nữ, Quần jeans ống suông..."
                  value={catNameInput}
                  onChange={(e) => {
                    setCatNameInput(e.target.value);
                    if (!editingCat) {
                      const auto = e.target.value
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      setCatSlugInput(auto);
                    }
                  }}
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613] font-semibold"
                />
              </div>

              {/* Đường dẫn Slug */}
              <div>
                <label className="text-[#171613] font-semibold block mb-1">Đường dẫn tĩnh (Slug URL)</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-[#FAF8F3] border border-r-0 border-[#E8E4DC] rounded-l-xl text-xs text-[#747069] font-mono select-none">
                    /shop?category=
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="ao-so-mi-nu"
                    value={catSlugInput}
                    onChange={(e) => setCatSlugInput(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-r-xl p-2 text-xs font-mono text-[#171613]"
                  />
                </div>
              </div>

              {/* Icon Emoji Picker */}
              <div>
                <label className="text-[#171613] font-semibold block mb-1">Biểu tượng Icon / Emoji</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={catIconInput}
                    onChange={(e) => setCatIconInput(e.target.value)}
                    placeholder="👗"
                    className="w-16 bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2 text-center text-lg text-[#171613]"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['👗', '👔', '👶', '👘', '👜', '🏷️', '🧥', '👖', '👟', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCatIconInput(emoji)}
                        className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all ${
                          catIconInput === emoji
                            ? 'bg-[#171613] text-white border-[#171613] scale-110 shadow-xs'
                            : 'bg-[#FAF8F3] hover:bg-white border-[#E8E4DC]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thứ tự & Hiển thị */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#171613] font-semibold block mb-1">Thứ tự ưu tiên</label>
                  <input
                    type="number"
                    min={1}
                    value={catOrderInput}
                    onChange={(e) => setCatOrderInput(Number(e.target.value))}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2 text-xs font-bold text-[#171613]"
                  />
                </div>
                <div>
                  <label className="text-[#171613] font-semibold block mb-1">Trạng thái</label>
                  <select
                    value={catIsActiveInput ? 'active' : 'hidden'}
                    onChange={(e) => setCatIsActiveInput(e.target.value === 'active')}
                    className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2 text-xs font-medium text-[#171613]"
                  >
                    <option value="active">🟢 Đang hiển thị</option>
                    <option value="hidden">🟡 Tạm ẩn</option>
                  </select>
                </div>
              </div>

              {/* Mô tả danh mục */}
              <div>
                <label className="text-[#171613] font-semibold block mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={catDescInput}
                  onChange={(e) => setCatDescInput(e.target.value)}
                  placeholder="Mô tả phong cách và sản phẩm thuộc danh mục này..."
                  className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#171613]"
                />
              </div>

              {catError && (
                <div className="p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] rounded-xl text-xs font-medium">
                  {catError}
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E4DC] text-[#747069] rounded-xl hover:bg-[#FAF8F3] transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCat}
                  className="px-5 py-2 bg-[#171613] hover:bg-[#8A7158] text-white font-bold rounded-xl disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isSubmittingCat ? 'Đang lưu...' : editingCat ? 'Cập Nhật Danh Mục' : 'Tạo Danh Mục Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XEM TRƯỚC SẢN PHẨM TRỰC QUAN (BUYER EXPERIENCE LIVE PREVIEW)
         ========================================================================= */}
      {isProductPreviewOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#8A7158]" />
                <h3 className="font-bold text-base text-[#171613]">
                  Xem Trước Thẻ Sản Phẩm Hiển Thị Trên Website
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductPreviewOpen(false)}
                className="p-1 text-[#747069] hover:text-[#171613]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Thẻ sản phẩm thật 100% */}
              <div className="flex justify-center p-4 bg-[#FAF8F3] rounded-2xl border border-[#E8E4DC]">
                <div className="w-full max-w-[280px]">
                  <ProductCard product={editingProduct} />
                </div>
              </div>

              {/* Thông số kỹ thuật nhanh */}
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                  <span className="font-bold text-[#171613] block">Thông Tin Sản Phẩm:</span>
                  <div>
                    <span className="text-[#747069]">Tên: </span>
                    <strong className="text-[#171613]">{editingProduct.name || '(Chưa nhập tên)'}</strong>
                  </div>
                  <div>
                    <span className="text-[#747069]">Danh mục: </span>
                    <strong className="text-[#171613]">
                      {categories.find((c) => c.id === (editingProduct.categoryId || editingProduct.category))?.name ||
                        editingProduct.category}
                      {editingProduct.subCategoryId && (
                        <span>
                          {' > '}
                          {categories.find((c) => c.id === editingProduct.subCategoryId)?.name ||
                            editingProduct.subCategoryId}
                        </span>
                      )}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#747069]">Thương hiệu: </span>
                    <strong className="text-[#171613]">{editingProduct.brand}</strong>
                  </div>
                  <div>
                    <span className="text-[#747069]">Giá bán hiện tại: </span>
                    <strong className="text-[#B83A3A] font-bold">{formatPrice(editingProduct.price)}</strong>
                  </div>
                  {editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price && (
                    <div>
                      <span className="text-[#747069]">Giá gốc: </span>
                      <span className="line-through text-[#747069]">{formatPrice(editingProduct.originalPrice)}</span>
                      <span className="text-[#15803D] font-bold ml-1.5">
                        (-{editingProduct.discountPercentage || 0}%)
                      </span>
                    </div>
                  )}
                  {Boolean(editingProduct.costPrice && editingProduct.costPrice > 0) && (
                    <div className="pt-1 border-t border-[#E8E4DC]">
                      <span className="text-[#747069]">Giá vốn nội bộ: </span>
                      <strong>{formatPrice(editingProduct.costPrice || 0)}</strong>
                      <div className="text-[#15803D] font-semibold">
                        Lợi nhuận gộp: +{formatPrice(editingProduct.price - (editingProduct.costPrice || 0))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E8E4DC] space-y-2">
                  <span className="font-bold text-[#171613] block">Tổ Hợp Biến Thể & Kho:</span>
                  <div>
                    <span className="text-[#747069]">Số biến thể đã tạo: </span>
                    <strong>{editingProduct.variants?.length || 0} biến thể</strong>
                  </div>
                  <div>
                    <span className="text-[#747069]">Tổng tồn kho: </span>
                    <strong>{editingProduct.stockCount || 0} sản phẩm</strong>
                  </div>
                  <div>
                    <span className="text-[#747069]">Nhãn nổi bật: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(editingProduct.tags || []).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-[#171613] text-white rounded text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProductPreviewOpen(false)}
                    className="px-5 py-2 bg-[#171613] text-white rounded-xl text-xs font-bold hover:bg-[#8A7158] transition-colors"
                  >
                    Đóng xem trước
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
