import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-static';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 md:py-20 text-center">
      <h1 className="text-5xl font-bold text-primary mb-6">Our Blog Has Moved</h1>
      <p className="text-lg text-foreground mb-8">
        Please visit our new blog platform to read our latest articles.
      </p>
      <Button asChild>
        <Link href="https://your-external-blog-url.com" target="_blank" rel="noopener noreferrer">
          Go to New Blog
        </Link>
      </Button>
    </div>
  );
}
