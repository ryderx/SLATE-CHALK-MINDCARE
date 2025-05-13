// src/components/layout/Header.tsx
import Link from 'next/link';
import { getCurrentUserSession } from '@/lib/auth-utils';
import { ClientNavLinks } from './ClientNavLinks'; // Import the new Client Component
import Image from 'next/image'; // Import the Image component

export async function Header() {
  // Fetch user session server-side
  const user = await getCurrentUserSession(); // Await the promise
  const isLoggedIn = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <Image
            src="/images/SlatenChalk@1x.svg" // Use the same logo as the footer
            alt="Slate & Chalk MindCare Logo"
            width={75} // Adjusted width for header (proportional to 150x50)
            height={25} // Adjusted height for header (proportional to 150x50)
            className="mr-3" // Add some margin to the right of the logo
          />
          SLATE & CHALK <span className="font-light">MINDCARE</span>
        </Link>

        {/* Render the ClientNavLinks component */}
        <ClientNavLinks isAdmin={isAdmin} isLoggedIn={isLoggedIn} />

      </div>
    </header>
  );
}
