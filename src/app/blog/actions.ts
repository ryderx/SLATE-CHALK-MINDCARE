
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import fs from 'fs/promises'; // Import Node.js file system module
import path from 'path'; // Import Node.js path module
import { cookies } from 'next/headers'; // Import cookies
import { slugify } from '@/lib/blog-data'; // Keep slugify if needed
import type { PostFormData, Post } from '@/lib/types';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check
import { SESSION_COOKIE_NAME } from '@/lib/constants'; // Import session cookie name

// Ensure NEXT_PUBLIC_APP_URL is set in your .env.local or environment
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads/blog');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Ensure the uploads directory exists
async function ensureUploadsDirExists() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    // Directory does not exist, create it
    console.log(`Uploads directory ${UPLOADS_DIR} not found, creating...`);
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Updated schema to include optional image validation
const postSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }).max(100, { message: 'Title cannot exceed 100 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
  image: z
    .instanceof(File, { message: 'Image is required.' })
    .optional() // Make the file itself optional in the schema
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      file => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .gif and .webp formats are supported."
    ),
});

export type FormState = {
  message: string;
  errors?: {
    title?: string[];
    content?: string[];
    image?: string[]; // Add image errors
    general?: string[];
  };
  success: boolean;
}

// Helper function to get session cookie for fetch requests
function getAuthHeaders(): HeadersInit {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (sessionCookie) {
        headers['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
    }
    return headers;
}


// Helper function to check admin before proceeding with mutation
async function checkAdmin(): Promise<void> {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin privileges required.');
  }
}

// Helper function to handle image saving
async function saveImage(imageFile: File): Promise<string | null> {
  try {
    await ensureUploadsDirExists(); // Make sure the directory exists

    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    // Create a unique filename to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(imageFile.name);
    const filename = `${slugify(path.basename(imageFile.name, fileExtension))}-${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await fs.writeFile(filePath, fileBuffer);
    console.log(`[Blog Action] Image saved successfully: ${filePath}`);

    // Return the public URL path
    const publicUrl = `/uploads/blog/${filename}`;
    return publicUrl;
  } catch (error) {
    console.error('[Blog Action] Failed to save image:', error);
    return null; // Indicate failure
  }
}

// Helper function to delete an image file
async function deleteImageFile(imageUrl?: string): Promise<void> {
  if (!imageUrl || !imageUrl.startsWith('/uploads/blog/')) {
      return; // Not a managed file or no image URL
  }
  try {
      const filename = path.basename(imageUrl);
      const filePath = path.join(UPLOADS_DIR, filename);
      await fs.unlink(filePath);
      console.log(`[Blog Action] Deleted old image file: ${filePath}`);
  } catch (error: any) {
      // Log error but don't stop the action if deletion fails (e.g., file already gone)
       if (error.code !== 'ENOENT') { // Ignore 'file not found' errors
            console.error(`[Blog Action] Error deleting image file ${imageUrl}:`, error);
       }
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

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    image: formData.get('image') instanceof File && (formData.get('image') as File).size > 0 ? formData.get('image') : undefined, // Only include if file exists
  };

  const validatedFields = postSchema.safeParse(rawData);


  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  let imageUrl: string | undefined = undefined;
  if (validatedFields.data.image) {
    const savedUrl = await saveImage(validatedFields.data.image);
    if (!savedUrl) {
      return { message: 'Failed to save image.', success: false, errors: { image: ['Could not save the uploaded image.'] } };
    }
    imageUrl = savedUrl;
  }

  let newPostSlug: string | null = null;
  try {
    // Prepare data for the API (without the File object)
    const apiData = {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
      imageUrl: imageUrl, // Send the URL to the API
    };
    
    const authHeaders = getAuthHeaders();

    // Call the backend API to create the post
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(apiData),
    });

    const createdPost = await handleActionApiResponse<Post>(response);
    newPostSlug = createdPost.slug; // Get the slug from the API response

    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${newPostSlug}`); // Use the slug returned by the API
    revalidatePath('/admin/posts'); // Revalidate admin posts page

  } catch (error: any) {
    console.error("Create post action failed:", error);
     // Clean up uploaded image if API call failed
     if (imageUrl) {
       await deleteImageFile(imageUrl);
     }
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

  const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      image: formData.get('image') instanceof File && (formData.get('image') as File).size > 0 ? formData.get('image') : undefined,
  };

  const validatedFields = postSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  let updatedPostSlug = slug; // Keep track of the slug, potentially updated by API
  let finalImageUrl: string | undefined = undefined;
  let originalPost: Post | undefined;
  const authHeaders = getAuthHeaders();

  try {
      // Fetch original post to get existing imageUrl and check for title changes
      const originalPostResponse = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, { headers: authHeaders });
      if (!originalPostResponse.ok) {
          if (originalPostResponse.status === 404) {
            throw new Error('Post not found.');
          }
          throw new Error(`Failed to fetch original post: ${originalPostResponse.statusText}`);
      }
      originalPost = await originalPostResponse.json();
      finalImageUrl = originalPost?.imageUrl; // Start with existing image URL

      // Handle image update
      if (validatedFields.data.image) {
        const newImageUrl = await saveImage(validatedFields.data.image);
        if (!newImageUrl) {
          return { message: 'Failed to save updated image.', success: false, errors: { image: ['Could not save the uploaded image.'] } };
        }
        // Delete the old image *after* successfully saving the new one
        if (finalImageUrl) {
             await deleteImageFile(finalImageUrl);
        }
        finalImageUrl = newImageUrl; // Update to the new image URL
      }
      // Note: If no new image is uploaded, finalImageUrl retains the original value


    // Prepare data for the API (without the File object)
    const apiData = {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
        imageUrl: finalImageUrl, // Send the final URL (new or existing)
    };

    // Call the backend API to update the post
     const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(apiData),
    });

    const updatedPost = await handleActionApiResponse<Post>(response);
    updatedPostSlug = updatedPost.slug; // Use the slug returned by the API

    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // old slug path
    if (slug !== updatedPost.slug) {
      revalidatePath(`/blog/${updatedPost.slug}`); // new slug path if changed
    }
     revalidatePath('/admin/posts'); // Revalidate admin posts page

  } catch (error: any) {
    console.error("Update post action failed:", error);
     // Clean up newly uploaded image if update failed *after* saving it
     if (validatedFields.data.image && finalImageUrl !== originalPost?.imageUrl) {
       await deleteImageFile(finalImageUrl);
     }
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
  let postToDelete: Post | undefined;
  const authHeaders = getAuthHeaders();
  try {
    await checkAdmin();

     // Fetch post info to get image URL before deleting the record
     const postResponse = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, { headers: authHeaders });
     if (postResponse.ok) {
       postToDelete = await postResponse.json();
     } else if (postResponse.status !== 404) {
        // Log if fetching failed for reasons other than not found, but proceed with delete attempt
        console.warn(`[Delete Action] Could not fetch post ${slug} before delete, proceeding anyway.`);
     }

     // Call the backend API to delete the post record
    const deleteResponse = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: authHeaders,
    });

    // handleActionApiResponse handles non-OK status codes including 404 from delete
    await handleActionApiResponse(deleteResponse);

     // Delete the image file *after* successfully deleting the post record
     // Uses postToDelete fetched earlier
     await deleteImageFile(postToDelete?.imageUrl);


    // Revalidate paths after successful API call
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`); // Revalidate the deleted post's path
    revalidatePath('/admin/posts'); // Revalidate admin posts page

    // Let the client-side handle redirect after success signal
    return { success: true, message: 'Post deleted successfully.' };

  } catch (error: any) {
    console.error("Delete post action failed:", error);
     if (error.message.includes('404') || error.message.includes('not found')) {
        // This error might come from handleActionApiResponse if the DELETE returned 404
        return { success: false, message: 'Post not found or already deleted.' };
     }
     // Catch authorization errors
     if (error.message.includes('Unauthorized')) {
       return { success: false, message: error.message };
     }
    return { success: false, message: error.message || 'Failed to delete post.' };
  }
}

