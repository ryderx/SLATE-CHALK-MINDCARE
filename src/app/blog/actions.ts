'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createPost as dbCreatePost, updatePost as dbUpdatePost, deletePost as dbDeletePost, getPostBySlug } from '@/lib/blog-data';
import type { PostFormData } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth'; // Import auth check

const postSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }).max(100, { message: 'Title cannot exceed 100 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
});

// Removed newSlug from FormState as redirect will handle navigation
export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    general?: string[];
  };
  success: boolean;
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
    // No need to return success state here, redirect will handle it
  } catch (error) {
    console.error("Create post action failed:", error);
    return { message: 'Failed to create post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }

  // Redirect to the new post page after successful creation and revalidation
  // Need to fetch the created post again to get the slug for redirection
  // This is a slight inefficiency of the pattern but ensures the redirect target exists
  const createdPost = await getPostBySlug(slugify(validatedFields.data.title)); // Use slugify logic consistent with creation
  if (createdPost) {
     redirect(`/blog/${createdPost.slug}`);
  } else {
    // Fallback redirect if somehow the post isn't found immediately after creation
    redirect('/blog');
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

  let updatedPostSlug = slug;
  try {
    const updatedPost = await dbUpdatePost(slug, validatedFields.data);
    if (!updatedPost) {
      return { message: 'Post not found or failed to update.', success: false, errors: { general: ['Could not find the post to update.'] } };
    }
    updatedPostSlug = updatedPost.slug; // Capture the potentially changed slug
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // old slug path
    if (slug !== updatedPost.slug) {
      revalidatePath(`/blog/${updatedPost.slug}`); // new slug path if changed
    }
    // No need to return success state here, redirect handles it
  } catch (error) {
    console.error("Update post action failed:", error);
    return { message: 'Failed to update post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }

  // Redirect after successful update and revalidation
  redirect(`/blog/${updatedPostSlug}`);
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
    revalidatePath(`/blog/${slug}`); // Also revalidate the deleted post's path
     // Redirect happens on the client-side via hook after success (in DeletePostButton)
    return { success: true, message: 'Post deleted successfully.' };
  } catch (error: any) {
    console.error("Delete post action failed:", error);
    return { success: false, message: error.message || 'Failed to delete post.' };
  }
}


// Helper function (ensure it's consistent with the one in blog-data.ts)
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}