
// src/app/api/auth/login/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// --- Configuration ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'; // Use environment variables in production!
const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // --- Basic Validation ---
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // --- Authentication Check ---
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // --- Create Session Token (Simple Example) ---
      // In a real app, use a secure, signed token (e.g., JWT or library like iron-session)
      const sessionData = {
        email: ADMIN_EMAIL,
        isAdmin: true,
        loggedInAt: Date.now(),
      };
      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64'); // **Insecure - for demo only**

      // --- Set HTTP-Only Cookie ---
      cookies().set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: SESSION_COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'lax', // Recommended for most cases
      });

      console.log(`[Auth API] User ${email} logged in successfully.`);
      return NextResponse.json({ message: 'Login successful', user: { email: ADMIN_EMAIL, isAdmin: true } });
    } else {
      console.warn(`[Auth API] Login failed for email: ${email}`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('[Auth API] Login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred during login.' }, { status: 500 });
  }
}
