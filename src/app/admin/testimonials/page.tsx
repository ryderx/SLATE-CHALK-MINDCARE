
// src/app/admin/testimonials/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTestimonials } from '@/lib/testimonials-data'; // Uses API fetch
import { isAdminSession } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteTestimonialButton } from '@/components/testimonials/DeleteTestimonialButton'; // Updated import
import { Pencil, PlusCircle, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Testimonials | Admin',
  robots: { index: false, follow: false }
};

export const dynamic = 'force-dynamic'; // Ensure fresh data and auth check

export default async function AdminTestimonialsPage() {
  // --- Authorization Check ---
  if (!(await isAdminSession())) {
    console.log('[Admin Testimonials Page] Unauthorized access attempt, redirecting to login.');
    redirect('/login?origin=/admin/testimonials');
  }

  console.log('[Admin Testimonials Page] Admin verified, fetching testimonials.');
  const testimonials = await getTestimonials();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Manage Testimonials</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/admin/testimonials/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-lg text-foreground text-center py-10">No testimonials found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-md">
          <Table>
            <TableCaption>A list of all testimonials.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Client Name</TableHead>
                <TableHead>Quote Excerpt</TableHead>
                <TableHead className="w-[100px]">Stars</TableHead>
                <TableHead className="w-[120px]">Created At</TableHead>
                <TableHead className="w-[120px]">Updated At</TableHead>
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">{testimonial.name}</TableCell>
                  <TableCell className="max-w-md truncate" title={testimonial.quote}>
                    "{testimonial.quote.substring(0, 80)}{testimonial.quote.length > 80 ? '...' : ''}"
                  </TableCell>
                   <TableCell>
                     <div className="flex items-center">
                        {testimonial.stars} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                   </TableCell>
                  <TableCell>{new Date(testimonial.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(testimonial.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/testimonials/${testimonial.id}/edit`} title="Edit Testimonial">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <DeleteTestimonialButton testimonialId={testimonial.id} testimonialName={testimonial.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
