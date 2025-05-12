
// src/app/api/posts/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getPosts as dbGetPosts, createPost as dbCreatePost, slugify, findUniqueSlug } from '@/lib/blog-data-api'; // Use API-specific data functions
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check
import type { PostFormData } from '@/lib/types'; // Import type

export async function GET(request: NextRequest) {
  try {
    const posts = await dbGetPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('[API Posts GET] Error fetching posts:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // --- Authentication Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    console.warn('[API Posts POST] Unauthorized attempt to create post.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    // The body now might contain imageUrl, passed from the server action
    const data = await request.json() as Omit<PostFormData, 'image'> & { imageUrl?: string };

    // --- Basic Validation (Could use Zod here too) ---
    if (!data.title || !data.content || data.title.length < 3 || data.content.length < 10) {
      console.warn('[API Posts POST] Invalid input data received:', data);
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    // Pass the full data (including optional imageUrl) to the db function
    const newPost = await dbCreatePost(data);
    console.log('[API Posts POST] Post created:', newPost.slug, 'Image:', newPost.imageUrl);

    // Revalidation should happen in the Server Action calling this API,
    // but returning the created post is good practice.
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error('[API Posts POST] Error creating post:', error);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}
