import { NextResponse, NextRequest } from 'next/server';
import { getDBProducts, saveOrUpdateProduct, queryProducts } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hasFilters = searchParams.toString().length > 0;

    // Nếu không có bất kỳ query param nào, trả về danh sách đầy đủ tương thích ngược
    if (!hasFilters) {
      const products = getDBProducts();
      return NextResponse.json(
        { success: true, products, total: products.length },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
          }
        }
      );
    }

    const category = searchParams.get('category') || undefined;
    const subCategory = searchParams.get('subCategory') || searchParams.get('sub') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const origin = searchParams.get('origin') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const color = searchParams.get('color') || undefined;
    const size = searchParams.get('size') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const inStockOnly = searchParams.get('inStock') === 'true';
    const status = searchParams.get('status') || undefined;
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const sortBy = (searchParams.get('sortBy') || searchParams.get('sort') || 'popular') as any;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;

    const result = queryProducts({
      category,
      subCategory,
      brand,
      origin,
      minPrice,
      maxPrice,
      color,
      size,
      tag,
      query,
      inStockOnly,
      status,
      includeHidden,
      sortBy,
      page,
      limit
    });

    return NextResponse.json(
      {
        success: true,
        products: result.products,
        total: result.total,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));
    
    // Server-side validation
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Tên sản phẩm không được để trống.' }, { status: 400 });
    }
    if (body.price === undefined || typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({ success: false, message: 'Giá bán phải là số lớn hơn hoặc bằng 0.' }, { status: 400 });
    }
    if (!body.categoryId && !body.category) {
      return NextResponse.json({ success: false, message: 'Vui lòng chọn danh mục chính cho sản phẩm.' }, { status: 400 });
    }

    const product = saveOrUpdateProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: 'Không thể tạo sản phẩm. Vui lòng kiểm tra lại.' }, { status: 400 });
  }
}
