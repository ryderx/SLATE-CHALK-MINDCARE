import type { Post, PostFormData } from './types';

// In-memory store for blog posts
let posts: Post[] = [
  {
    id: '1',
    slug: 'understanding-anxiety',
    title: 'Understanding Anxiety and How to Cope',
    content: 'Anxiety is a common human experience, but it can become overwhelming. This post explores the nature of anxiety, its common triggers, and effective coping strategies. We discuss mindfulness techniques, cognitive restructuring, and when to seek professional help. Learning to manage anxiety can significantly improve your quality oflife.',
    createdAt: new Date('2023-10-15T10:00:00Z'),
    updatedAt: new Date('2023-10-15T10:00:00Z'),
  },
  {
    id: '2',
    slug: 'the-importance-of-self-care',
    title: 'The Importance of Self-Care in Mental Health',
    content: 'Self-care is not selfish; it\'s essential for maintaining good mental health. This article delves into various aspects of self-care, from physical well-being like sleep and nutrition, to emotional and mental practices like setting boundaries and engaging in hobbies. Discover practical tips to incorporate self-care into your daily routine.',
    createdAt: new Date('2023-11-02T14:30:00Z'),
    updatedAt: new Date('2023-11-02T14:30:00Z'),
  },
  {
    id: '3',
    slug: 'building-healthy-relationships',
    title: 'Building Healthy Relationships: Communication and Boundaries',
    content: 'Healthy relationships are a cornerstone of a happy life. This post focuses on two key elements: effective communication and setting healthy boundaries. We explore active listening, expressing needs respectfully, and the importance of mutual respect in all types of relationships, be it romantic, familial, or platonic.',
    createdAt: new Date('2023-11-20T09:15:00Z'),
    updatedAt: new Date('2023-11-20T09:15:00Z'),
  },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

// Function to find the final unique slug, used in create and potentially update
function findUniqueSlug(title: string, currentId?: string): string {
    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    // Check against existing slugs, excluding the current post if updating
    while (posts.some(p => p.slug === finalSlug && p.id !== currentId)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return finalSlug;
}


export async function getPosts(): Promise<Post[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 50));
  console.log('Current posts in store (getPosts):', posts.map(p => p.slug));
  return [...posts].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
   // Simulate API delay
   // await new Promise(resolve => setTimeout(resolve, 50));
  console.log(`Attempting to find post with slug: ${slug}`);
  console.log('Available slugs:', posts.map(p => p.slug));
  const foundPost = posts.find(post => post.slug === slug);
  console.log(`Post found for slug ${slug}?`, !!foundPost);
  return foundPost;
}

export async function createPost(data: PostFormData): Promise<Post> {
   // Simulate API delay
   // await new Promise(resolve => setTimeout(resolve, 50));
  const finalSlug = findUniqueSlug(data.title); // Use helper to ensure uniqueness

  const newPost: Post = {
    id: String(Date.now() + Math.random()), // Simple unique ID, added random for more uniqueness
    slug: finalSlug,
    title: data.title,
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.push(newPost);
  console.log('Post created:', newPost.slug, newPost.id); // Added logging
  console.log('Current posts array (slugs):', posts.map(p => p.slug)); // Added logging
  return newPost;
}

export async function updatePost(slug: string, data: PostFormData): Promise<Post | undefined> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 50));
  const postIndex = posts.findIndex(post => post.slug === slug);
  if (postIndex === -1) {
    console.error(`Update failed: Post with slug ${slug} not found.`);
    return undefined;
  }

  const originalPost = posts[postIndex];
  let newSlug = originalPost.slug;

  // If title changes, generate and check new slug
  if (originalPost.title !== data.title) {
      newSlug = findUniqueSlug(data.title, originalPost.id); // Use helper, excluding self
  }

  const updatedPost: Post = {
    ...originalPost,
    title: data.title,
    content: data.content,
    slug: newSlug, // Use the determined unique slug
    updatedAt: new Date(),
  };
  posts[postIndex] = updatedPost;
  console.log(`Post updated: old slug ${slug}, new slug ${newSlug}, id ${updatedPost.id}`);
  console.log('Current posts array (slugs):', posts.map(p => p.slug));
  return updatedPost;
}

export async function deletePost(slug: string): Promise<boolean> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 50));
  const initialLength = posts.length;
  const postToDelete = posts.find(p => p.slug === slug);
  if (postToDelete) {
      console.log(`Deleting post with slug: ${slug}, id: ${postToDelete.id}`);
  } else {
       console.log(`Attempted to delete non-existent post with slug: ${slug}`);
  }
  posts = posts.filter(post => post.slug !== slug);
  const deleted = posts.length < initialLength;
  if(deleted) {
      console.log(`Post ${slug} deleted successfully.`);
      console.log('Remaining posts (slugs):', posts.map(p => p.slug));
  } else {
       console.log(`Failed to delete post ${slug}. It might not have existed.`);
  }
  return deleted;
}
