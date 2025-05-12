
// src/lib/auth-utils.ts
import { cookies } from 'next/headers';
import type { User } from './types';
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // Import the constant

// const SESSION_COOKIE_NAME = 'auth_session'; // Removed, using imported constant

/**
 * Gets the current user session from the request cookies.
 * IMPORTANT: This function is intended for SERVER-SIDE use (Server Components, Route Handlers, Server Actions).
 * It relies on `next/headers` which is not available in client components directly.
 * @returns {User | null} The user object if logged in, otherwise null.
 */
export function getCurrentUserSession(): User | null {
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
     console.warn('[Auth Utils] Invalid session data format found in cookie.');
    return null;
  } catch (error) {
    console.error('[Auth Utils] Error parsing session cookie:', error);
     // Optionally delete corrupted cookie here if needed, though status check might handle it
    // cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }
}

/**
 * Checks if the current user session belongs to an admin.
 * IMPORTANT: This function is intended for SERVER-SIDE use.
 * @returns {Promise<boolean>} True if the user is logged in and is an admin, false otherwise.
 */
export async function isAdminSession(): Promise<boolean> {
  // Simulate potential async operations if needed in the future
  await Promise.resolve();
  const user = getCurrentUserSession();
  return !!user?.isAdmin;
}

