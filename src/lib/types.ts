
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

// Settings Types
export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass: string; // Sensitive: Store securely in a real application
  secure: boolean; // true for SSL/TLS
  fromEmail?: string; // Optional: email address to send from
}

export interface AppSettings {
  socialLinks: SocialLinks;
  smtpSettings?: SmtpSettings;
}
