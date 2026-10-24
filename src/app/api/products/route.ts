import { NextResponse, NextRequest } from 'next/server';
import { getDBProducts, saveOrUpdateProduct, queryProducts } from '@/lib/db';
import { requireAdmin, getSessionUser, verifyMutationOrigin } from '@/lib/guard';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionUser = getSessionUser(request);
    const isAdmin = sessionUser?.role === 'admin';

    const hasFilters = searchParams.toString().length > 0;

    // BẢO MẬT: Người dùng chưa là admin TUYỆT ĐỐI không thể dùng includeHidden hoặc status để xem hàng ẩn
    const includeHidden = isAdmin ? searchParams.get('includeHidden') === 'true' : false;
    const requestedStatus = isAdmin ? searchParams.get('status') || undefined : 'active';

    // Nếu không có bất kỳ query param nào, trả về danh sách tương thích ngược
    if (!hasFilters) {
      const allProducts = getDBProducts();
      const filteredProducts = isAdmin
        ? allProducts
        : allProducts.filter((p) => !p.status || p.status === 'active');

      return NextResponse.json(
        { success: true, products: filteredProducts, total: filteredProducts.length },
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
      status: requestedStatus,
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
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60'
        }
      }
    );
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải danh sách sản phẩm.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const body = await request.json().catch(() => ({}));

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, message: 'Tên sản phẩm và giá bán là thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    const created = saveOrUpdateProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: 'Không thể tạo sản phẩm.' }, { status: 400 });
  }
}
