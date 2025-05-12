'use client';

import type { Post } from '@/lib/types';
import { useActionState, useEffect } from 'react'; // Changed from react-dom and useFormState
import { useRouter } from 'next/navigation';
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
  const [state, formAction] = useActionState(action, initialFormState); // Changed from useFormState
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      });
      // Explicitly cast state to include newSlug for type safety
      const newSlug = (state as FormState & { newSlug?: string }).newSlug;
      if (newSlug) {
        // Redirect to the newly created/updated post using its slug
        router.push(`/blog/${newSlug}`);
      } else if (post) { // Fallback for update if slug didn't change (less likely with current logic)
        router.push(`/blog/${post.slug}`);
      } else { // Fallback if no slug is available (e.g., after creation error somehow?)
        router.push('/blog');
      }
      router.refresh(); // Ensure client cache is updated
    } else if (state.message && !state.success && (state.errors || state.message.startsWith('Failed') || state.message.startsWith('Unauthorized'))) { // Show error toast if there are errors or a general failure message
      toast({
        title: "Error",
        description: state.message + (state.errors?.general ? ` ${state.errors.general.join(', ')}` : ''),
        variant: "destructive",
      });
    }
  }, [state, router, toast, post]);

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
      {state.message && !state.success && !state.errors && (
         <p className="text-sm text-destructive mt-1">
            {state.message}
          </p>
      )}
      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}
