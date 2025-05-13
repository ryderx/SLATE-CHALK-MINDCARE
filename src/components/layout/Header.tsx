// src/components/layout/Header.tsx
import Link from 'next/link';
// Removed NavLink import as it's now in ClientNavLinks
import { Button } from '@/components/ui/button';
// Removed Sheet imports as they are now in ClientNavLinks
import { Menu, LogIn, LogOut, Settings, PlusCircle, MessageSquareQuote, List } from 'lucide-react'; // Keep lucide-react imports if used elsewhere in Header, otherwise remove
import { getCurrentUserSession } from '@/lib/auth-utils';
import { LogoutButton } from './LogoutButton'; // Keep LogoutButton if it's a Server Component or used elsewhere
import { ClientNavLinks } from './ClientNavLinks'; // Import the new Client Component
import Image from 'next/image'; // Import the Image component

// Removed navItems and adminNavItems as they are now in ClientNavLinks

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
            src="/images/logo.png"
            alt="Slate & Chalk MindCare Logo"
            width={40} // Adjust width as needed
            height={40} // Adjust height as needed
            className="mr-3" // Add some margin to the right of the logo
          />
          SLATE & CHALK <span className="font-light">MINDCARE</span>
        </Link>

        {/* Render the ClientNavLinks component */}
        <ClientNavLinks isAdmin={isAdmin} isLoggedIn={isLoggedIn} />

        {/* Mobile Auth Buttons - Moved to ClientNavLinks */}
        {/* Desktop Auth Buttons - Moved to ClientNavLinks */}
      </div>
    </header>
  );
}