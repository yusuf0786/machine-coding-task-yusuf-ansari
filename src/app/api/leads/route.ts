// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createLead } from '@/lib/mongo';
import { sleep, randomDelay } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await sleep(randomDelay());

  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const source = searchParams.get('source') || undefined;
  const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);

  const result = await getLeads({ search, status, source, sortDir, page, pageSize });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  await sleep(randomDelay());

  try {
    const body = await request.json();
    const lead = await createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
