
// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'auth_session';

export async function POST() {
  try {
    // --- Delete the Session Cookie ---
    cookies().delete(SESSION_COOKIE_NAME);

    console.log('[Auth API] User logged out successfully.');
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('[Auth API] Logout error:', error);
    return NextResponse.json({ message: 'An internal server error occurred during logout.' }, { status: 500 });
  }
}
