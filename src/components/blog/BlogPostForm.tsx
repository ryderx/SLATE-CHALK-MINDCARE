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
      const newSlug = (state as FormState & { newSlug?: string }).newSlug;
      if (newSlug) {
        router.push(`/blog/${newSlug}`);
      } else if (post) { // on update if slug doesn't change
        router.push(`/blog/${post.slug}`);
      } else {
        router.push('/blog');
      }
      router.refresh(); // Ensure client cache is updated
    } else if (state.message && !state.success && state.errors) { // Only show error toast if there are errors
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
      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}
