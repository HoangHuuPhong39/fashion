import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export * from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (!dbInstance) {
    const client = neon(connectionString);
    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}

export const db = getDb();

/**
 * Mẫu trừ kho an toàn có Transaction và Khóa dòng (SELECT ... FOR UPDATE) trên PostgreSQL
 * Dùng khi chuyển hẳn sang PostgreSQL runtime
 */
export async function adjustStockWithRowLock(
  client: any,
  productId: string,
  variantId: string | null | undefined,
  quantityChange: number
): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Nếu trừ kho biến thể: khóa dòng variant
    if (variantId) {
      const lockedVariantResult = await client.query(
        `SELECT id, stock_count, product_id FROM variants WHERE id = $1 FOR UPDATE`,
        [variantId]
      );

      if (!lockedVariantResult.rows || lockedVariantResult.rows.length === 0) {
        return { success: false, message: 'Không tìm thấy biến thể trong database.' };
      }

      const variant = lockedVariantResult.rows[0];
      const newVariantStock = variant.stock_count + quantityChange;
      if (newVariantStock < 0) {
        return { success: false, message: `Tồn kho biến thể không đủ (hiện còn ${variant.stock_count}).` };
      }

      await client.query(
        `UPDATE variants SET stock_count = $1, in_stock = $2 WHERE id = $3`,
        [newVariantStock, newVariantStock > 0, variantId]
      );
    }

    // 2. Khóa dòng product để cập nhật tổng tồn kho
    const lockedProductResult = await client.query(
      `SELECT id, stock_count FROM products WHERE id = $1 FOR UPDATE`,
      [productId]
    );

    if (!lockedProductResult.rows || lockedProductResult.rows.length === 0) {
      return { success: false, message: 'Không tìm thấy sản phẩm trong database.' };
    }

    const prod = lockedProductResult.rows[0];
    const newProductStock = prod.stock_count + quantityChange;
    if (newProductStock < 0) {
      return { success: false, message: `Tồn kho sản phẩm không đủ.` };
    }

    await client.query(
      `UPDATE products SET stock_count = $1, in_stock = $2, updated_at = NOW() WHERE id = $3`,
      [newProductStock, newProductStock > 0, productId]
    );

    return { success: true };
  } catch (error: any) {
    console.error('adjustStockWithRowLock error:', error);
    return { success: false, message: error.message };
  }
}
