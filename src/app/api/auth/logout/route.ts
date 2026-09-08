import { NextRequest, NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logged out' },
    { status: 200 }
  );

  clearTokenCookie(response);

  return response;
}
