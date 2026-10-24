import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

/**
 * Quản lý lưu trữ tệp tin trên Object Storage (Vercel Blob / Cloudinary)
 * với fallback an toàn cục bộ.
 * Giữ nguyên hợp đồng URL công khai để giao diện không bị ảnh hưởng.
 */
export async function uploadToObjectStorage(
  fileName: string,
  buffer: Buffer,
  contentType = 'image/webp'
): Promise<string> {
  // 1. Kiểm tra cấu hình Vercel Blob
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const blob = await put(`uploads/${fileName}`, buffer, {
        access: 'public',
        token: blobToken,
        contentType
      });
      return blob.url;
    } catch (err) {
      console.error('Failed to upload to Vercel Blob, falling back to local:', err);
    }
  }

  // 2. Fallback lưu cục bộ (Local / Self-hosted / Dev)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}
