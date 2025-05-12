
import Link from 'next/link';
import { getPosts } from '@/lib/blog-data'; // Uses API fetch now
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

// export const dynamic = 'force-dynamic'; // Reconsider if needed - getPosts fetches with no-store
// Revalidation might be better handled by actions triggering revalidatePath
// Using 'force-dynamic' to ensure admin status is checked on each request
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Fetch posts using the updated function that calls the API
  const posts = await getPosts();
  // Check if the current user is an admin using server-side session check
  const userIsAdmin = await isAdminSession();

  console.log(`[Blog Page] Admin status: ${userIsAdmin}`); // Logging

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold text-primary">Our Blog</h1>
        {/* Rigorously check isAdminSession result before rendering */}
        {userIsAdmin === true && ( // Explicit check for true
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/blog/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Post
            </Link>
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-lg text-foreground text-center py-10">No blog posts yet. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
