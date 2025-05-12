
// src/app/admin/testimonials/new/page.tsx
import { TestimonialForm } from '@/components/testimonials/TestimonialForm';
import { createTestimonialAction } from '@/app/admin/testimonials/actions';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/auth-utils';

export const metadata: Metadata = {
  title: 'Add New Testimonial | Admin',
  robots: { index: false, follow: false }
};

export default async function NewTestimonialPage() {
  // --- Authorization Check ---
  if (!(await isAdminSession())) {
    console.log('[New Testimonial Page] Unauthorized access attempt, redirecting.');
    redirect('/login?origin=/admin/testimonials/new');
  }

  console.log('[New Testimonial Page] Admin verified, rendering form.');
  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Add New Testimonial</h1>
      <TestimonialForm action={createTestimonialAction} submitButtonText="Add Testimonial" />
    </div>
  );
}

