// src/app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';
import Lead from '@/models/Lead';
import User from '@/models/User';

function getIdString(value: any): string | null {
if (!value) return null;

if (value._id) {
return value._id.toString();
}

return value.toString();
}

function isOwnerOrAssignee(
lead: {
createdBy: any;
assignedTo: any;
},
userId: string
): boolean {
const createdById = getIdString(lead.createdBy);
const assignedToId = getIdString(lead.assignedTo);

return createdById === userId || assignedToId === userId;
}

function serializeLead(lead: any) {
const {
_id,
createdBy,
assignedTo,
...rest
} = lead;

const populatedAssignedTo =
assignedTo && typeof assignedTo === 'object' && assignedTo._id
? assignedTo
: null;

return {
...rest,
id: _id.toString(),
createdBy: getIdString(createdBy),
assignedTo: getIdString(assignedTo),
assignedToUser: populatedAssignedTo
? {
id: populatedAssignedTo._id.toString(),
name: populatedAssignedTo.name,
email: populatedAssignedTo.email,
}
: null,
};
}

export async function GET(
request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
try {
const session = await getSessionUser(request);

if (!session) {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}

const { id } = await params;

if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json(
    { message: 'Invalid lead ID' },
    { status: 400 }
  );
}

await connectDB();

const lead = await Lead.findById(id)
  .populate('assignedTo', 'name email')
  .populate('createdBy', 'name email')
  .lean();

if (!lead) {
  return NextResponse.json(
    { message: 'Lead not found' },
    { status: 404 }
  );
}

if (!isOwnerOrAssignee(lead, session.userId)) {
  return NextResponse.json(
    { message: 'Forbidden' },
    { status: 403 }
  );
}

return NextResponse.json(serializeLead(lead));

} catch (error) {
console.error('Get lead error:', error);

return NextResponse.json(
  { message: 'Internal server error' },
  { status: 500 }
);

}
}

export async function PUT(
request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
try {
const session = await getSessionUser(request);

if (!session) {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}

const { id } = await params;

if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json(
    { message: 'Invalid lead ID' },
    { status: 400 }
  );
}

await connectDB();

const existingLead = await Lead.findById(id);

if (!existingLead) {
  return NextResponse.json(
    { message: 'Lead not found' },
    { status: 404 }
  );
}

if (!isOwnerOrAssignee(existingLead, session.userId)) {
  return NextResponse.json(
    { message: 'Forbidden' },
    { status: 403 }
  );
}

const body = await request.json();
const timeline = [...(existingLead.timeline || [])];

if (body.status && body.status !== existingLead.status) {
  timeline.push({
    date: new Date(),
    label: `Status changed from ${existingLead.status} to ${body.status} by ${session.name}`,
  });
}

if (body.assignedTo !== undefined) {
  const oldAssignedTo = existingLead.assignedTo?.toString();
  const newAssignedTo = body.assignedTo || null;

  if (oldAssignedTo !== newAssignedTo) {
    if (newAssignedTo) {
      const assignedUser = await User.findById(newAssignedTo)
        .select('name');

      if (assignedUser) {
        timeline.push({
          date: new Date(),
          label: `Assigned to ${assignedUser.name} by ${session.name}`,
        });
      }
    } else {
      timeline.push({
        date: new Date(),
        label: `Unassigned by ${session.name}`,
      });
    }
  }
}

const updateData = {
  ...body,
  timeline,
};

const updated = await Lead.findByIdAndUpdate(
  id,
  { $set: updateData },
  {
    new: true,
    runValidators: true,
  }
)
  .populate('assignedTo', 'name email')
  .populate('createdBy', 'name email')
  .lean();

if (!updated) {
  return NextResponse.json(
    { message: 'Lead not found after update' },
    { status: 404 }
  );
}

return NextResponse.json(serializeLead(updated));

} catch (error) {
console.error('Update lead error:', error);

return NextResponse.json(
  { message: 'Failed to update lead' },
  { status: 500 }
);

}
}

export async function DELETE(
request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
try {
const session = await getSessionUser(request);

if (!session) {
  return NextResponse.json(
    { message: 'Unauthorized' },
    { status: 401 }
  );
}

const { id } = await params;

if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json(
    { message: 'Invalid lead ID' },
    { status: 400 }
  );
}

await connectDB();

const lead = await Lead.findById(id);

if (!lead) {
  return NextResponse.json(
    { message: 'Lead not found' },
    { status: 404 }
  );
}

if (lead.createdBy.toString() !== session.userId) {
  return NextResponse.json(
    { message: 'Forbidden' },
    { status: 403 }
  );
}

await Lead.findByIdAndDelete(id);

return NextResponse.json({ success: true });

} catch (error) {
console.error('Delete lead error:', error);

return NextResponse.json(
  { message: 'Failed to delete lead' },
  { status: 500 }
);

}
}