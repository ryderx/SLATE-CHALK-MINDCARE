'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createPost as dbCreatePost, updatePost as dbUpdatePost, deletePost as dbDeletePost } from '@/lib/blog-data';
import type { PostFormData } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth'; // Import auth check

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
  newSlug?: string; // Keep track of potential new slug for redirects
}

async function checkAdmin(): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized: Admin privileges required.');
  }
}

export async function createPost(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    await checkAdmin(); // Check for admin privileges first
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: ['Unauthorized access.'] } };
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

  try {
    const newPost = await dbCreatePost(validatedFields.data);
    revalidatePath('/blog');
    revalidatePath(`/blog/${newPost.slug}`);
    return { message: `Post "${newPost.title}" created successfully!`, success: true, newSlug: newPost.slug };
  } catch (error) {
    console.error("Create post action failed:", error);
    return { message: 'Failed to create post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }
}

export async function updatePost(slug: string, prevState: FormState, formData: FormData): Promise<FormState> {
 try {
    await checkAdmin(); // Check for admin privileges first
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: ['Unauthorized access.'] } };
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

  try {
    const updatedPost = await dbUpdatePost(slug, validatedFields.data);
    if (!updatedPost) {
      return { message: 'Post not found or failed to update.', success: false, errors: { general: ['Could not find the post to update.'] } };
    }
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // old slug
    revalidatePath(`/blog/${updatedPost.slug}`); // new slug if changed
    return { message: `Post "${updatedPost.title}" updated successfully!`, success: true, newSlug: updatedPost.slug };
  } catch (error) {
    console.error("Update post action failed:", error);
    return { message: 'Failed to update post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }
}

export async function deletePostAction(slug: string): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdmin(); // Check for admin privileges first
  } catch (error: any) {
     console.error("Authorization failed:", error);
     // Don't redirect here, let the component handle the error message
     return { success: false, message: error.message || 'Unauthorized access.' };
  }

  try {
    const success = await dbDeletePost(slug);
    if (!success) {
      throw new Error('Failed to delete post or post not found.');
    }
    revalidatePath('/blog');
     // Redirect happens on the client-side via hook after success
    return { success: true, message: 'Post deleted successfully.' };
  } catch (error: any) {
    console.error("Delete post action failed:", error);
    return { success: false, message: error.message || 'Failed to delete post.' };
  }
  // Note: redirect('/blog') is removed here. It will be handled client-side based on the return value.
}
