// src/app/api/settings/social/route.ts
import { NextResponse } from 'next/server';

// In a real application, this data would come from a database or configuration file
// For now, let's use a simple in-memory object (this will reset on server restart)
let socialMediaLinks = {
  linkedin: 'https://www.linkedin.com/your-profile',
  instagram: 'https://www.instagram.com/your-profile',
  facebook: 'https://www.facebook.com/your-profile',
};

export async function GET() {
  return NextResponse.json(socialMediaLinks);
}

export async function POST(request: Request) {
  try {
    const updatedLinks = await request.json();
    console.log('Received social media links update:', updatedLinks);

    // In a real application, you would save updatedLinks to your database here
    // For demonstration, we'll update the in-memory object
    socialMediaLinks = { ...socialMediaLinks, ...updatedLinks };

    return NextResponse.json({ message: 'Social media links updated successfully' });
  } catch (error) {
    console.error('Error updating social media links:', error);
    return NextResponse.json({ message: 'Failed to update social media links' }, { status: 500 });
  }
}
