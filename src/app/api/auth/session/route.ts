
// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUserSession } from '@/lib/auth-utils';
import type { User } from '@/lib/types';

export async function GET() {
  try {
    const user: User | null = getCurrentUserSession(); // This can use cookies() as it's an API route
    if (user) {
      return NextResponse.json({ isLoggedIn: true, isAdmin: user.isAdmin, email: user.email });
    }
    return NextResponse.json({ isLoggedIn: false, isAdmin: false });
  } catch (error) {
    console.error('[API Auth Session] Critical error in GET /api/auth/session handler:', error);
    // In case of an error, assume logged out for safety
    return NextResponse.json({ message: 'Failed to fetch session status due to server error.', isLoggedIn: false, isAdmin: false }, { status: 500 });
  }
}
