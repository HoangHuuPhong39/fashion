import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireUser } from '@/lib/guard';

function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

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
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return true;
  }

  // WebP: RIFF ... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return true;
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const authCheck = requireUser(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

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

    // Giới hạn tối đa 5 file mỗi lần tải lên
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

    // KHÔNG cho phép .svg để ngăn ngừa triệt để lỗ hổng Stored XSS
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { success: false, message: `Tệp "${file.name}" vượt quá kích thước cho phép (tối đa 5MB).` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            message: `Định dạng tệp "${file.name}" không được hỗ trợ. Chỉ chấp nhận các định dạng ảnh an toàn: JPG, JPEG, PNG, WEBP, GIF.`
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Kiểm tra Magic Bytes thực tế của tệp
      if (!isValidImageMagicBytes(buffer)) {
        return NextResponse.json(
          {
            success: false,
            message: `Nội dung tệp "${file.name}" không phải là ảnh hợp lệ hoặc đã bị thay đổi.`
          },
          { status: 400 }
        );
      }

      // Tạo tên tệp ngẫu nhiên chống path traversal
      const safeRandom = crypto.randomBytes(8).toString('hex');
      const safeName = `${Date.now()}-${safeRandom}${ext}`;
      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${safeName}`);
    }

    return NextResponse.json({
      success: true,
      message: `Đã tải lên thành công ${uploadedUrls.length} ảnh.`,
      urls: uploadedUrls,
      url: uploadedUrls[0]
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra khi tải ảnh lên.' }, { status: 500 });
  }
}
