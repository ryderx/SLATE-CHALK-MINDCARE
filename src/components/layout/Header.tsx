// src/components/layout/Header.tsx
import Link from 'next/link';
import { getCurrentUserSession } from '@/lib/auth-utils';
import { ClientNavLinks } from './ClientNavLinks'; // Import the new Client Component
import Image from 'next/image'; // Import the Image component
import { PlusCircle } from 'lucide-react'; // Import PlusCircle

export async function Header() {
  // Fetch user session server-side
  const user = await getCurrentUserSession(); // Await the promise
  const isLoggedIn = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center ml-12"> {/* Added ml-12 to move logo to the right */}
          <Image
            src="/images/SlatenChalk@1x.svg"
            alt="Slate & Chalk MindCare Logo"
            width={86} // Increased from 75 (75 * 1.15 = 86.25)
            height={29} // Increased from 25 (25 * 1.15 = 28.75)
            // className="mr-3" // Removed mr-3 as it's not affecting external spacing and no text is next to it
          />
          {/* Logo text removed */}
        </Link>

        {/* Render the ClientNavLinks component */}
        <ClientNavLinks isAdmin={isAdmin} isLoggedIn={isLoggedIn} />

      </div>
    </header>
  );
}
