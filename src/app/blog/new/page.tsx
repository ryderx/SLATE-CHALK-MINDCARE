import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { createPost } from '@/app/blog/actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Post | Slate & Chalk MindCare Blog',
};

export default function NewPostPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Create New Post</h1>
      <BlogPostForm action={createPost} submitButtonText="Create Post" />
    </div>
  );
}
