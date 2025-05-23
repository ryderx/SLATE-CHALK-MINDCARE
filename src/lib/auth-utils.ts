
// src/lib/auth-utils.ts
import { cookies } from 'next/headers';
import type { User } from './types';
import { SESSION_COOKIE_NAME } from '@/lib/constants';

/**
 * Gets the current user session from the request cookies.
 * IMPORTANT: This function is intended for SERVER-SIDE use (Server Components, Route Handlers, Server Actions).
 * It relies on `next/headers` which is not available in client components directly.
 * @returns {User | null} The user object if logged in, otherwise null.
 */
export function getCurrentUserSession(): User | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || typeof sessionCookie.value !== 'string' || sessionCookie.value === '') {
      // console.log('[Auth Utils] Session cookie not found or invalid.'); // Informational, not an error
      return null;
    }

    // Inner try-catch specifically for parsing logic
    try {
      // **Insecure - for demo only.** Use proper session validation in production.
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

      if (sessionData && typeof sessionData === 'object' && sessionData.email && sessionData.isAdmin !== undefined) {
        return {
          id: `user-${sessionData.email}`, // Generate a mock ID
          email: sessionData.email,
          isAdmin: sessionData.isAdmin,
        };
      }
      console.warn('[Auth Utils] Invalid session data format found in cookie after parsing:', sessionData);
      return null;
    } catch (parseError) {
      console.error('[Auth Utils] Error parsing session cookie value. Cookie value (first 20 chars):', sessionCookie.value.substring(0,20) , 'Error:', parseError);
      return null;
    }
  } catch (accessError) {
    // This catches errors from cookies() or cookieStore.get() if they were to throw
    console.error('[Auth Utils] Unexpected error accessing or validating session cookie (e.g., cookies() failed):', accessError);
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
  // await Promise.resolve(); // Not strictly necessary if getCurrentUserSession is sync
  const user = getCurrentUserSession();
  return !!user?.isAdmin;
}
