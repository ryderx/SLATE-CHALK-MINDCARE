
// src/lib/testimonials-data-api.ts
// Manages the actual testimonial data persistence (in-memory for now)
// Used by the API route handlers.

import type { Testimonial, TestimonialFormData } from './types';

// In-memory store for testimonials - SERVER-SIDE ONLY within API routes
let testimonials: Testimonial[] = [
   {
    id: 't1',
    quote: "Slate & Chalk MindCare transformed my perspective on life. Their compassionate approach made all the difference.",
    name: "A. N.",
    stars: 5,
    url: "https://example.com/an-story",
    createdAt: new Date('2023-12-01T10:00:00Z'),
    updatedAt: new Date('2023-12-01T10:00:00Z'),
  },
  {
    id: 't2',
    quote: "I felt truly heard and understood. The therapists are incredibly skilled and supportive. Highly recommend!",
    name: "J. B.",
    stars: 5,
    createdAt: new Date('2023-12-10T11:30:00Z'),
    updatedAt: new Date('2023-12-10T11:30:00Z'),
  },
  {
    id: 't3',
    quote: "The couples counseling sessions helped us rebuild our communication and strengthen our bond. We are so grateful.",
    name: "M. & K. S.",
    stars: 5,
    url: "https://example.com/mks-journey",
    createdAt: new Date('2024-01-05T09:15:00Z'),
    updatedAt: new Date('2024-01-05T09:15:00Z'),
  },
  {
    id: 't4',
    quote: "A safe and professional environment. I've learned so much about myself and developed effective coping strategies.",
    name: "L. P.",
    stars: 4,
    createdAt: new Date('2024-01-20T16:00:00Z'),
    updatedAt: new Date('2024-01-20T16:00:00Z'),
  },
];

// --- Data Access Functions for API ---

export async function getTestimonials(): Promise<Testimonial[]> {
  // Simulate potential DB delay if needed
  // await new Promise(resolve => setTimeout(resolve, 20));
  console.log('[Testimonial Data API] Fetching all testimonials. Count:', testimonials.length);
  // Return a sorted copy (e.g., by creation date)
  return [...testimonials].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getTestimonialById(id: string): Promise<Testimonial | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  console.log(`[Testimonial Data API] Attempting to find testimonial with id: ${id}`);
  const foundTestimonial = testimonials.find(testimonial => testimonial.id === id);
  console.log(`[Testimonial Data API] Testimonial found for id ${id}?`, !!foundTestimonial);
  // Return a copy if found
  return foundTestimonial ? { ...foundTestimonial } : undefined;
}

export async function createTestimonial(data: TestimonialFormData): Promise<Testimonial> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const newTestimonial: Testimonial = {
    id: `t${Date.now()}${Math.random().toString(16).slice(2)}`, // More unique ID
    quote: data.quote,
    name: data.name,
    stars: data.stars,
    url: data.url, // Add URL
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  testimonials.push(newTestimonial);
  console.log('[Testimonial Data API] Testimonial created:', newTestimonial.id);
  console.log('[Testimonial Data API] Current testimonial count:', testimonials.length);
  return { ...newTestimonial }; // Return a copy
}

export async function updateTestimonial(id: string, data: TestimonialFormData): Promise<Testimonial | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const testimonialIndex = testimonials.findIndex(testimonial => testimonial.id === id);
  if (testimonialIndex === -1) {
    console.error(`[Testimonial Data API] Update failed: Testimonial with id ${id} not found.`);
    return undefined;
  }

  const originalTestimonial = testimonials[testimonialIndex];
  const updatedTestimonial: Testimonial = {
    ...originalTestimonial,
    quote: data.quote,
    name: data.name,
    stars: data.stars,
    url: data.url, // Update URL
    updatedAt: new Date(),
  };
  testimonials[testimonialIndex] = updatedTestimonial; // Update the in-memory store
  console.log(`[Testimonial Data API] Testimonial updated: id ${updatedTestimonial.id}`);
  return { ...updatedTestimonial }; // Return a copy
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const initialLength = testimonials.length;
  const testimonialToDelete = testimonials.find(t => t.id === id);

  if (!testimonialToDelete) {
     console.log(`[Testimonial Data API] Attempted to delete non-existent testimonial with id: ${id}`);
     return false; // Testimonial not found
  }

  console.log(`[Testimonial Data API] Deleting testimonial with id: ${testimonialToDelete.id}`);
  testimonials = testimonials.filter(testimonial => testimonial.id !== id); // Update the in-memory store

  const deleted = testimonials.length < initialLength;
  if(deleted) {
      console.log(`[Testimonial Data API] Testimonial ${id} deleted successfully.`);
      console.log('[Testimonial Data API] Remaining testimonial count:', testimonials.length);
  } else {
      console.log(`[Testimonial Data API] Failed to delete testimonial ${id}. Inconsistency?`);
  }
  return deleted;
}

