
import { getPostBySlug } from '@/lib/blog-data'; // Uses API fetch now
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeletePostButton } from '@/components/blog/DeletePostButton';
import { Pencil, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

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
    description: post.content.length > 160 ? post.content.substring(0, 157) + '...' : post.content,
  };
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  console.log(`[Blog Post Page] Fetching post for slug: ${params.slug}`);
  const post = await getPostBySlug(params.slug);
  // Check if the current user is an admin using server-side session check
  const userIsAdmin = await isAdminSession();

  if (!post) {
    console.error(`[Blog Post Page] Post not found for slug: ${params.slug}`); // Logging
    notFound(); // Trigger the not-found component
  }

  console.log(`[Blog Post Page] Post found for slug ${params.slug}: ${post.title}. Admin: ${userIsAdmin}. Image URL: ${post.imageUrl}`);

  // Determine image source: uploaded image or placeholder
  const imageSrc = post.imageUrl || `https://picsum.photos/seed/${post.slug}/1200/600`;
  const imageAlt = post.imageUrl ? post.title : `Placeholder image for ${post.title}`;
  const aiHint = post.imageUrl ? undefined : "doodle background"; // Only add hint for placeholders

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

        {/* Display Image: Uploaded or Placeholder */}
         <div className="relative h-72 md:h-96 w-full mb-10 rounded-lg overflow-hidden shadow-lg">
             <Image
               src={imageSrc}
               alt={imageAlt}
               fill // Use fill for responsive sizing
               style={{ objectFit: 'cover' }} // Ensure image covers the area
               data-ai-hint={aiHint} // Add hint only if it's a placeholder
               priority // Keep priority for LCP
               // Add unoptimized prop if using external URLs that Next.js can't optimize by default
               // unoptimized={!!post.imageUrl} // Example: disable optimization for uploaded images if needed
             />
        </div>


        {/* Render content */}
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
