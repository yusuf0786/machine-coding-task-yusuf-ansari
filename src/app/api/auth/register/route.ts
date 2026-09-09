import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, setTokenCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: 'member',
    });

    // Sign JWT
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Create response with user data
    const response = NextResponse.json(
      { user: user.toSafeObject() },
      { status: 201 }
    );

    // Set httpOnly cookie
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json(
        { errors: fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
