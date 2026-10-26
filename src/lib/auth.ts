import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types';
import {
  getTrustedClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  hashIp
} from './ratelimit';
import { verifyAndConsumeBackupCode } from './totp';

export { getTrustedClientIp, checkRateLimit, recordFailedAttempt, resetRateLimit, hashIp };
// Legacy alias
export const getClientIp = getTrustedClientIp;

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export interface StoredUser extends User {
  passwordHash: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
}

export interface Session {
  tokenHash: string;
  userId: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
}

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

interface CacheEntry<T> {
  data: T;
  mtimeMs: number;
}
const authMemoryCache = new Map<string, CacheEntry<unknown>>();

function readJSON<T>(filePath: string, defaultData: T): T {
  const cached = authMemoryCache.get(filePath);
  if (fs.existsSync(filePath)) {
    try {
      const stats = fs.statSync(filePath);
      if (cached && cached.mtimeMs === stats.mtimeMs) {
        return cached.data as T;
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as T;
      authMemoryCache.set(filePath, { data: parsed, mtimeMs: stats.mtimeMs });
      return parsed;
    } catch {
      if (cached) return cached.data as T;
    }
  }

  if (cached) return cached.data as T;

  authMemoryCache.set(filePath, { data: defaultData, mtimeMs: Date.now() });
  return defaultData;
}

function writeJSON<T>(filePath: string, data: T): void {
  authMemoryCache.set(filePath, { data, mtimeMs: Date.now() });
  try {
    ensureDirectory();
    const tmpFile = `${filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, filePath);
  } catch {
    // Hỗ trợ môi trường Serverless (Netlify / Vercel) có hệ thống tệp read-only
  }
}

// ===== BĂM MẬT KHẨU & TIỆN ÍCH CRYPTO CHỐNG TIMING ATTACK =====

const DUMMY_BCRYPT_HASH = '$2a$10$wE99q0/jV/C34m6k6lG9qOKz9p39mQv5hG6Z8zQ7J.M4wD5wN3x6e';

export function hashPassword(plain: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

/**
 * Luôn chạy bcrypt compare kể cả khi user không tồn tại để chống tấn công dò thời gian (Timing Attack)
 */
export function verifyPassword(plain: string, hash?: string): boolean {
  if (!plain) return false;
  if (!hash) {
    bcrypt.compareSync(plain, DUMMY_BCRYPT_HASH);
    return false;
  }
  return bcrypt.compareSync(plain, hash);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ===== QUẢN LÝ TÀI KHOẢN & SEED ADMIN =====

function getInitialUsers(): StoredUser[] {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@tada.vn').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@2026!';

  return [
    {
      id: 'usr-admin',
      name: 'Quản Trị Viên TADA!',
      email: adminEmail,
      phone: process.env.NEXT_PUBLIC_HOTLINE || '0366861159',
      role: 'admin',
      passwordHash: hashPassword(adminPassword),
      membershipTier: 'diamond',
      totalSpent: 0,
      points: 0,
      isVip: true,
      avatar: '/images/avatar-default.jpg',
      coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
      addresses: []
    }
  ];
}

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

export function updateUserPassword(userIdOrEmail: string, newPassword: string): boolean {
  const users = getAllUsers();
  const lower = userIdOrEmail.toLowerCase().trim();
  const target = users.find((u) => u.id === userIdOrEmail || u.email.toLowerCase() === lower);
  if (!target) return false;
  target.passwordHash = hashPassword(newPassword);
  saveAllUsers(users);
  return true;
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
    points: 0,
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

// ===== QUẢN LÝ PHIÊN LÀM VIỆC (SESSIONS) =====

export function getAllSessions(): Session[] {
  return readJSON<Session[]>(SESSIONS_FILE, []);
}

export function saveAllSessions(sessions: Session[]): void {
  writeJSON(SESSIONS_FILE, sessions);
}

/**
 * Tạo phiên làm việc mới:
 * Bỏ giới hạn 100 phiên toàn hệ thống.
 * Giới hạn tối đa 5 phiên đang hoạt động CHO TỪNG USER.
 */
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

  const now = Date.now();
  const validSessions = sessions.filter((s) => new Date(s.expiresAt).getTime() > now);
  const otherUsersSessions = validSessions.filter((s) => s.userId !== user.id);
  const thisUserSessions = [newSession, ...validSessions.filter((s) => s.userId === user.id)].slice(0, 5);

  saveAllSessions([...thisUserSessions, ...otherUsersSessions]);
  return { rawToken, session: newSession };
}

export function deleteServerSession(rawToken: string): void {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  const sessions = getAllSessions();
  saveAllSessions(sessions.filter((s) => s.tokenHash !== tokenHash));
}

/**
 * Thu hồi tất cả các phiên làm việc của người dùng (khi đặt lại mật khẩu hoặc tài khoản bị khóa)
 */
export function revokeAllUserSessions(userId: string): void {
  const sessions = getAllSessions();
  const retained = sessions.filter((s) => s.userId !== userId);
  saveAllSessions(retained);
}

/**
 * Thu hồi tất cả các phiên làm việc khác của người dùng (khi đổi mật khẩu)
 */
export function revokeOtherUserSessions(userId: string, currentToken?: string | null): void {
  const currentHash = currentToken ? hashToken(currentToken) : null;
  const sessions = getAllSessions();
  const retained = sessions.filter((s) => s.userId !== userId || (currentHash && s.tokenHash === currentHash));
  saveAllSessions(retained);
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

// ===== 2FA (XÁC THỰC HAI LỚP TOTP CHO ADMIN) =====

export function enableUserTwoFactor(
  userId: string,
  secret: string,
  hashedBackupCodes: string[]
): boolean {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  user.twoFactorEnabled = true;
  user.twoFactorSecret = secret;
  user.twoFactorBackupCodes = hashedBackupCodes;
  saveAllUsers(users);
  return true;
}

export function disableUserTwoFactor(userId: string): boolean {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.twoFactorBackupCodes = undefined;
  saveAllUsers(users);
  return true;
}

export function consumeUserBackupCode(userId: string, inputCode: string): boolean {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user || !user.twoFactorBackupCodes || user.twoFactorBackupCodes.length === 0) return false;

  const { valid, remainingHashedCodes } = verifyAndConsumeBackupCode(inputCode, user.twoFactorBackupCodes);
  if (valid) {
    user.twoFactorBackupCodes = remainingHashedCodes;
    saveAllUsers(users);
    return true;
  }
  return false;
}

