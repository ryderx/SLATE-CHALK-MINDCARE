

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostFormData = {
  title: string;
  content: string;
};

// Add User type
export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
}
