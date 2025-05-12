
import { getPostBySlug } from '@/lib/blog-data'; // Uses API fetch now
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeletePostButton } from '@/components/blog/DeletePostButton';
import { Pencil, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

// export const dynamic = 'force-dynamic'; // Reconsider - fetching with no-store

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | Slate & Chalk MindCare Blog`,
    // Slice content carefully, ensure it doesn't cut mid-word awkwardly
    description: post.content.length > 160 ? post.content.substring(0, 157) + '...' : post.content,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`[Blog Post Page] Fetching post for slug: ${params.slug}`);
  const post = await getPostBySlug(params.slug);
  // Check if the current user is an admin using server-side session check
  const userIsAdmin = await isAdminSession();

  if (!post) {
    console.error(`[Blog Post Page] Post not found for slug: ${params.slug}`);
    notFound(); // Trigger the not-found component
  }

  console.log(`[Blog Post Page] Post found for slug ${params.slug}: ${post.title}. Admin: ${userIsAdmin}`);

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-4xl">
      <article className="prose prose-lg lg:prose-xl dark:prose-invert prose-headings:text-primary prose-p:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 max-w-none">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4 !mt-0">{post.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-6 flex-wrap"> {/* Added flex-wrap */}
            <div className="flex items-center mr-4 mb-1 sm:mb-0"> {/* Group icon and date */}
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {/* Show updated date only if it's different enough (e.g., > 1 minute) */}
            {post.updatedAt.getTime() - post.createdAt.getTime() > 60000 && (
               <div className="flex items-center mb-1 sm:mb-0"> {/* Group icon and date */}
                  <Pencil className="mr-2 h-4 w-4" /> {/* Use Pencil icon for update */}
                  <span>Last updated on {new Date(post.updatedAt).toLocaleDateString()}</span>
               </div>
            )}
          </div>
        </div>

        {/* Placeholder Image */}
         <div className="relative h-72 md:h-96 w-full mb-10 rounded-lg overflow-hidden shadow-lg">
             <Image
               // Use a consistent seed for the image, maybe based on slug
               src={`https://picsum.photos/seed/${post.slug}/1200/600`}
               alt={`Image for ${post.title}`}
               fill // Changed from layout="fill"
               style={{ objectFit: 'cover' }} // Use style prop for objectFit with fill
               data-ai-hint="doodle background" // Keep AI hint if useful
               priority // Keep priority for LCP
             />
        </div>


        {/* Render content - Improve basic paragraph splitting */}
        {/* Consider using a Markdown parser here if content is Markdown */}
        <div className="text-lg leading-relaxed space-y-4">
          {post.content.split('\n').map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : null
          )}
        </div>
      </article>

      {/* Conditionally render admin actions based on session */}
      {userIsAdmin && (
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.slug}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Post
            </Link>
          </Button>
          {/* Pass slug and title to the delete button */}
          <DeletePostButton slug={post.slug} postTitle={post.title} />
        </div>
      )}
    </div>
  );
}

```
  </change>
  <change>
    <file>src/app/blog/[slug]/edit/page.tsx</file>
    <description>Update Edit Post page to use server-side session check for authorization and redirect if not admin.</description>
    <content><![CDATA[
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
