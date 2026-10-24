import { NextResponse } from 'next/server';
import { getSizeGuideByCategoryOrProduct, getSizeGuides } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const productId = searchParams.get('productId');

    if (category || productId) {
      const guide = getSizeGuideByCategoryOrProduct(category || '', productId || '');
      return NextResponse.json({ success: true, guide });
    }

    const guides = getSizeGuides();
    return NextResponse.json({ success: true, guides });
  } catch (error) {
    console.error('Error fetching size guide:', error);
    return NextResponse.json({ success: false, message: 'Lỗi tải bảng size' }, { status: 500 });
  }
}
