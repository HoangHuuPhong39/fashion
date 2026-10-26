import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/guard';

export async function GET(request: Request) {
  try {
    const user = getSessionUser(request);

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
