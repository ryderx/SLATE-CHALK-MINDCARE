import { getPostBySlug } from '@/lib/blog-data';
import { notFound, redirect } from 'next/navigation';
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { updatePost } from '@/app/blog/actions';
import { isAdmin } from '@/lib/auth'; // Import admin check

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EditPostPageProps) {
  // No need for admin check here, as it's just metadata
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `Edit: ${post.title} | Slate & Chalk MindCare Blog`,
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Check if the user is an admin before proceeding
  if (!(await isAdmin())) {
    // Redirect non-admins away
    redirect(`/blog/${params.slug}?error=unauthorized`); // Redirect to the post view page
  }

  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Bind the slug to the updatePost server action
  const updatePostWithSlug = updatePost.bind(null, post.slug);

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Edit Post</h1>
      <BlogPostForm post={post} action={updatePostWithSlug} submitButtonText="Update Post" />
    </div>
  );
}
