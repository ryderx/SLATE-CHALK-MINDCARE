
export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  imageUrl?: string; // Optional field for the image URL
  createdAt: Date;
  updatedAt: Date;
}

export type PostFormData = {
  title: string;
  content: string;
  image?: File | null; // Allow file upload
  imageUrl?: string; // Keep track of existing/new URL
};

// Add User type
export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
}

// Add Testimonial type
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  stars: number; // Typically 1-5
  createdAt: Date;
  updatedAt: Date;
}

// Add Testimonial form data type
export type TestimonialFormData = {
  quote: string;
  name: string;
  stars: number;
};

