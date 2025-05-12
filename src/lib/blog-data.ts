
// src/lib/blog-data.ts
// Functions used by the FRONTEND (Server Components, Client Components via hooks/actions)
// to interact with the blog post API.

import type { Post, PostFormData } from './types';

// Ensure NEXT_PUBLIC_APP_URL is set in your .env.local or environment
// Default to localhost for development if not set
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore error if response body is not JSON
    }
    const errorMessage = errorData?.message || `API request failed with status ${response.status}`;
    console.error("API Error:", errorMessage, "URL:", response.url);
    throw new Error(errorMessage);
  }
  // Need to handle potential "204 No Content" for delete
  if (response.status === 204) {
     return undefined as T; // Or handle appropriately based on expected return type
  }
  return response.json();
}


// --- Frontend Data Fetching Functions ---

export async function getPosts(): Promise<Post[]> {
  console.log('[Frontend Blog Data] Fetching posts from API...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
       cache: 'no-store', // Ensure fresh data, especially important after mutations
       headers: {
        'Accept': 'application/json',
       }
    });
    const posts = await handleResponse<Post[]>(response);
     // Ensure dates are parsed correctly if they come as strings
    return posts.map(post => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
    }));
  } catch (error) {
    console.error('[Frontend Blog Data] Error fetching posts:', error);
    // Decide how to handle errors - maybe return empty array or re-throw
    return []; // Return empty array on error for graceful UI handling
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  console.log(`[Frontend Blog Data] Fetching post with slug: ${slug} from API...`);
   if (!slug) {
        console.error('[Frontend Blog Data] Attempted to fetch post with empty slug.');
        return undefined;
    }
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
        cache: 'no-store', // Ensure fresh data for individual posts too
         headers: {
            'Accept': 'application/json',
        }
    });
    if (response.status === 404) {
        console.log(`[Frontend Blog Data] Post with slug ${slug} not found (404).`);
        return undefined;
    }
    const post = await handleResponse<Post>(response);
    // Ensure dates are parsed
     return post ? {
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
    } : undefined;
  } catch (error) {
    // Catch errors from handleResponse or network errors
    console.error(`[Frontend Blog Data] Error fetching post by slug ${slug}:`, error);
    if (error instanceof Error && error.message.includes('404')) {
         return undefined; // Treat 404 specifically as not found
    }
    // For other errors, maybe return undefined or re-throw based on desired behavior
    return undefined;
  }
}

// Note: createPost, updatePost, deletePost actions are now primarily handled in `app/blog/actions.ts`
// which will internally call the respective API routes.
// We keep the slugify helper here if actions.ts needs it.

// Helper function (ensure it's consistent with the one in blog-data-api.ts)
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

// You might not need findUniqueSlug on the frontend anymore,
// as the backend API should handle slug uniqueness on creation/update.

// Example of how an action might call the API (this logic belongs in actions.ts)
/*
export async function createPostAction(data: PostFormData): Promise<Post> {
    const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include credentials/cookies automatically if needed
        },
        body: JSON.stringify(data),
    });
    return handleResponse<Post>(response);
}
*/
