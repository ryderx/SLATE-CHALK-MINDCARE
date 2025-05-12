
// src/app/api/posts/[slug]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getPostBySlug as dbGetPostBySlug, updatePost as dbUpdatePost, deletePost as dbDeletePost } from '@/lib/blog-data-api'; // Use API-specific data functions
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

interface Params {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    const post = await dbGetPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`[API Post GET /${params.slug}] Error fetching post:`, error);
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    const data = await request.json();

    // --- Basic Validation ---
    if (!data.title || !data.content || data.title.length < 3 || data.content.length < 10) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const updatedPost = await dbUpdatePost(slug, data);

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found or failed to update' }, { status: 404 });
    }

    console.log(`[API Post PUT /${slug}] Post updated. New slug: ${updatedPost.slug}`);
    return NextResponse.json(updatedPost);

  } catch (error) {
    console.error(`[API Post PUT /${params.slug}] Error updating post:`, error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    const success = await dbDeletePost(slug);

    if (!success) {
       // It might be because the post didn't exist, 404 is appropriate
      return NextResponse.json({ message: 'Post not found or failed to delete' }, { status: 404 });
    }

    console.log(`[API Post DELETE /${slug}] Post deleted.`);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 }); // Can also return 204 No Content

  } catch (error) {
    console.error(`[API Post DELETE /${params.slug}] Error deleting post:`, error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
