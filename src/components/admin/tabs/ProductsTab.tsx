'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Layers, Eye, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductsTabProps {
  filteredProducts: Product[];
  handleOpenAddProduct: () => void;
  prodSearch: string;
  setProdSearch: (val: string) => void;
  prodStockFilter: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'hidden';
  setProdStockFilter: (val: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'hidden') => void;
  prodSortBy: 'updated' | 'name' | 'stock_desc' | 'stock_asc' | 'price_desc' | 'price_asc';
  setProdSortBy: (val: 'updated' | 'name' | 'stock_desc' | 'stock_asc' | 'price_desc' | 'price_asc') => void;
  formatPrice: (price: number) => string;
  handleOpenStockModal: (prod: Product) => void;
  setEditingProduct: (prod: Product | null) => void;
  setIsProductModalOpen: (open: boolean) => void;
  deleteProduct: (id: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  filteredProducts,
  handleOpenAddProduct,
  prodSearch,
  setProdSearch,
  prodStockFilter,
  setProdStockFilter,
  prodSortBy,
  setProdSortBy,
  formatPrice,
  handleOpenStockModal,
  setEditingProduct,
  setIsProductModalOpen,
  deleteProduct
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <h2 className="font-editorial text-xl font-semibold text-[#171613]">
            Quản Lý Kho Hàng & Điều Chỉnh Sản Phẩm
          </h2>
          <p className="text-xs text-[#747069]">
            Chỉnh sửa tồn kho theo biến thể, nhập xuất kho an toàn, sửa giá bán và quản lý nhiều ảnh sản phẩm.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A8A29E]" />
          <input
            type="text"
            placeholder="Tìm tên, SKU, hãng..."
            value={prodSearch}
            onChange={(e) => setProdSearch(e.target.value)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg py-2 pl-8 pr-3 text-xs text-[#171613] focus:outline-none focus:border-[#171613]"
          />
        </div>

        <div>
          <select
            value={prodStockFilter}
            onChange={(e) => setProdStockFilter(e.target.value as any)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
          >
            <option value="all">Tất cả tình trạng kho</option>
            <option value="in_stock">Còn hàng (&gt; 5 chiếc)</option>
            <option value="low_stock">Sắp hết hàng (&le; 5 chiếc)</option>
            <option value="out_of_stock">Hết hàng (0 chiếc)</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>

        <div>
          <select
            value={prodSortBy}
            onChange={(e) => setProdSortBy(e.target.value as any)}
            className="w-full bg-[#FAF8F3] border border-[#E8E4DC] rounded-lg p-2 text-xs text-[#171613]"
          >
            <option value="updated">Mới cập nhật gần đây</option>
            <option value="name">Tên sản phẩm (A-Z)</option>
            <option value="stock_desc">Tồn kho nhiều nhất</option>
            <option value="stock_asc">Tồn kho ít nhất</option>
            <option value="price_desc">Giá cao nhất</option>
            <option value="price_asc">Giá thấp nhất</option>
          </select>
        </div>

        <div className="text-right flex items-center justify-end text-xs text-[#747069]">
          Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto border border-[#E8E4DC] rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F3] text-[#171613] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8E4DC]">
              <th className="p-3">Sản phẩm & SKU</th>
              <th className="p-3">Thương Hiệu</th>
              <th className="p-3">Giá Bán</th>
              <th className="p-3">Tồn Kho & Biến Thể</th>
              <th className="p-3">Trạng Thái</th>
              <th className="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E4DC]">
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stockCount <= 0;
              const isLowStock = prod.stockCount > 0 && prod.stockCount <= 5;
              const variantCount = prod.variants ? prod.variants.length : 0;

              return (
                <tr key={prod.id} className="hover:bg-[#FAF8F3] transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF8F3] shrink-0 border border-[#E8E4DC]">
                      <SafeImage src={prod.images[0]} alt="" fill className="object-cover" sizes="48px" />
                      {prod.images.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-[#171613]/80 text-white text-[8px] font-bold px-1 rounded-tl">
                          +{prod.images.length - 1}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 max-w-xs">
                      <div className="font-semibold text-[#171613] truncate">{prod.name}</div>
                      <div className="text-[10px] text-[#8A7158] font-mono mt-0.5">
                        SKU: {prod.sku || `TADA-${prod.id.slice(-4)}`}
                      </div>
                      <div className="text-[10px] text-[#747069]">
                        {prod.category === 'nu' ? 'Nữ' : prod.category === 'nam' ? 'Nam' : prod.category}
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-[#8A7158]">{prod.brand}</div>
                    <div className="text-[10px] text-[#747069]">
                      {prod.origin === 'international_order' ? 'Order QT' : 'Local Brand VN'}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-[#B83A3A] block">{formatPrice(prod.price)}</span>
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-[#A8A29E] line-through block">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isOutOfStock
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : isLowStock
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#DCFCE7] text-[#15803D]'
                        }`}
                      >
                        {prod.stockCount} chiếc
                      </span>
                    </div>
                    {variantCount > 0 && (
                      <div className="text-[10px] text-[#747069] mt-1 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#A8A29E]" />
                        <span>{variantCount} biến thể (Size & Màu)</span>
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    {prod.status === 'hidden' ? (
                      <span className="px-2 py-0.5 bg-[#F1F3F5] text-[#495057] rounded text-[10px] font-bold">
                        Đang ẩn
                      </span>
                    ) : prod.status === 'discontinued' ? (
                      <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#DC2626] rounded text-[10px] font-bold">
                        Ngừng bán
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded text-[10px] font-bold">
                        Đang bán
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleOpenStockModal(prod)}
                        className="px-2.5 py-1 bg-[#171613] text-[#FAF8F3] hover:bg-[#8A7158] rounded text-[11px] font-semibold transition-colors"
                        title="Điều chỉnh tồn kho"
                      >
                        Điều chỉnh kho
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#E8D7BD] border border-[#E8E4DC] rounded text-[11px] font-semibold text-[#171613] transition-colors"
                        title="Sửa sản phẩm & ảnh"
                      >
                        Sửa
                      </button>
                      <Link
                        href={`/product/${prod.slug || prod.id}`}
                        target="_blank"
                        className="p-1 text-[#747069] hover:text-[#171613] hover:bg-[#F4F1EA] rounded"
                        title="Xem trang chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (
                            confirm(`Bạn có chắc muốn xóa sản phẩm "${prod.name}"? Thao tác này không thể hoàn tác.`)
                          ) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
