
// src/app/api/auth/login/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // Import the constant

// --- Configuration ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'; // Use environment variables in production!
// const SESSION_COOKIE_NAME = 'auth_session'; // Removed, using imported constant
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

export async function POST(request: NextRequest) {
  console.log('[Auth API Login] Received login request.');
  try {
    const { email, password } = await request.json();

    // --- Basic Validation ---
    if (!email || !password) {
      console.warn('[Auth API Login] Missing email or password in request.');
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    console.log(`[Auth API Login] Attempting login for email: ${email}`); // Log email only for security

    // --- Authentication Check ---
    const credentialsMatch = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    console.log(`[Auth API Login] Credentials match for ${email}: ${credentialsMatch}`);

    if (credentialsMatch) {
      // --- Create Session Token (Simple Example) ---
      // In a real app, use a secure, signed token (e.g., JWT or library like iron-session)
      const sessionData = {
        email: ADMIN_EMAIL,
        isAdmin: true,
        loggedInAt: Date.now(),
      };
      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64'); // **Insecure - for demo only**
      console.log(`[Auth API Login] Generated session token for ${email}.`);

      // --- Set HTTP-Only Cookie ---
      try {
          cookies().set(SESSION_COOKIE_NAME, sessionToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
              maxAge: SESSION_COOKIE_MAX_AGE,
              path: '/',
              sameSite: 'lax', // Recommended for most cases
          });
          console.log(`[Auth API Login] Session cookie set for ${email}.`);
      } catch (cookieError) {
          console.error(`[Auth API Login] Failed to set cookie for ${email}:`, cookieError);
           // Even if cookie fails, maybe return an error? Or proceed but log heavily.
           return NextResponse.json({ message: 'Failed to set session cookie.' }, { status: 500 });
      }


      console.log(`[Auth API Login] User ${email} logged in successfully.`);
      return NextResponse.json({ message: 'Login successful', user: { email: ADMIN_EMAIL, isAdmin: true } });
    } else {
      console.warn(`[Auth API Login] Login failed for email: ${email} - Invalid credentials.`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('[Auth API Login] Unexpected error during login process:', error);
    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid request format. Expected JSON.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'An internal server error occurred during login.' }, { status: 500 });
  }
}

