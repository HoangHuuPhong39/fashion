import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const RATELIMIT_FILE = path.join(DATA_DIR, 'rate_limits.json');

// In-memory cache synced with disk
const memoryStore = new Map<string, RateLimitEntry>();
let isLoaded = false;

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore() {
  if (isLoaded) return;
  ensureDirectory();
  try {
    if (fs.existsSync(RATELIMIT_FILE)) {
      const raw = fs.readFileSync(RATELIMIT_FILE, 'utf-8');
      const data = JSON.parse(raw) as Record<string, RateLimitEntry>;
      const now = Date.now();
      for (const [k, v] of Object.entries(data)) {
        if (v && v.resetAt > now) {
          memoryStore.set(k, v);
        }
      }
    }
  } catch {}
  isLoaded = true;
}

function persistStore() {
  ensureDirectory();
  const obj: Record<string, RateLimitEntry> = {};
  const now = Date.now();
  for (const [k, v] of memoryStore.entries()) {
    if (v && v.resetAt > now) {
      obj[k] = v;
    }
  }
  const tmp = `${RATELIMIT_FILE}.${Date.now()}.${crypto.randomBytes(3).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf-8');
    fs.renameSync(tmp, RATELIMIT_FILE);
  } catch {
    try { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch {}
  }
}

/**
 * Trích xuất IP khách hàng từ các header tin cậy của nền tảng (Vercel, Cloudflare)
 * Ngăn chặn tuyệt đối việc attacker tự gửi header X-Forwarded-For giả mạo để bypass rate limit
 */
export const getClientIp = (request: Request) => getTrustedClientIp(request);

export function getTrustedClientIp(request: Request): string {
  // 1. Vercel trusted header
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp.split(',')[0].trim();
  }

  // 2. Cloudflare trusted header
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  // 3. X-Real-IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // 4. Nếu ở localhost / development
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd && process.env.NODE_ENV !== 'production') {
    return fwd.split(',')[0].trim();
  }

  return '127.0.0.1';
}

/**
 * Băm IP bằng HMAC SHA-256 với secret key để bảo vệ quyền riêng tư người dùng
 * Không bao giờ lưu IP thô vào cơ sở dữ liệu
 */
export function hashIp(rawIp: string): string {
  const secret = process.env.IP_HASH_SECRET || process.env.ADMIN_INITIAL_PASSWORD || 'tada-ip-salt-default-key-2026';
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex').slice(0, 16);
}

/**
 * Kiểm tra Rate Limit theo key dùng chung
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  loadStore();
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, remaining: maxAttempts };
  }

  if (entry.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: maxAttempts - entry.attempts };
}

/**
 * Ghi nhận một lần thử thất bại
 */
export function recordFailedAttempt(key: string, windowMs = 15 * 60 * 1000): void {
  loadStore();
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { attempts: 1, resetAt: now + windowMs });
  } else {
    entry.attempts += 1;
  }
  persistStore();
}

/**
 * Reset rate limit khi đăng nhập/thao tác thành công
 */
export function resetRateLimit(key: string): void {
  loadStore();
  if (memoryStore.has(key)) {
    memoryStore.delete(key);
    persistStore();
  }
}
