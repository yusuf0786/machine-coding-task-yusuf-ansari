// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';
import Lead from '@/models/Lead';
import { leadFormSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const source = searchParams.get('source') || '';
    const sortDir = (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '8', 10)));

    // Only show leads the user created or is assigned to
    const ownershipFilter = {
      $or: [
        { createdBy: session.userId },
        { assignedTo: session.userId },
      ],
    };

    const filter: Record<string, unknown> = { ...ownershipFilter };

    if (status) {
      filter.status = status;
    }
    if (source) {
      filter.source = source;
    }
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$and = [
        {
          $or: [
            { name: regex },
            { email: regex },
            { company: regex },
          ],
        },
      ];
    }

    const [total, data] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: sortDir === 'asc' ? 1 : -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .lean(),
    ]);

    // Transform data to ensure proper serialization
    const serializedData = data.map((lead) => ({
      ...lead,
      _id: lead._id.toString(),
      createdBy: lead.createdBy?._id?.toString() || lead.createdBy?.toString(),
      assignedTo: lead.assignedTo?._id?.toString() || lead.assignedTo?.toString() || null,
      assignedToUser: lead.assignedTo
        ? {
            _id: (lead.assignedTo as any)._id.toString(),
            name: (lead.assignedTo as any).name,
            email: (lead.assignedTo as any).email,
          }
        : null,
    }));

    return NextResponse.json({ data: serializedData, total, page, pageSize });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = leadFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectDB();

    const leadData = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      status: parsed.data.status,
      source: parsed.data.source,
      createdBy: session.userId,
      assignedTo: parsed.data.assignedTo || null,
      timeline: [
        {
          date: new Date(),
          label: `Lead created by ${session.name}`,
        },
      ],
    };

    const lead = await Lead.create(leadData);
    const populated = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .lean();

    const serializedLead = {
      ...populated,
      _id: populated!._id.toString(),
      createdBy: populated!.createdBy?._id?.toString() || populated!.createdBy?.toString(),
      assignedTo: populated!.assignedTo?._id?.toString() || populated!.assignedTo?.toString() || null,
      assignedToUser: populated!.assignedTo
        ? {
            _id: (populated!.assignedTo as any)._id.toString(),
            name: (populated!.assignedTo as any).name,
            email: (populated!.assignedTo as any).email,
          }
        : null,
    };

    return NextResponse.json(serializedLead, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
