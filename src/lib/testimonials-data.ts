
// src/lib/testimonials-data.ts
// Functions used by the FRONTEND (Server Components, Client Components via hooks/actions)
// to interact with the testimonials API.

import type { Testimonial, TestimonialFormData } from './types';

// Ensure NEXT_PUBLIC_APP_URL is set in your .env.local or environment
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

// Helper function to handle fetch responses (consistent with blog-data)
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) { /* ignore */ }
    const errorMessage = errorData?.message || `API request failed with status ${response.status}`;
    console.error("API Error:", errorMessage, "URL:", response.url);
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
     return undefined as T;
  }
  return response.json();
}

// --- Frontend Data Fetching Functions ---

export async function getTestimonials(): Promise<Testimonial[]> {
  console.log('[Frontend Testimonial Data] Fetching testimonials from API...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
       cache: 'no-store', // Ensure fresh data
       headers: {
        'Accept': 'application/json',
       }
    });
    const testimonials = await handleResponse<Testimonial[]>(response);
     // Ensure dates are parsed correctly
    return testimonials.map(testimonial => ({
        ...testimonial,
        createdAt: new Date(testimonial.createdAt),
        updatedAt: new Date(testimonial.updatedAt),
    }));
  } catch (error) {
    console.error('[Frontend Testimonial Data] Error fetching testimonials:', error);
    return []; // Return empty array on error
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | undefined> {
  console.log(`[Frontend Testimonial Data] Fetching testimonial with id: ${id} from API...`);
   if (!id) {
        console.error('[Frontend Testimonial Data] Attempted to fetch testimonial with empty id.');
        return undefined;
    }
  try {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${encodeURIComponent(id)}`, {
        cache: 'no-store',
         headers: {
            'Accept': 'application/json',
        }
    });
    if (response.status === 404) {
        console.log(`[Frontend Testimonial Data] Testimonial with id ${id} not found (404).`);
        return undefined;
    }
    const testimonial = await handleResponse<Testimonial>(response);
    // Ensure dates are parsed
     return testimonial ? {
        ...testimonial,
        createdAt: new Date(testimonial.createdAt),
        updatedAt: new Date(testimonial.updatedAt),
    } : undefined;
  } catch (error) {
    console.error(`[Frontend Testimonial Data] Error fetching testimonial by id ${id}:`, error);
    if (error instanceof Error && error.message.includes('404')) {
         return undefined;
    }
    return undefined;
  }
}

// Create, Update, Delete actions will be in src/app/admin/testimonials/actions.ts
