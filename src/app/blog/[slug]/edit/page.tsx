import { getPostBySlug } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { updatePost } from '@/app/blog/actions';

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `Edit: ${post.title} | Slate & Chalk MindCare Blog`,
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const updatePostWithSlug = updatePost.bind(null, post.slug);

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Edit Post</h1>
      <BlogPostForm post={post} action={updatePostWithSlug} submitButtonText="Update Post" />
    </div>
  );
}
