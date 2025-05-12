
// src/app/admin/posts/page.tsx

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPosts } from '@/lib/blog-data'; // Uses API fetch
import { isAdminSession } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeletePostButton } from '@/components/blog/DeletePostButton';
import { Pencil, PlusCircle, Image as ImageIcon } from 'lucide-react'; // Added ImageIcon
import type { Metadata } from 'next';
import Image from 'next/image'; // For displaying thumbnails

export const metadata: Metadata = {
  title: 'Manage Blog Posts | Admin',
  robots: { // Prevent search engines from indexing admin pages
    index: false,
    follow: false,
  }
};

// Ensure this page is dynamically rendered and checks auth on each request
export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  // --- Authorization Check ---
  if (!(await isAdminSession())) {
    console.log('[Admin Posts Page] Unauthorized access attempt, redirecting to login.');
    redirect('/login?origin=/admin/posts'); // Redirect non-admins
  }

  console.log('[Admin Posts Page] Admin verified, fetching posts.');
  const posts = await getPosts(); // Fetch all posts

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Manage Blog Posts</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/blog/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-lg text-foreground text-center py-10">No blog posts found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border shadow-md">
            <Table>
            <TableCaption>A list of all blog posts.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.map((post) => (
                <TableRow key={post.id}>
                    <TableCell>
                     <div className="w-16 h-10 relative rounded overflow-hidden">
                        {post.imageUrl ? (
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="5rem" // Provide size hint
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary" title={post.title}>
                           {post.title}
                        </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{post.slug}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                        <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${post.slug}/edit`} title="Edit Post">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                        </Button>
                        <DeletePostButton slug={post.slug} postTitle={post.title} />
                    </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
}
