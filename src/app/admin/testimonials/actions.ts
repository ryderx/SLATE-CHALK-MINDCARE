
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';
import type { TestimonialFormData, Testimonial } from '@/lib/types';
import { isAdminSession } from '@/lib/auth-utils';
import { SESSION_COOKIE_NAME } from '@/lib/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

// Zod schema for validation (must match API)
const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters.").max(500, "Quote cannot exceed 500 characters."),
  name: z.string().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
  // Use coerce for number input from FormData
  stars: z.coerce.number().min(1, "Stars must be between 1 and 5.").max(5, "Stars must be between 1 and 5."),
  imageHint: z.string().max(50, "Image hint cannot exceed 50 characters.").optional().nullable(), // Allow null from form
});


export type TestimonialFormState = {
  message: string;
  errors?: {
    quote?: string[];
    name?: string[];
    stars?: string[];
    imageHint?: string[];
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

// Helper function to check admin before proceeding
async function checkAdmin(): Promise<void> {
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin privileges required.');
  }
}

// Helper function to handle API fetch responses
async function handleActionApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) { /* ignore */ }
    const errorMessage = errorData?.message || `API Error: ${response.status} ${response.statusText}`;
    console.error("API Action Error:", errorMessage, response.url, errorData?.errors);
    // Include specific field errors if available from API validation
     if (errorData?.errors) {
       throw new Error(errorMessage, { cause: errorData.errors });
     }
    throw new Error(errorMessage);
  }
   if (response.status === 204) {
     return undefined as T;
   }
  return response.json();
}

// --- Server Actions ---

export async function createTestimonialAction(prevState: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: [error.message || 'Unauthorized access.'] } };
  }

  const rawData = {
    quote: formData.get('quote'),
    name: formData.get('name'),
    stars: formData.get('stars'),
    imageHint: formData.get('imageHint') || undefined, // Handle empty string
  };

  const validatedFields = testimonialSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const authHeaders = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(validatedFields.data),
    });

    await handleActionApiResponse<Testimonial>(response);

    // Revalidate paths
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');

    return { message: 'Testimonial created successfully.', success: true };

  } catch (error: any) {
    console.error("Create testimonial action failed:", error);
    return {
        message: error.message || 'Failed to create testimonial.',
        success: false,
        // Pass API validation errors back to the form
        errors: error.cause ?? { general: [error.message || 'An unexpected error occurred.'] }
     };
  }

  // Redirect after successful creation (handled by form useEffect on success)
  // redirect('/admin/testimonials');
}

export async function updateTestimonialAction(id: string, prevState: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
 try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message || 'Authentication failed.', success: false, errors: { general: [error.message || 'Unauthorized access.'] } };
  }

  const rawData = {
    quote: formData.get('quote'),
    name: formData.get('name'),
    stars: formData.get('stars'),
    imageHint: formData.get('imageHint') || undefined,
  };

  const validatedFields = testimonialSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const authHeaders = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/api/testimonials/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(validatedFields.data),
    });

    await handleActionApiResponse<Testimonial>(response);

    // Revalidate paths
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');
    revalidatePath(`/admin/testimonials/${id}/edit`);

     return { message: 'Testimonial updated successfully.', success: true };


  } catch (error: any) {
    console.error("Update testimonial action failed:", error);
    if (error.message.includes('404') || error.message.includes('not found')) {
       return { message: 'Testimonial not found or failed to update.', success: false, errors: { general: ['Could not find the testimonial to update.'] } };
     }
    return {
        message: error.message || 'Failed to update testimonial.',
        success: false,
        errors: error.cause ?? { general: [error.message || 'An unexpected error occurred.'] }
    };
  }
   // Redirect after successful update (handled by form useEffect on success)
   // redirect('/admin/testimonials');
}


export async function deleteTestimonialAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await checkAdmin();
    const authHeaders = getAuthHeaders();

    const deleteResponse = await fetch(`${API_BASE_URL}/api/testimonials/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders,
    });

    await handleActionApiResponse(deleteResponse);

    // Revalidate paths
    revalidatePath('/testimonials');
    revalidatePath('/admin/testimonials');

    return { success: true, message: 'Testimonial deleted successfully.' };

  } catch (error: any) {
    console.error("Delete testimonial action failed:", error);
     if (error.message.includes('404') || error.message.includes('not found')) {
        return { success: false, message: 'Testimonial not found or already deleted.' };
     }
     if (error.message.includes('Unauthorized')) {
       return { success: false, message: error.message };
     }
    return { success: false, message: error.message || 'Failed to delete testimonial.' };
  }
}

