import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export interface StoredUser extends User {
  passwordHash: string;
}

export interface Session {
  tokenHash: string;
  userId: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
}

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

interface CacheEntry<T> {
  data: T;
  mtimeMs: number;
}
const authMemoryCache = new Map<string, CacheEntry<unknown>>();

function readJSON<T>(filePath: string, defaultData: T): T {
  ensureDirectory();
  if (!fs.existsSync(filePath)) {
    writeJSON(filePath, defaultData);
    return defaultData;
  }
  try {
    const stats = fs.statSync(filePath);
    const cached = authMemoryCache.get(filePath);
    if (cached && cached.mtimeMs === stats.mtimeMs) {
      return cached.data as T;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    authMemoryCache.set(filePath, { data: parsed, mtimeMs: stats.mtimeMs });
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filePath}`, err);
    return defaultData;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  ensureDirectory();
  const tmpFile = `${filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, filePath);
    try {
      const stats = fs.statSync(filePath);
      authMemoryCache.set(filePath, { data, mtimeMs: stats.mtimeMs });
    } catch {}
  } catch (err) {
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
    console.error(`Error writing to ${filePath}`, err);
  }
}

// ===== BĂM MẬT KHẨU & TIỆN ÍCH CRYPTO =====

export function hashPassword(plain: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

export function verifyPassword(plain: string, hash: string): boolean {
  if (!plain || !hash) return false;
  return bcrypt.compareSync(plain, hash);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ===== QUẢN LÝ TÀI KHOẢN & SEED ADMIN ĐẦU TIÊN =====

function getInitialUsers(): StoredUser[] {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@tada.vn').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@2026!';

  return [
    {
      id: 'usr-admin',
      name: 'Nguyễn Quản Trị',
      email: adminEmail,
      phone: '0909999999',
      role: 'admin',
      passwordHash: hashPassword(adminPassword),
      membershipTier: 'diamond',
      totalSpent: 45000000,
      points: 88888,
      isVip: true,
      avatar: '/images/avatar-default.jpg',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      bankInfo: {
        bankName: 'MBBank',
        accountNumber: '0366861159',
        accountHolder: 'HOANG HUU PHONG',
        branch: 'Chi nhánh TP. Hồ Chí Minh',
        hotline: '0366861159'
      },
      addresses: []
    }
  ];
}

// Migration chạy một lần: quét data/users.json, băm password -> passwordHash, xóa password plaintext
export function migrateUserPasswords(): void {
  ensureDirectory();
  if (!fs.existsSync(USERS_FILE)) {
    writeJSON(USERS_FILE, getInitialUsers());
    return;
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    let hasChanges = false;

    // Lọc bỏ các tài khoản demo cũ nếu có theo yêu cầu
    const demoEmails = ['hoangyen@tada.vn', 'minhanh@tada.vn'];
    const filteredUsers = Array.isArray(users)
      ? users.filter((u: any) => !demoEmails.includes(u.email?.toLowerCase()))
      : [];

    if (filteredUsers.length !== users.length) {
      hasChanges = true;
    }

    const migrated = filteredUsers.map((u: any) => {
      const clone = { ...u };
      if (clone.password && typeof clone.password === 'string') {
        if (!clone.passwordHash) {
          clone.passwordHash = hashPassword(clone.password);
        }
        delete clone.password;
        hasChanges = true;
      }
      return clone;
    });

    if (hasChanges) {
      writeJSON(USERS_FILE, migrated);
      console.log('✅ Migrated user passwords to bcrypt hashes and removed plaintext.');
    }
  } catch (err) {
    console.error('Failed to run password migration on users.json', err);
  }
}

// Tự động kiểm tra và di chuyển khi module được load
try {
  migrateUserPasswords();
} catch {}

export function getAllUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(USERS_FILE, getInitialUsers());
}

export function saveAllUsers(users: StoredUser[]): void {
  writeJSON(USERS_FILE, users);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.id === id);
}

export function createUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}): StoredUser {
  const users = getAllUsers();
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    phone: userData.phone.trim(),
    role: userData.role || 'customer',
    passwordHash: hashPassword(userData.password),
    membershipTier: 'bronze',
    totalSpent: 0,
    points: 2000,
    isVip: false,
    addresses: []
  };

  saveAllUsers([newUser, ...users]);
  return newUser;
}

export function updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  users[idx] = {
    ...users[idx],
    ...updates,
    id // Bảo vệ id không bao giờ bị ghi đè
  };
  saveAllUsers(users);
  return users[idx];
}

// ===== QUẢN LÝ PHIÊN LÀM VIỆC (SESSIONS) VỚI SHA-256 HASH =====

export function getAllSessions(): Session[] {
  return readJSON<Session[]>(SESSIONS_FILE, []);
}

export function saveAllSessions(sessions: Session[]): void {
  writeJSON(SESSIONS_FILE, sessions);
}

export function createServerSession(user: StoredUser): { rawToken: string; session: Session } {
  const sessions = getAllSessions();
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(); // 30 ngày

  const newSession: Session = {
    tokenHash,
    userId: user.id,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt
  };

  // Giữ tối đa 100 session còn hạn
  const updated = [newSession, ...sessions.filter((s) => new Date(s.expiresAt).getTime() > Date.now())].slice(0, 100);
  saveAllSessions(updated);
  return { rawToken, session: newSession };
}

export function deleteServerSession(rawToken: string): void {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  const sessions = getAllSessions();
  saveAllSessions(sessions.filter((s) => s.tokenHash !== tokenHash));
}

export function verifySessionToken(rawToken?: string | null): { valid: boolean; user?: User } {
  if (!rawToken) return { valid: false };

  const tokenHash = hashToken(rawToken);
  const sessions = getAllSessions();
  const session = sessions.find((s) => s.tokenHash === tokenHash);
  if (!session) return { valid: false };

  // Kiểm tra hạn phiên
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    deleteServerSession(rawToken);
    return { valid: false };
  }

  const user = findUserById(session.userId);
  if (!user) return { valid: false };

  // Đảm bảo không bao giờ trả về passwordHash cho client
  const { passwordHash: _, ...safeUser } = user;
  return { valid: true, user: safeUser };
}

// ===== BỘ GIỚI HẠN TẦN SUẤT TRUY CẬP (RATE LIMITING) IN-MEMORY =====

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, remaining: maxAttempts };
  }

  if (entry.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: maxAttempts - entry.attempts };
}

export function recordFailedAttempt(key: string, windowMs = 15 * 60 * 1000): void {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { attempts: 1, resetAt: now + windowMs });
  } else {
    entry.attempts += 1;
  }
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
