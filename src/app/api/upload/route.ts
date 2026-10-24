import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { requireUser, verifyMutationOrigin } from '@/lib/guard';
import { checkRateLimit, recordFailedAttempt } from '@/lib/ratelimit';
import { uploadToObjectStorage } from '@/lib/storage';

function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) return true;

  // WebP: RIFF ... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const originCheck = verifyMutationOrigin(request);
    if (!originCheck.valid && originCheck.errorResponse) {
      return originCheck.errorResponse;
    }

    // 1. BẢO MẬT: Chỉ người dùng đã đăng nhập mới được upload
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const user = authCheck.user;

    // 2. BẢO MẬT: Hạn mức upload theo user (tối đa 20 ảnh trong 1 giờ)
    const quotaKey = `upload:user:${user.id}`;
    const quotaCheck = checkRateLimit(quotaKey, 20, 60 * 60 * 1000);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bạn đã đạt giới hạn tải ảnh lên trong giờ này. Vui lòng thử lại sau ${quotaCheck.retryAfterSeconds || 3600} giây.`
        },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: 'Vui lòng chọn ít nhất một tệp ảnh.' }, { status: 400 });
    }

    // Giới hạn tối đa 5 file mỗi lần gửi
    if (files.length > 5) {
      return NextResponse.json(
        { success: false, message: 'Mỗi lần tải lên tối đa 5 tệp.' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const MAX_INPUT_SIZE = 10 * 1024 * 1024; // 10MB
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_INPUT_SIZE) {
        return NextResponse.json(
          { success: false, message: `Tệp "${file.name}" quá lớn (tối đa 10MB).` },
          { status: 400 }
        );
      }

      const inputBuffer = Buffer.from(await file.arrayBuffer());

      // Kiểm tra Magic Bytes
      if (!isValidImageMagicBytes(inputBuffer)) {
        return NextResponse.json(
          {
            success: false,
            message: `Nội dung tệp "${file.name}" không phải là ảnh hợp lệ (chỉ chấp nhận JPEG, PNG, WEBP).`
          },
          { status: 400 }
        );
      }

      // 3. XỬ LÝ ẢNH BẰNG SHARP:
      // - Chuyển sang định dạng WebP chất lượng cao
      // - Xóa sạch siêu dữ liệu nhạy cảm (GPS, Device info, EXIF metadata)
      // - Giới hạn kích thước tối đa 1600x1600 để tối ưu lưu trữ và băng thông
      const processedBuffer = await sharp(inputBuffer)
        .rotate() // Xoay đúng hướng ảnh theo EXIF trước khi loại bỏ EXIF
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();

      const safeRandom = crypto.randomBytes(8).toString('hex');
      const safeName = `${Date.now()}-${safeRandom}.webp`;

      const publicUrl = await uploadToObjectStorage(safeName, processedBuffer, 'image/webp');
      uploadedUrls.push(publicUrl);
      recordFailedAttempt(quotaKey, 60 * 60 * 1000);
    }

    return NextResponse.json({
      success: true,
      message: `Đã xử lý và lưu an toàn ${uploadedUrls.length} ảnh sang định dạng WebP.`,
      urls: uploadedUrls,
      url: uploadedUrls[0]
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi xử lý ảnh.' }, { status: 500 });
  }
}
