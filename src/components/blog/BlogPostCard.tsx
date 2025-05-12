import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-48 w-full mb-4 rounded-t-md overflow-hidden">
            <Image 
              src={`https://picsum.photos/seed/${post.slug}/400/200`} 
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
              data-ai-hint="abstract blog"
            />
          </div>
          <CardTitle className="text-2xl text-primary hover:text-primary/80 transition-colors">{post.title}</CardTitle>
        </Link>
        <CardDescription>
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground leading-relaxed">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-accent p-0 h-auto hover:text-accent/80">
          <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
