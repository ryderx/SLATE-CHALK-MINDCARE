
// src/app/api/auth/status/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/lib/types'; // Import the User type
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // Import the constant

// const SESSION_COOKIE_NAME = 'auth_session'; // Removed, using imported constant

// Function to get user from cookie (reuse or place in a shared util if needed elsewhere)
function getUserFromCookie(): User | null {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    // **Insecure - for demo only.** Use proper session validation in production.
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

    // Basic check for expected properties
    if (sessionData && typeof sessionData === 'object' && sessionData.email && sessionData.isAdmin !== undefined) {
      // You might want more validation here (e.g., check loggedInAt timestamp)
      return {
        id: `user-${sessionData.email}`, // Generate a mock ID
        email: sessionData.email,
        isAdmin: sessionData.isAdmin,
      };
    }
    console.warn('[Auth Status API] Invalid session data format found in cookie.');
    return null;
  } catch (error) {
    console.error('[Auth Status API] Error parsing session cookie:', error);
    // Delete potentially corrupted cookie
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = getUserFromCookie();

  if (user) {
    return NextResponse.json({ loggedIn: true, user });
  } else {
    return NextResponse.json({ loggedIn: false, user: null });
  }
}

