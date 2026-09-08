import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from './env';

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface Session extends AuthPayload {
  iat: number;
  exp: number;
}

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME = 'crm_token';
const TOKEN_EXPIRY = '7d'; // 7 days
const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Hash a plain text password using bcryptjs
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Sign a JWT token with the given payload
 */
export async function signToken(payload: AuthPayload): Promise<string> {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a JWT token and return the session payload
 * Returns null if the token is invalid or expired
 */
export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as Session;
  } catch {
    // Token is invalid, expired, or malformed
    return null;
  }
}

/**
 * Set the JWT token as an httpOnly cookie on the response
 */
export function setTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY_SECONDS,
    path: '/',
  });
}

/**
 * Clear the JWT token cookie
 */
export function clearTokenCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Get the session user from request or cookie store
 * Supports both Route Handlers (passing NextRequest/Request) and Server Components
 */
export async function getSessionUser(request?: NextRequest | Request): Promise<Session | null> {
  let token: string | undefined;

  if (request && 'cookies' in request && typeof (request as NextRequest).cookies?.get === 'function') {
    token = (request as NextRequest).cookies.get(COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  if (!token) {
    return null;
  }

  return verifyToken(token);
}
