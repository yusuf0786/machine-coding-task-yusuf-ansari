import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const session = await getSessionUser(request);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all users except the current user
    const users = await User.find({
      _id: { $ne: session.userId },
    })
      .select('_id name email')
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      {
        users: users.map((u) => ({
          _id: u._id.toString(),
          name: u.name,
          email: u.email,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
