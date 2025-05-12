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

export async function getPosts(): Promise<Post[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...posts].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.find(post => post.slug === slug);
}

export async function createPost(data: PostFormData): Promise<Post> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const slug = slugify(data.title);
  // Check if slug already exists, append number if it does
  let finalSlug = slug;
  let counter = 1;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const newPost: Post = {
    id: String(Date.now()), // Simple unique ID
    slug: finalSlug,
    title: data.title,
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  posts.push(newPost);
  return newPost;
}

export async function updatePost(slug: string, data: PostFormData): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const postIndex = posts.findIndex(post => post.slug === slug);
  if (postIndex === -1) {
    return undefined;
  }

  const originalPost = posts[postIndex];
  let newSlug = originalPost.slug;

  // If title changes, slug might need to change
  if (originalPost.title !== data.title) {
    const potentialNewSlug = slugify(data.title);
    // Check if new slug conflicts with another post (excluding the current one)
    if (!posts.some(p => p.slug === potentialNewSlug && p.id !== originalPost.id)) {
        newSlug = potentialNewSlug;
    } else {
        // Handle conflict if necessary, or disallow title change that causes conflict
        // For simplicity, we might just keep old slug or append number if new slug already taken
        let counter = 1;
        let tempSlug = potentialNewSlug;
        while(posts.some(p => p.slug === tempSlug && p.id !== originalPost.id)) {
            tempSlug = `${potentialNewSlug}-${counter}`;
            counter++;
        }
        newSlug = tempSlug;
    }
  }


  const updatedPost: Post = {
    ...originalPost,
    title: data.title,
    content: data.content,
    slug: newSlug,
    updatedAt: new Date(),
  };
  posts[postIndex] = updatedPost;
  return updatedPost;
}

export async function deletePost(slug: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = posts.length;
  posts = posts.filter(post => post.slug !== slug);
  return posts.length < initialLength;
}
