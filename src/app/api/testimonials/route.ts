
// src/app/api/testimonials/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getTestimonials as dbGetTestimonials, createTestimonial as dbCreateTestimonial } from '@/lib/testimonials-data-api';
import { isAdminSession } from '@/lib/auth-utils';
import type { TestimonialFormData } from '@/lib/types';
import { z } from 'zod';

// Zod schema for validation
const testimonialFormSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters.").max(500, "Quote cannot exceed 500 characters."),
  name: z.string().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
  stars: z.number().min(1).max(5),
  url: z.string().url("Please enter a valid URL (e.g., https://example.com).").max(200, "URL cannot exceed 200 characters.").optional().or(z.literal('')), // Optional, allow empty string
  imageHint: z.string().max(50, "Image hint cannot exceed 50 characters.").optional(),
});


export async function GET(request: NextRequest) {
  try {
    const testimonials = await dbGetTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('[API Testimonials GET] Error fetching testimonials:', error);
    return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    console.warn('[API Testimonials POST] Unauthorized attempt to create testimonial.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const rawData = await request.json();
    const dataToValidate = {
        ...rawData,
        url: rawData.url === "" ? undefined : rawData.url, // Convert empty string to undefined for Zod optional validation
    };


    // --- Validation ---
    const validationResult = testimonialFormSchema.safeParse(dataToValidate);
     if (!validationResult.success) {
      console.warn('[API Testimonials POST] Invalid input data received:', validationResult.error.flatten().fieldErrors);
      return NextResponse.json({ message: 'Invalid input data', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const newTestimonial = await dbCreateTestimonial(validationResult.data as TestimonialFormData); // Cast as data includes imageHint
    console.log('[API Testimonials POST] Testimonial created:', newTestimonial.id);

    // Revalidation should happen in the Server Action calling this API
    return NextResponse.json(newTestimonial, { status: 201 });

  } catch (error) {
    console.error('[API Testimonials POST] Error creating testimonial:', error);
    return NextResponse.json({ message: 'Failed to create testimonial' }, { status: 500 });
  }
}

