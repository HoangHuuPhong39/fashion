'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant, Category } from '@/types';
import { getAuthHeaders } from '@/context/AuthContext';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Promise<Product>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  updatePrice: (id: string, newPrice: number, newOriginalPrice?: number) => Promise<void>;
  adjustStock: (
    productId: string,
    variantId: string | null | undefined,
    change: number,
    type: 'import' | 'manual_adjust' | 'order_deduct' | 'order_cancel_return',
    reason: string,
    performedBy?: string
  ) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<void>;
  resetToDefault: () => void;
  refreshProducts: () => Promise<void>;
  fetchProducts: (page?: number, limit?: number) => Promise<any>;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  // Dynamic categories management
  fetchCategories: () => Promise<void>;
  saveCategory: (cat: Partial<Category>) => Promise<{ success: boolean; message: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; message: string }>;
  // Analytics & search tracking
  trendingSearches: { query: string; count: number }[];
  trackSearch: (query: string, count: number) => Promise<void>;
  trackProductView: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'tada_fashion_products';
const CATEGORIES_STORAGE_KEY = 'tada_fashion_categories';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<{ query: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
          try {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(data.categories));
          } catch {}
          return;
        }
      }
    } catch (e) {
      console.warn('Cannot fetch /api/categories', e);
    }

    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        setCategories(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const fetchTrendingSearches = useCallback(async () => {
    try {
      const res = await fetch('/api/search/track?limit=8');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.trending)) {
          setTrendingSearches(data.trending);
        }
      }
    } catch {}
  }, []);

  const fetchProducts = useCallback(async (page?: number, limit?: number) => {
    try {
      const url = page && limit ? `/api/products?page=${page}&limit=${limit}` : '/api/products';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          return data;
        }
      }
    } catch (e) {
      console.warn('Cannot fetch from /api/products', e);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const initData = async () => {
      try {
        await Promise.all([fetchProducts(), fetchCategories(), fetchTrendingSearches()]);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    void initData();
    return () => {
      active = false;
    };
  }, [fetchProducts, fetchCategories, fetchTrendingSearches]);

  const saveProductsLocal = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'> & { id?: string }): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          setProducts((prev) => [data.product, ...prev]);
          // Cập nhật lại số lượng danh mục
          fetchCategories();
          return data.product;
        }
      }
    } catch (e) {
      console.error('Error adding product via API', e);
    }

    // Fallback offline
    const id = productData.id || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      slug: productData.slug || id,
      category: productData.categoryId || productData.category || 'nu',
      categoryId: productData.categoryId || 'nu',
      subCategoryId: productData.subCategoryId || 'ao-kieu-nu',
      rating: productData.rating || 5,
      reviewCount: productData.reviewCount || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      stockCount: productData.stockCount !== undefined ? productData.stockCount : 10,
      estimatedDelivery: productData.estimatedDelivery || 'Hỏa tốc 2-4h (Nội thành)',
      images: productData.images && productData.images.length > 0 ? productData.images : ['/images/placeholder-fashion.svg'],
      colors: productData.colors && productData.colors.length > 0 ? productData.colors : [{ name: 'Đen Tiêu Chuẩn', hex: '#171613' }],
      sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ['S', 'M', 'L'],
      material: productData.material || 'Cotton / Silk cao cấp',
      careInstructions: productData.careInstructions || ['Giặt nhẹ', 'Không sấy nhiệt độ cao']
    };

    const updated = [newProduct, ...products];
    saveProductsLocal(updated);
    return newProduct;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
          fetchCategories();
          return;
        }
      }
    } catch (e) {
      console.error('Error updating product via API', e);
    }

    // Fallback
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProductsLocal(updated);
  };

  const updatePrice = async (id: string, newPrice: number, newOriginalPrice?: number) => {
    const target = products.find((p) => p.id === id);
    const orig = newOriginalPrice !== undefined ? newOriginalPrice : (target?.originalPrice || target?.price || newPrice);
    const discountPercentage = orig > newPrice ? Math.round(((orig - newPrice) / orig) * 100) : 0;

    await updateProduct(id, {
      price: newPrice,
      originalPrice: orig,
      discountPercentage,
      isSale: discountPercentage > 0
    });
  };

  const adjustStock = async (
    productId: string,
    variantId: string | null | undefined,
    change: number,
    type: 'import' | 'manual_adjust' | 'order_deduct' | 'order_cancel_return',
    reason: string,
    performedBy: string = 'Admin'
  ) => {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          productId,
          variantId,
          change,
          type,
          reason,
          performedBy
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.updatedProduct) {
          setProducts((prev) => prev.map((p) => (p.id === productId ? data.updatedProduct : p)));
        } else {
          await fetchProducts();
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Lỗi điều chỉnh kho' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        fetchCategories();
        return;
      }
    } catch (e) {
      console.error('Error deleting product via API', e);
    }

    const updated = products.filter((p) => p.id !== id);
    saveProductsLocal(updated);
  };

  const resetToDefault = () => {
    fetchProducts();
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const saveCategory = async (catData: Partial<Category>): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(catData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          await fetchCategories();
        }
        return { success: true, message: data.message || 'Lưu danh mục thành công.' };
      }
      return { success: false, message: data.message || 'Không thể lưu danh mục.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ.' };
    }
  };

  const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          await fetchCategories();
        }
        return { success: true, message: data.message || 'Đã xóa danh mục.' };
      }
      return { success: false, message: data.message || 'Không thể xóa danh mục.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối máy chủ.' };
    }
  };

  const trackSearch = async (query: string, count: number) => {
    try {
      await fetch('/api/search/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, resultsCount: count })
      });
    } catch {}
  };

  const trackProductView = async (productId: string) => {
    try {
      await fetch('/api/products/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
    } catch {}
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        addProduct,
        updateProduct,
        updatePrice,
        adjustStock,
        deleteProduct,
        resetToDefault,
        refreshProducts: fetchProducts,
        fetchProducts,
        getProductById,
        getProductBySlug,
        fetchCategories,
        saveCategory,
        deleteCategory,
        trendingSearches,
        trackSearch,
        trackProductView
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
