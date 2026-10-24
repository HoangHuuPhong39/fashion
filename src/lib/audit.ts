import fs from 'fs';
import path from 'path';

export interface AdminAuditLogEntry {
  id: string;
  action:
    | 'price_change'
    | 'order_status_update'
    | 'inventory_adjust'
    | 'bank_settings_update'
    | 'review_moderation'
    | 'admin_login'
    | '2fa_enabled'
    | '2fa_disabled';
  entity: 'product' | 'order' | 'inventory' | 'bank_settings' | 'review' | 'user';
  entityId: string;
  performedBy: string; // Tên hoặc ID admin thực hiện
  ipHash?: string;
  details: Record<string, any>;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'admin_audit_logs.json');

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAdminAuditLogs(limit: number = 50): AdminAuditLogEntry[] {
  ensureDirectory();
  try {
    if (!fs.existsSync(AUDIT_LOG_FILE)) return [];
    const raw = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
    const logs: AdminAuditLogEntry[] = JSON.parse(raw);
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}

export function recordAdminAuditLog(entry: Omit<AdminAuditLogEntry, 'id' | 'createdAt'>): AdminAuditLogEntry {
  ensureDirectory();
  const currentLogs = getAdminAuditLogs(500);
  const newEntry: AdminAuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  try {
    fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify([newEntry, ...currentLogs], null, 2), 'utf-8');
  } catch (err) {
    console.error('Lỗi khi ghi nhật ký quản trị (Audit Log):', err);
  }

  return newEntry;
}
