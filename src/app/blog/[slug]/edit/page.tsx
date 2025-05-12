import { getPostBySlug } from '@/lib/blog-data'; // Uses API fetch now
import { notFound, redirect } from 'next/navigation';
import { BlogPostForm } from '@/components/blog/BlogPostForm';
import { updatePost } from '@/app/blog/actions';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

// export const dynamic = 'force-dynamic'; // Reconsider - fetch uses no-store

interface EditPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EditPostPageProps) {
  // Fetching metadata doesn't strictly require admin, but the page does
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `Edit: ${post.title} | Slate & Chalk MindCare Blog`,
     robots: { // Prevent search engines from indexing the edit page
        index: false,
        follow: false,
     }
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // Check if the user is an admin via server-side session first
  if (!(await isAdminSession())) {
      console.log(`[Edit Post Page /${params.slug}] Unauthorized access attempt, redirecting.`);
    // Redirect non-admins away
     redirect(`/login?origin=/blog/${params.slug}/edit`); // Redirect to login
     // or redirect(`/blog/${params.slug}?error=unauthorized`);
  }

   console.log(`[Edit Post Page /${params.slug}] Admin verified, fetching post.`);
  const post = await getPostBySlug(params.slug);

  if (!post) {
      console.log(`[Edit Post Page /${params.slug}] Post not found after admin check.`);
    notFound(); // Post might have been deleted between check and fetch
  }

  // Bind the original slug to the updatePost server action
  // The action itself will handle potential slug changes based on title update
  const updatePostWithSlug = updatePost.bind(null, post.slug);

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary mb-10 text-center">Edit Post</h1>
      {/* Pass the fetched post data to the form */}
      <BlogPostForm post={post} action={updatePostWithSlug} submitButtonText="Update Post" />
    </div>
  );
}