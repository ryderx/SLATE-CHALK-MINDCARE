
// src/lib/auth-utils.ts
import { cookies } from 'next/headers';
import type { User } from './types';
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // Import the constant

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
      // Optionally log if the cookie exists but is invalid, but avoid console logs in production helpers generally
      // if (sessionCookie && (typeof sessionCookie.value !== 'string' || sessionCookie.value === '')) {
      //   console.warn('[Auth Utils] Session cookie found but its value is not a non-empty string.');
      // }
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
      // console.warn('[Auth Utils] Invalid session data format found in cookie after parsing.');
      return null;
    } catch (parseError) {
      // console.error('[Auth Utils] Error parsing session cookie value:', parseError);
      return null;
    }
  } catch (accessError) {
    // This catches errors from cookies() or cookieStore.get() if they were to throw
    // console.error('[Auth Utils] Unexpected error accessing or validating session cookie:', accessError);
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
