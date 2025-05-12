
// src/lib/blog-data-api.ts
// This file manages the actual blog data persistence (in-memory for now)
// It's used by the API route handlers.

import type { Post, PostFormData } from './types';

// In-memory store for blog posts - THIS IS SERVER-SIDE ONLY within API routes
let posts: Post[] = [
   {
    id: '1',
    slug: 'understanding-anxiety',
    title: 'Understanding Anxiety and How to Cope',
    content: 'Anxiety is a common human experience, but it can become overwhelming. This post explores the nature of anxiety, its common triggers, and effective coping strategies. We discuss mindfulness techniques, cognitive restructuring, and when to seek professional help. Learning to manage anxiety can significantly improve your quality oflife.',
    createdAt: new Date('2023-10-15T10:00:00Z'),
    updatedAt: new Date('2023-10-15T10:00:00Z'),
    imageUrl: `https://picsum.photos/seed/understanding-anxiety/1200/600` // Example starting image
  },
  {
    id: '2',
    slug: 'the-importance-of-self-care',
    title: 'The Importance of Self-Care in Mental Health',
    content: 'Self-care is not selfish; it\'s essential for maintaining good mental health. This article delves into various aspects of self-care, from physical well-being like sleep and nutrition, to emotional and mental practices like setting boundaries and engaging in hobbies. Discover practical tips to incorporate self-care into your daily routine.',
    createdAt: new Date('2023-11-02T14:30:00Z'),
    updatedAt: new Date('2023-11-02T14:30:00Z'),
    imageUrl: `https://picsum.photos/seed/the-importance-of-self-care/1200/600` // Example starting image
  },
  {
    id: '3',
    slug: 'building-healthy-relationships',
    title: 'Building Healthy Relationships: Communication and Boundaries',
    content: 'Healthy relationships are a cornerstone of a happy life. This post focuses on two key elements: effective communication and setting healthy boundaries. We explore active listening, expressing needs respectfully, and the importance of mutual respect in all types of relationships, be it romantic, familial, or platonic.',
    createdAt: new Date('2023-11-20T09:15:00Z'),
    updatedAt: new Date('2023-11-20T09:15:00Z'),
     imageUrl: `https://picsum.photos/seed/building-healthy-relationships/1200/600` // Example starting image
  },
];

// --- Helper Functions (Keep consistency) ---
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function findUniqueSlug(title: string, currentId?: string): string {
    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    // Check against the current posts array
    while (posts.some(p => p.slug === finalSlug && p.id !== currentId)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return finalSlug;
}

// --- Data Access Functions for API ---

export async function getPosts(): Promise<Post[]> {
  // Simulate potential DB delay if needed
  // await new Promise(resolve => setTimeout(resolve, 20));
  console.log('[Blog Data API] Fetching all posts. Count:', posts.length);
  // Return a sorted copy
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  console.log(`[Blog Data API] Attempting to find post with slug: ${slug}`);
  const foundPost = posts.find(post => post.slug === slug);
  console.log(`[Blog Data API] Post found for slug ${slug}?`, !!foundPost);
  // Return a copy if found
  return foundPost ? { ...foundPost } : undefined;
}

// Accept imageUrl from the action
export async function createPost(data: Omit<PostFormData, 'image'> & { imageUrl?: string }): Promise<Post> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const finalSlug = findUniqueSlug(data.title);

  const newPost: Post = {
    id: String(Date.now() + Math.random()), // Consider more robust ID generation
    slug: finalSlug,
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl, // Store the image URL provided by the action
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.push(newPost);
  console.log('[Blog Data API] Post created:', newPost.slug, newPost.id, 'Image:', newPost.imageUrl);
  console.log('[Blog Data API] Current post count:', posts.length);
  return { ...newPost }; // Return a copy
}

// Accept imageUrl from the action
export async function updatePost(slug: string, data: Omit<PostFormData, 'image'> & { imageUrl?: string }): Promise<Post | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const postIndex = posts.findIndex(post => post.slug === slug);
  if (postIndex === -1) {
    console.error(`[Blog Data API] Update failed: Post with slug ${slug} not found.`);
    return undefined;
  }

  const originalPost = posts[postIndex];
  let newSlug = originalPost.slug;

  // Only generate a new slug if the title has actually changed
  if (originalPost.title !== data.title) {
      newSlug = findUniqueSlug(data.title, originalPost.id);
      console.log(`[Blog Data API] Title changed for post ${slug}. New slug generated: ${newSlug}`);
  }

  const updatedPost: Post = {
    ...originalPost,
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl, // Update with the image URL from the action
    slug: newSlug,
    updatedAt: new Date(),
  };
  posts[postIndex] = updatedPost; // Update the in-memory store
  console.log(`[Blog Data API] Post updated: old slug ${slug}, new slug ${newSlug}, id ${updatedPost.id}, Image: ${updatedPost.imageUrl}`);
  return { ...updatedPost }; // Return a copy
}

export async function deletePost(slug: string): Promise<boolean> {
  // await new Promise(resolve => setTimeout(resolve, 20));
  const initialLength = posts.length;
  const postToDelete = posts.find(p => p.slug === slug);

  if (!postToDelete) {
     console.log(`[Blog Data API] Attempted to delete non-existent post with slug: ${slug}`);
     return false; // Post not found
  }

  console.log(`[Blog Data API] Deleting post with slug: ${slug}, id: ${postToDelete.id}`);
  posts = posts.filter(post => post.slug !== slug); // Update the in-memory store

  const deleted = posts.length < initialLength;
  if(deleted) {
      // Also delete the associated image file if it exists
      if (postToDelete.imageUrl && postToDelete.imageUrl.startsWith('/uploads/blog/')) {
          try {
              const fs = await import('fs/promises');
              const path = await import('path');
              const imagePath = path.join(process.cwd(), 'public', postToDelete.imageUrl);
              await fs.unlink(imagePath);
              console.log(`[Blog Data API] Deleted image file: ${imagePath}`);
          } catch (err: any) {
              // Log error but don't fail the post deletion if file deletion fails
              if (err.code !== 'ENOENT') { // Ignore 'file not found' errors
                 console.error(`[Blog Data API] Error deleting image file ${postToDelete.imageUrl}:`, err);
              }
          }
      }
      console.log(`[Blog Data API] Post ${slug} deleted successfully.`);
      console.log('[Blog Data API] Remaining post count:', posts.length);
  } else {
      // This case should technically not be reached if find worked, but good for robustness
       console.log(`[Blog Data API] Failed to delete post ${slug}. Inconsistency?`);
  }
  return deleted;
}
