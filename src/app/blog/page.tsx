import Link from 'next/link';
import { getPosts } from '@/lib/blog-data';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensure data is fetched on each request

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold text-primary">Our Blog</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/blog/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Post
          </Link>
        </Button>
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
