
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
// We don't directly use db functions here anymore, but keep slugify if needed locally
import { slugify } from '@/lib/blog-data';
import type { PostFormData, Post } from '@/lib/types';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

// Ensure NEXT_PUBLIC_APP_URL is set in your .env.local or environment
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

const postSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }).max(100, { message: 'Title cannot exceed 100 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    general?: string[];
  };
  success: boolean;
}

// Helper function to check admin before proceeding with mutation
async function checkAdmin(): Promise<void> {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin privileges required.');
  }
}

// Helper function to handle API fetch responses within actions
async function handleActionApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) { /* ignore */ }
    const errorMessage = errorData?.message || `API Error: ${response.status} ${response.statusText}`;
    console.error("API Action Error:", errorMessage, response.url);
    // Throw a specific error message that the action can catch
    throw new Error(errorMessage);
  }
   if (response.status === 204) { // Handle No Content for delete
     return undefined as T;
   }
  return response.json();
}


export async function createPost(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: [error.message || 'Unauthorized access.'] } };
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  let newPostSlug: string | null = null;
  try {
    // Call the backend API to create the post
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Cookies are typically sent automatically by the browser/fetch in server actions
        },
        body: JSON.stringify(validatedFields.data),
    });

    const createdPost = await handleActionApiResponse<Post>(response);
    newPostSlug = createdPost.slug; // Get the slug from the API response

    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${newPostSlug}`); // Use the slug returned by the API

  } catch (error: any) {
    console.error("Create post action failed:", error);
    return { message: error.message || 'Failed to create post.', success: false, errors: { general: [error.message || 'An unexpected error occurred.'] } };
  }

  // Redirect after successful creation and revalidation
  if (newPostSlug) {
     redirect(`/blog/${newPostSlug}`);
  } else {
     // Fallback if slug wasn't obtained, though handleActionApiResponse should throw
     console.error("Failed to get new post slug after creation.");
     redirect('/blog');
  }
}

export async function updatePost(slug: string, prevState: FormState, formData: FormData): Promise<FormState> {
 try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: [error.message || 'Unauthorized access.'] } };
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  let updatedPostSlug = slug; // Keep track of the slug, potentially updated by API
  try {
    // Call the backend API to update the post
     const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
             // Cookies are typically sent automatically
        },
        body: JSON.stringify(validatedFields.data),
    });

    const updatedPost = await handleActionApiResponse<Post>(response);
    updatedPostSlug = updatedPost.slug; // Use the slug returned by the API

    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // old slug path
    if (slug !== updatedPost.slug) {
      revalidatePath(`/blog/${updatedPost.slug}`); // new slug path if changed
    }

  } catch (error: any) {
    console.error("Update post action failed:", error);
     // Handle 404 specifically
     if (error.message.includes('404') || error.message.includes('not found')) {
       return { message: 'Post not found or failed to update.', success: false, errors: { general: ['Could not find the post to update.'] } };
     }
    return { message: error.message || 'Failed to update post.', success: false, errors: { general: [error.message || 'An unexpected error occurred.'] } };
  }

  // Redirect after successful update and revalidation
  redirect(`/blog/${updatedPostSlug}`);
}

export async function deletePostAction(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdmin();
  } catch (error: any) {
     console.error("Authorization failed for delete action:", error);
     return { success: false, message: error.message || 'Unauthorized access.' };
  }

  try {
     // Call the backend API to delete the post
    const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: {
             // Cookies are typically sent automatically
        },
    });

    // handleActionApiResponse handles non-OK status codes
    await handleActionApiResponse(response);

    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // Revalidate the deleted post's path

    // Let the client-side handle redirect after success signal
    return { success: true, message: 'Post deleted successfully.' };
  } catch (error: any) {
    console.error("Delete post action failed:", error);
    // Handle 404 specifically from the API
     if (error.message.includes('404') || error.message.includes('not found')) {
        return { success: false, message: 'Post not found or already deleted.' };
     }
    return { success: false, message: error.message || 'Failed to delete post.' };
  }
}

// Keep slugify here if needed for any reason, though API should handle it mostly
// function slugify(text: string): string { ... }
