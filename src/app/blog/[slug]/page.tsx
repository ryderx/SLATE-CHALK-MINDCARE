import { getPostBySlug } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeletePostButton } from '@/components/blog/DeletePostButton';
import { Pencil, CalendarDays } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

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
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-4xl">
      <article className="prose prose-lg lg:prose-xl dark:prose-invert prose-headings:text-primary prose-p:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 max-w-none">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4 !mt-0">{post.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-6">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
            {post.updatedAt.getTime() !== post.createdAt.getTime() && (
              <span className="ml-4">Last updated on {new Date(post.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="relative h-72 md:h-96 w-full mb-10 rounded-lg overflow-hidden shadow-lg">
          <Image 
            src={`https://picsum.photos/seed/${post.slug}/1200/600`} 
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="doodle background"
            priority
          />
        </div>
        
        {/* Split content into paragraphs for basic styling, assuming plain text */}
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
        ))}
      </article>

      <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
        <Button asChild variant="outline">
          <Link href={`/blog/${post.slug}/edit`}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Post
          </Link>
        </Button>
        <DeletePostButton slug={post.slug} postTitle={post.title} />
      </div>
    </div>
  );
}
