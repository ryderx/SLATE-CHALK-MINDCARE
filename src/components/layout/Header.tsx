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
        <Link href="/" className="flex items-center">
          <Image
            src="/images/SlatenChalk@1x.svg" 
            alt="Slate & Chalk MindCare Logo"
            width={75} 
            height={25} 
            className="mr-3" 
          />
          {/* Logo text removed */}
        </Link>

        {/* Render the ClientNavLinks component */}
        <ClientNavLinks isAdmin={isAdmin} isLoggedIn={isLoggedIn} />

      </div>
    </header>
  );
}
