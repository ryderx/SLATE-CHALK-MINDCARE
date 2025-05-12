'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createPost as dbCreatePost, updatePost as dbUpdatePost, deletePost as dbDeletePost, getPostBySlug } from '@/lib/blog-data';
import type { PostFormData } from '@/lib/types';

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

export async function createPost(prevState: FormState, formData: FormData): Promise<FormState> {
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
    // Redirecting from server action is tricky with useFormState.
    // It's better to handle redirect on client based on success state.
    // For now, will return success and new slug.
    return { message: `Post "${newPost.title}" created successfully!`, success: true, newSlug: newPost.slug } as FormState & {newSlug: string};
  } catch (error) {
    return { message: 'Failed to create post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }
}

export async function updatePost(slug: string, prevState: FormState, formData: FormData): Promise<FormState> {
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
      return { message: 'Post not found or failed to update.', success: false };
    }
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // old slug
    revalidatePath(`/blog/${updatedPost.slug}`); // new slug if changed
    return { message: `Post "${updatedPost.title}" updated successfully!`, success: true, newSlug: updatedPost.slug } as FormState & {newSlug: string};
  } catch (error) {
    return { message: 'Failed to update post.', success: false, errors: { general: ['An unexpected error occurred.'] } };
  }
}

export async function deletePostAction(slug: string) {
  try {
    const success = await dbDeletePost(slug);
    if (!success) {
      throw new Error('Failed to delete post or post not found.');
    }
    revalidatePath('/blog');
  } catch (error) {
    console.error("Delete post action failed:", error);
    // Here you might want to return an error state to the client
    // For now, we'll let it throw and be caught by an error boundary or just log
    throw error; // Re-throw to be handled by caller or error boundary
  }
  redirect('/blog');
}
