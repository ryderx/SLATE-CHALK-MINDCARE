// src/components/layout/Header.tsx
import Link from 'next/link';
import { ClientNavLinks } from './ClientNavLinks'; // Import the new Client Component
import Image from 'next/image'; // Import the Image component
// Removed: import { getCurrentUserSession } from '@/lib/auth-utils'; // No longer needed here
// Removed: import { PlusCircle } from 'lucide-react'; // No longer needed here

export function Header() { // No longer async
  // Server-side session check removed
  // const user = await getCurrentUserSession();
  // const isLoggedIn = !!user;
  // const isAdmin = !!user?.isAdmin;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center ml-12">
          <Image
            src="/images/SlatenChalk@1x.svg"
            alt="Slate & Chalk MindCare Logo"
            width={86} 
            height={29} 
          />
        </Link>

        {/* ClientNavLinks will now fetch its own auth state */}
        <ClientNavLinks />
      </div>
    </header>
  );
}
