import crypto from 'crypto';

// Bảng mã Base32 RFC 4648
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Sinh khóa bí mật Base32 cho TOTP (20 bytes = 160 bits chuẩn Google Authenticator)
 */
export function generateTotpSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Tính mã TOTP 6 chữ số tại thời điểm cụ thể theo RFC 6238 (HMAC-SHA1)
 */
export function generateTotpCode(secretBase32: string, timeStepWindow: number = 0): string {
  const key = base32Decode(secretBase32);
  const epoch = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / 30) + timeStepWindow;

  // Buffer 8 bytes biểu diễn thời gian big-endian
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(timeStep));

  const hmac = crypto.createHmac('sha1', key);
  hmac.update(timeBuffer);
  const digest = hmac.digest();

  // Dynamic Truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Xác minh mã TOTP với cửa sổ dung sai ±1 bước (±30 giây) chống lệch đồng hồ
 */
export function verifyTotpCode(token: string, secretBase32: string): boolean {
  if (!token || token.length !== 6 || !secretBase32) return false;
  const cleanToken = token.trim();

  for (const window of [0, -1, 1]) {
    const expected = generateTotpCode(secretBase32, window);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }
  return false;
}

/**
 * Sinh 8 mã sao lưu (Backup Codes) 8 chữ số dạng `xxxx-xxxx`
 */
export function generateBackupCodes(): { plainCodes: string[]; hashedCodes: string[] } {
  const plainCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < 8; i++) {
    const raw = crypto.randomBytes(4).toString('hex').toUpperCase();
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plainCodes.push(formatted);

    const hash = crypto.createHash('sha256').update(formatted).digest('hex');
    hashedCodes.push(hash);
  }

  return { plainCodes, hashedCodes };
}

/**
 * Xác minh mã sao lưu (sử dụng 1 lần duy nhất)
 */
export function verifyAndConsumeBackupCode(
  inputCode: string,
  storedHashedCodes: string[]
): { valid: boolean; remainingHashedCodes: string[] } {
  const clean = inputCode.trim().toUpperCase();
  const inputHash = crypto.createHash('sha256').update(clean).digest('hex');

  const idx = storedHashedCodes.findIndex((h) => crypto.timingSafeEqual(Buffer.from(h), Buffer.from(inputHash)));
  if (idx !== -1) {
    const remaining = [...storedHashedCodes];
    remaining.splice(idx, 1);
    return { valid: true, remainingHashedCodes: remaining };
  }

  return { valid: false, remainingHashedCodes: storedHashedCodes };
}
