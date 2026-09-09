import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, setTokenCookie, comparePassword } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validated = loginSchema.parse(body);

    // Find user by email (explicitly select password)
    const user = await User.findOne({ email: validated.email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(validated.password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
      { status: 200 }
    );

    // Set httpOnly cookie
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json(
        { errors: fieldErrors, message: "Validation failed", },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
