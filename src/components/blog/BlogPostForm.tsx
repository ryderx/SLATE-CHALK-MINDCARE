
'use client';

import type { Post } from '@/lib/types';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Keep useRouter for potential refresh if needed, though redirect might handle it
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { FormState } from '@/app/blog/actions'; // Import FormState type
import { Card, CardContent } from '@/components/ui/card'; // Added Card

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
    if (state.message) {
        if (state.success) {
             toast({
               title: "Success!",
               description: state.message,
               variant: "default",
             });
             // Consider resetting the form fields visually if needed, although redirect handles navigation
             // Example: (document.getElementById('blog-post-form') as HTMLFormElement)?.reset();
        } else if (!state.success && (state.errors || state.message)) { // Show error if not success and errors OR message exists
             toast({
               title: "Error",
               description: state.message || "An error occurred. Please check the form.", // Provide a default message
               variant: "destructive",
             });
        }
    }
  }, [state, toast]);


  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data" id="blog-post-form">
      {/* Display general error message at the top */}
       {state.message && !state.success && !state.errors?.title && !state.errors?.content && !state.errors?.image && (
        <p className="text-sm text-destructive mt-1">{state.message}</p>
      )}
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
       <div>
         <Label htmlFor="image" className="text-lg font-medium">Featured Image</Label>
         {post?.imageUrl && (
            <Card className="mt-2 mb-4 w-64">
                <CardContent className="p-2">
                     <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                     <Image
                        src={post.imageUrl}
                        alt="Current featured image"
                        width={250}
                        height={150}
                        className="rounded-md object-cover"
                      />
                </CardContent>
            </Card>
         )}
         <Input
          id="image"
          name="image"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/webp" // Specify accepted types
          className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          aria-describedby="image-error"
         />
          <p className="text-xs text-muted-foreground mt-1">Upload a new image to replace the current one (if exists).</p>
         {state.errors?.image && (
           <p id="image-error" className="text-sm text-destructive mt-1">
             {state.errors.image.join(', ')}
           </p>
         )}
       </div>
      <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
        {submitButtonText}
      </Button>
    </form>
  );
}
