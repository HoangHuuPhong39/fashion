'use client';

import React from 'react';
import { Layers, Plus, Edit3, Trash2 } from 'lucide-react';
import { Category, Product } from '@/types';

interface CategoriesTabProps {
  categories: Category[];
  products: Product[];
  handleOpenAddCategory: (parentId: string | null) => void;
  handleOpenEditCategory: (cat: Category, parentId: string | null) => void;
  handleDeleteCategoryConfirm: (id: string, name: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  products,
  handleOpenAddCategory,
  handleOpenEditCategory,
  handleDeleteCategoryConfirm
}) => {
  return (
    <div className="space-y-6">
      {/* Header Tab */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#171613] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#8A7158]" />
            <span>Quản Lý Cây Danh Mục Thời Trang</span>
          </h2>
          <p className="text-xs text-[#747069] mt-1">
            Thiết kế cấu trúc phân cấp đa cấp (Danh mục chính & Danh mục con). Dữ liệu tự động đồng bộ vào Mega Menu, Thanh điều hướng, Bộ lọc và Form thêm sản phẩm.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenAddCategory(null)}
            className="px-4 py-2.5 bg-[#171613] hover:bg-[#8A7158] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#C7A66A]" />
            <span>+ Thêm Danh Mục Chính</span>
          </button>
        </div>
      </div>

      {/* Thống kê nhanh danh mục */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#747069] block">Danh mục chính (Cha)</span>
            <span className="font-editorial text-2xl font-bold text-[#171613]">
              {categories.filter((c) => !c.parentId).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-lg">
            📁
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#747069] block">Danh mục con (Chi tiết)</span>
            <span className="font-editorial text-2xl font-bold text-[#171613]">
              {categories.filter((c) => Boolean(c.parentId)).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F3] border border-[#E8E4DC] flex items-center justify-center text-lg">
            👕
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#747069] block">Đang hiển thị Trang chủ</span>
            <span className="font-editorial text-2xl font-bold text-[#15803D]">
              {categories.filter((c) => c.isActive !== false).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-lg">
            ✓
          </div>
        </div>
      </div>

      {/* Cây Danh Mục Chi Tiết */}
      <div className="space-y-4">
        {categories
          .filter((c) => !c.parentId)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((parentCat) => {
            const subCats = categories
              .filter((c) => c.parentId === parentCat.id)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            const parentProdCount = products.filter(
              (p) => p.categoryId === parentCat.id || p.category === parentCat.slug
            ).length;

            return (
              <div
                key={parentCat.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden shadow-xs"
              >
                {/* Dòng Danh mục cha */}
                <div className="p-4 sm:p-5 bg-[#FAF8F3] border-b border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DC] flex items-center justify-center text-xl shadow-xs shrink-0">
                      {parentCat.icon || '📁'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[#171613]">{parentCat.name}</h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white border border-[#E8E4DC] text-[#747069]">
                          /{parentCat.slug}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8D7BD] text-[#171613]">
                          Danh mục chính
                        </span>
                        {parentCat.isActive !== false ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F5E9] text-[#2E7D32]">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                            Tạm ẩn
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#747069] mt-0.5">
                        {subCats.length} danh mục con • {parentProdCount} sản phẩm liên kết
                        {parentCat.description ? ` • ${parentCat.description}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Thao tác với mục cha */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenAddCategory(parentCat.id)}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#E8D7BD] text-[#171613] border border-[#E8E4DC] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Thêm danh mục con vào mục này"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8A7158]" />
                      <span>Thêm con</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(parentCat, null)}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#FAF8F3] text-[#171613] border border-[#E8E4DC] rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Chỉnh sửa danh mục chính"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#747069]" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategoryConfirm(parentCat.id, parentCat.name)}
                      className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                      title="Xóa danh mục chính"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Danh sách các danh mục con lồng bên trong */}
                {subCats.length > 0 ? (
                  <div className="divide-y divide-[#F0ECE1]">
                    {subCats.map((sub) => {
                      const subProdCount = products.filter(
                        (p) => p.subCategoryId === sub.id || p.category === sub.slug
                      ).length;

                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 sm:px-6 flex items-center justify-between gap-3 hover:bg-[#FAF8F3]/60 transition-colors"
                        >
                          <div className="flex items-center gap-3 pl-4 sm:pl-8 border-l-2 border-[#E8E4DC] ml-3 sm:ml-5">
                            <span className="text-base">{sub.icon || '👕'}</span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs text-[#171613]">{sub.name}</span>
                                <span className="text-[10px] font-mono text-[#747069]">/{sub.slug}</span>
                                <span className="text-[10px] text-[#A8A29E]">Thứ tự: {sub.order || 1}</span>
                              </div>
                              <span className="text-[10px] text-[#747069]">
                                {subProdCount} sản phẩm
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(sub, parentCat.id)}
                              className="p-1.5 text-[#747069] hover:text-[#171613] hover:bg-[#FAF8F3] rounded-lg transition-colors"
                              title="Chỉnh sửa danh mục con"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategoryConfirm(sub.id, sub.name)}
                              className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                              title="Xóa danh mục con"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#A8A29E] italic">
                    Chưa có danh mục con nào. Bấm &quot;+ Thêm con&quot; để thêm các phân loại chi tiết.
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
