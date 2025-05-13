
// src/app/api/testimonials/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import {
    getTestimonialById as dbGetTestimonialById,
    updateTestimonial as dbUpdateTestimonial,
    deleteTestimonial as dbDeleteTestimonial
} from '@/lib/testimonials-data-api';
import { isAdminSession } from '@/lib/auth-utils';
import type { TestimonialFormData } from '@/lib/types';
import { z } from 'zod';

interface Params {
  params: { id: string };
}

// Zod schema for validation (same as POST route)
const testimonialFormSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters.").max(500, "Quote cannot exceed 500 characters."),
  name: z.string().min(1, "Name is required.").max(100, "Name cannot exceed 100 characters."),
  stars: z.number().min(1).max(5),
  url: z.string().url("Please enter a valid URL (e.g., https://example.com).").max(200, "URL cannot exceed 200 characters.").optional().or(z.literal('')), // Optional, allow empty string
  imageHint: z.string().max(50, "Image hint cannot exceed 50 characters.").optional(),
});


export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    const testimonial = await dbGetTestimonialById(id);

    if (!testimonial) {
      return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error(`[API Testimonial GET /${params.id}] Error fetching testimonial:`, error);
    return NextResponse.json({ message: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    console.warn(`[API Testimonial PUT /${params.id}] Unauthorized attempt.`);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    const rawData = await request.json();
    const dataToValidate = {
        ...rawData,
        url: rawData.url === "" ? undefined : rawData.url, // Convert empty string to undefined for Zod optional validation
    };


    // --- Validation ---
     const validationResult = testimonialFormSchema.safeParse(dataToValidate);
     if (!validationResult.success) {
      console.warn(`[API Testimonial PUT /${params.id}] Invalid input data received:`, validationResult.error.flatten().fieldErrors);
      return NextResponse.json({ message: 'Invalid input data', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedTestimonial = await dbUpdateTestimonial(id, validationResult.data as TestimonialFormData); // Cast

    if (!updatedTestimonial) {
       console.warn(`[API Testimonial PUT /${params.id}] Testimonial not found or update failed in db.`);
      return NextResponse.json({ message: 'Testimonial not found or failed to update' }, { status: 404 });
    }

    console.log(`[API Testimonial PUT /${id}] Testimonial updated.`);
    return NextResponse.json(updatedTestimonial);

  } catch (error) {
    console.error(`[API Testimonial PUT /${params.id}] Error updating testimonial:`, error);
    return NextResponse.json({ message: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
     console.warn(`[API Testimonial DELETE /${params.id}] Unauthorized attempt.`);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    const success = await dbDeleteTestimonial(id);

    if (!success) {
       console.warn(`[API Testimonial DELETE /${params.id}] Testimonial not found or delete failed in db.`);
      return NextResponse.json({ message: 'Testimonial not found or failed to delete' }, { status: 404 });
    }

    console.log(`[API Testimonial DELETE /${id}] Testimonial deleted.`);
    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error(`[API Testimonial DELETE /${params.id}] Error deleting testimonial:`, error);
    return NextResponse.json({ message: 'Failed to delete testimonial' }, { status: 500 });
  }
}

