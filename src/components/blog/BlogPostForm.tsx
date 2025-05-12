'use client';

import type { Post } from '@/lib/types';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Keep useRouter for potential refresh if needed, though redirect might handle it
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { FormState } from '@/app/blog/actions'; // Import FormState type

interface BlogPostFormProps {
  post?: Post;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  submitButtonText?: string;
}

const initialFormState: FormState = {
  message: '',
  success: false,
};

export function BlogPostForm({ post, action, submitButtonText = 'Submit' }: BlogPostFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const { toast } = useToast();
  // const router = useRouter(); // Keep router if you need router.refresh() for other reasons, but navigation is handled by redirect

  useEffect(() => {
    // Only handle toast messages here. Navigation is handled by redirect in server action.
    // Note: The success message might only flash briefly before the redirect occurs.
    // Consider if you want to show the success toast on the *next* page after redirect instead.
    if (state.message) {
        if (state.success) {
             toast({
               title: "Processing...", // Or a generic success message that makes sense before redirect
               description: state.message,
               variant: "default",
             });
        } else if (!state.success && (state.errors || state.message.startsWith('Failed') || state.message.startsWith('Unauthorized') || state.message.startsWith('Validation failed'))) {
             toast({
               title: "Error",
               description: state.message + (state.errors?.general ? ` ${state.errors.general.join(', ')}` : ''),
               variant: "destructive",
             });
        }
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-lg font-medium">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          defaultValue={post?.title}
          required
          className="mt-1"
          aria-describedby="title-error"
        />
        {state.errors?.title && (
          <p id="title-error" className="text-sm text-destructive mt-1">
            {state.errors.title.join(', ')}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="content" className="text-lg font-medium">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={post?.content}
          required
          rows={10}
          className="mt-1"
          aria-describedby="content-error"
        />
        {state.errors?.content && (
          <p id="content-error" className="text-sm text-destructive mt-1">
            {state.errors.content.join(', ')}
          </p>
        )}
      </div>
      {state.errors?.general && (
          <p className="text-sm text-destructive mt-1">
            {state.errors.general.join(', ')}
          </p>
        )}
      {/* Display general error message if not success and no specific field errors */}
      {/* {state.message && !state.success && !state.errors && ( // Simplified condition in useEffect handles this
         <p className="text-sm text-destructive mt-1">
            {state.message}
          </p>
      )} */}
      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}
