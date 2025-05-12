
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
  const excerpt = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''); // Shorter excerpt for card

  // Determine image source: uploaded image or placeholder
  const imageSrc = post.imageUrl || `https://picsum.photos/seed/${post.slug}/400/200`;
  const imageAlt = post.imageUrl ? post.title : `Placeholder image for ${post.title}`;
  const aiHint = post.imageUrl ? undefined : "colorful pattern"; // Only add hint for placeholders

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow overflow-hidden"> {/* Added overflow-hidden */}
      <Link href={`/blog/${post.slug}`} className="block group"> {/* Make image linkable and part of group */}
        <div className="relative h-48 w-full overflow-hidden"> {/* Ensure container clips image */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill // Use fill for better responsiveness
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Provide sizes hint
            style={{ objectFit: 'cover' }} // Ensure image covers the area
            className="group-hover:scale-105 transition-transform duration-300" // Apply hover effect via group
            data-ai-hint={aiHint} // Add hint only if it's a placeholder
            // Consider adding unoptimized prop if needed
            // unoptimized={!!post.imageUrl}
          />
        </div>
      </Link>
      <CardHeader className="pt-4"> {/* Reduced padding top */}
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="text-xl text-primary hover:text-primary/80 transition-colors line-clamp-2">{post.title}</CardTitle> {/* Adjusted size and line-clamp */}
        </Link>
        <CardDescription className="text-xs pt-1"> {/* Adjusted size and padding */}
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow py-2"> {/* Adjusted padding */}
        <p className="text-foreground text-sm leading-relaxed line-clamp-3">{excerpt}</p> {/* Adjusted size and line-clamp */}
      </CardContent>
      <CardFooter className="pt-2 pb-4"> {/* Adjusted padding */}
        <Button asChild variant="link" className="text-accent p-0 h-auto text-sm hover:text-accent/80">
          <Link href={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link> {/* Adjusted spacing */}
        </Button>
      </CardFooter>
    </Card>
  );
}
