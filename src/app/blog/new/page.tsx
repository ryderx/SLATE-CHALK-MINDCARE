import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { createPost } from '@/app/blog/actions';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth'; // Import admin check

export const metadata: Metadata = {
  title: 'Create New Post | Slate & Chalk MindCare Blog',
};

export default async function NewPostPage() {
  // Check if the user is an admin before rendering the page
  if (!(await isAdmin())) {
    // Redirect non-admins to the blog index or another appropriate page
    redirect('/blog?error=unauthorized');
  }

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Create New Post</h1>
      <BlogPostForm action={createPost} submitButtonText="Create Post" />
    </div>
  );
}
