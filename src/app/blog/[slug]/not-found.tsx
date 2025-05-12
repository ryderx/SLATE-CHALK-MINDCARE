import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BlogPostNotFound() {
  return (
    <div className="container mx-auto py-12 md:py-20 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
      <p className="text-lg text-foreground mb-8">
        Sorry, we couldn't find the blog post you were looking for.
      </p>
      <Button asChild>
        <Link href="/blog">Back to Blog</Link>
      </Button>
    </div>
  );
}
