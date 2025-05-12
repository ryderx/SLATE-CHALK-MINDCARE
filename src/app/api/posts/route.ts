
// src/app/api/posts/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getPosts as dbGetPosts, createPost as dbCreatePost, slugify, findUniqueSlug } from '@/lib/blog-data-api'; // Use API-specific data functions
import { isAdminSession } from '@/lib/auth-utils'; // Use server-side session check

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
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await request.json();

    // --- Basic Validation (Could use Zod here too) ---
    if (!data.title || !data.content || data.title.length < 3 || data.content.length < 10) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const newPost = await dbCreatePost(data);
    console.log('[API Posts POST] Post created:', newPost.slug);

    // Revalidation should happen in the Server Action calling this API,
    // but returning the created post is good practice.
    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error('[API Posts POST] Error creating post:', error);
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }
}
