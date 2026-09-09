// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';
import Lead from '@/models/Lead';
import { leadFormSchema } from '@/lib/validations';

function serializeLead(lead: any) {
const { _id, createdBy, assignedTo, ...rest } = lead;

const assignedToUser = assignedTo
? {
id: assignedTo._id?.toString(),
name: assignedTo.name,
email: assignedTo.email,
}
: null;

return {
...rest,
id: _id.toString(),
createdBy: createdBy?._id?.toString() || createdBy?.toString(),
assignedTo: assignedTo?._id?.toString() || assignedTo?.toString() || null,
assignedToUser,
};
}

export async function GET(request: NextRequest) {
try {
const session = await getSessionUser(request);

if (!session) {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}

await connectDB();

const { searchParams } = request.nextUrl;

const search = searchParams.get('search') || '';
const status = searchParams.get('status') || '';
const source = searchParams.get('source') || '';

const sortDir =
  (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';

const page = Math.max(
  1,
  parseInt(searchParams.get('page') || '1', 10)
);

const pageSize = Math.min(
  50,
  Math.max(
    1,
    parseInt(searchParams.get('pageSize') || '8', 10)
  )
);

// Only show leads the user created or is assigned to
const ownershipFilter = {
  $or: [
    { createdBy: session.userId },
    { assignedTo: session.userId },
  ],
};

const filter: Record<string, unknown> = {
  ...ownershipFilter,
};

if (status) {
  filter.status = status;
}

if (source) {
  filter.source = source;
}

if (search) {
  const regex = new RegExp(
    search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i'
  );

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
    .sort({
      createdAt: sortDir === 'asc' ? 1 : -1,
    })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .lean(),
]);

const serializedData = data.map(serializeLead);

return NextResponse.json({
  data: serializedData,
  total,
  page,
  pageSize,
});

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
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}

const body = await request.json();
const parsed = leadFormSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json(
    {
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    },
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

if (!populated) {
  return NextResponse.json(
    { message: 'Lead created but could not be retrieved' },
    { status: 500 }
  );
}

const serializedLead = serializeLead(populated);

return NextResponse.json(serializedLead, {
  status: 201,
});

} catch (error) {
console.error('Create lead error:', error);

return NextResponse.json(
  { message: 'Failed to create lead' },
  { status: 500 }
);

}
}