
// src/app/api/posts/[slug]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getPostBySlug as dbGetPostBySlug, updatePost as dbUpdatePost, deletePost as dbDeletePost } from '@/lib/blog-data-api'; // Use API-specific data functions
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check
import type { PostFormData } from '@/lib/types'; // Import type

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
    console.warn(`[API Post PUT /${params.slug}] Unauthorized attempt.`);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    // The body now might contain imageUrl, passed from the server action
    const data = await request.json() as Omit<PostFormData, 'image'> & { imageUrl?: string };

    // --- Basic Validation ---
    if (!data.title || !data.content || data.title.length < 3 || data.content.length < 10) {
       console.warn(`[API Post PUT /${params.slug}] Invalid input data received:`, data);
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // Pass the full data (including optional imageUrl) to the db function
    const updatedPost = await dbUpdatePost(slug, data);

    if (!updatedPost) {
       console.warn(`[API Post PUT /${params.slug}] Post not found or update failed in db.`);
      return NextResponse.json({ message: 'Post not found or failed to update' }, { status: 404 });
    }

    console.log(`[API Post PUT /${slug}] Post updated. New slug: ${updatedPost.slug}, Image: ${updatedPost.imageUrl}`);
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
     console.warn(`[API Post DELETE /${params.slug}] Unauthorized attempt.`);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ message: 'Slug parameter is required' }, { status: 400 });
    }

    // dbDeletePost now handles image file deletion side effect
    const success = await dbDeletePost(slug);

    if (!success) {
       // It might be because the post didn't exist, 404 is appropriate
       console.warn(`[API Post DELETE /${params.slug}] Post not found or delete failed in db.`);
      return NextResponse.json({ message: 'Post not found or failed to delete' }, { status: 404 });
    }

    console.log(`[API Post DELETE /${slug}] Post deleted.`);
    // Return 204 No Content for successful deletion as per convention
    return new NextResponse(null, { status: 204 });


  } catch (error) {
    console.error(`[API Post DELETE /${params.slug}] Error deleting post:`, error);
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 });
  }
}
