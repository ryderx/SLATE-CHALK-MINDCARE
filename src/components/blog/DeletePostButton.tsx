'use client';

import { deletePostAction } from '@/app/blog/actions';
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

interface DeletePostButtonProps {
  slug: string;
  postTitle: string;
}

export function DeletePostButton({ slug, postTitle }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deletePostAction(slug);
        toast({
          title: 'Post Deleted',
          description: `The post "${postTitle}" has been successfully deleted.`,
        });
        // Redirect is handled by server action
      } catch (error) {
        toast({
          title: 'Error Deleting Post',
          description: 'There was an issue deleting the post. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isPending ? 'Deleting...' : 'Delete Post'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post titled "{postTitle}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {isPending ? 'Deleting...' : 'Yes, delete post'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
