
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { createPost } from '@/app/blog/actions';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

export const metadata: Metadata = {
  title: 'Create New Post | Slate & Chalk MindCare Blog',
  robots: { // Prevent search engines from indexing the new post page
    index: false,
    follow: false,
  }
};

export default async function NewPostPage() {
  // Check if the user is an admin via server-side session before rendering
  if (!(await isAdminSession())) {
    console.log('[New Post Page] Unauthorized access attempt, redirecting.');
    // Redirect non-admins to the blog index or login page
    redirect('/login?origin=/blog/new'); // Redirect to login, preserving origin
    // or redirect('/blog?error=unauthorized');
  }

   console.log('[New Post Page] Admin verified, rendering form.');
  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Create New Post</h1>
      <BlogPostForm action={createPost} submitButtonText="Create Post" />
    </div>
  );
}
