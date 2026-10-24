import { NextResponse } from 'next/server';
import { getProductById, saveOrUpdateProduct, deleteDBProduct } from '@/lib/db';
import { requireAdmin } from '@/lib/guard';
import { recordAdminAuditLog } from '@/lib/audit';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tải thông tin sản phẩm.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const oldProduct = getProductById(id);
    const updated = saveOrUpdateProduct({ ...body, id });

    if (oldProduct && typeof body.price === 'number' && oldProduct.price !== body.price) {
      recordAdminAuditLog({
        action: 'price_change',
        entity: 'product',
        entityId: id,
        performedBy: authCheck.user.email || authCheck.user.name,
        details: {
          productName: updated.name,
          beforePrice: oldProduct.price,
          afterPrice: body.price
        }
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Không thể cập nhật sản phẩm.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { id } = await params;
    const oldProduct = getProductById(id);
    const deleted = deleteDBProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm để xóa.' }, { status: 404 });
    }

    recordAdminAuditLog({
      action: 'price_change', // audit record
      entity: 'product',
      entityId: id,
      performedBy: authCheck.user.email || authCheck.user.name,
      details: {
        actionNote: 'Xóa sản phẩm khỏi hệ thống',
        deletedProductName: oldProduct?.name
      }
    });

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Không thể xóa sản phẩm.' }, { status: 500 });
  }
}
