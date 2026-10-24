import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { getAdminAuditLogs, AdminAuditLogEntry } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const authCheck = requireAdmin(request);
    if (authCheck.errorResponse) return authCheck.errorResponse;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let logs = getAdminAuditLogs(500);

    if (action && action !== 'all') {
      logs = logs.filter((l) => l.action === action);
    }

    if (entity && entity !== 'all') {
      logs = logs.filter((l) => l.entity === entity);
    }

    if (search) {
      logs = logs.filter(
        (l) =>
          l.entityId.toLowerCase().includes(search) ||
          l.performedBy.toLowerCase().includes(search) ||
          JSON.stringify(l.details).toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      logs: logs.slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching admin audit logs:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải nhật ký thao tác quản trị.' },
      { status: 500 }
    );
  }
}
