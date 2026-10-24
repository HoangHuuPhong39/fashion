import { NextResponse, NextRequest } from 'next/server';
import { getDBCategories, createOrUpdateCategory, deleteDBCategory, getDBProducts } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function GET() {
  try {
    const categories = getDBCategories();
    const products = getDBProducts();

    // Tính số lượng sản phẩm thực tế cho từng danh mục
    const categoriesWithCount = categories.map((cat) => {
      const parentCount = products.filter(
        (p) => (p.categoryId && p.categoryId === cat.slug) || (p.category && p.category === cat.slug)
      ).length;

      const subWithCount = (cat.subcategories || []).map((sub) => {
        const subCount = products.filter(
          (p) => (p.subCategoryId && p.subCategoryId === sub.slug) || (p.subCategory && p.subCategory === sub.slug)
        ).length;
        return {
          ...sub,
          count: subCount
        };
      });

      return {
        ...cat,
        count: parentCount,
        subcategories: subWithCount
      };
    });

    return NextResponse.json(
      { success: true, categories: categoriesWithCount },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải danh mục.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Tên danh mục không được để trống.' }, { status: 400 });
    }

    const result = createOrUpdateCategory(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    const updatedCategories = getDBCategories();
    return NextResponse.json({ success: true, message: result.message, categories: updatedCategories });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, message: 'Không thể cập nhật danh mục.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('slug');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID danh mục cần xóa.' }, { status: 400 });
    }

    const result = deleteDBCategory(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    const updatedCategories = getDBCategories();
    return NextResponse.json({ success: true, message: result.message, categories: updatedCategories });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, message: 'Không thể xóa danh mục.' }, { status: 500 });
  }
}
