
'use client';

import { deleteTestimonialAction } from '@/app/admin/testimonials/actions';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteTestimonialButtonProps {
  testimonialId: string;
  testimonialName: string; // For the confirmation message
}

export function DeleteTestimonialButton({ testimonialId, testimonialName }: DeleteTestimonialButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteTestimonialAction(testimonialId);

      if (result.success) {
        toast({
          title: 'Testimonial Deleted',
          description: `The testimonial from "${testimonialName}" has been successfully deleted.`,
        });
        // Refresh the current page or redirect if needed (e.g., from an edit page)
        router.refresh();
      } else {
        toast({
          title: 'Error Deleting Testimonial',
          description: result.message || 'There was an issue deleting the testimonial. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending} title="Delete Testimonial">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the testimonial from "{testimonialName}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {isPending ? 'Deleting...' : 'Yes, delete testimonial'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

