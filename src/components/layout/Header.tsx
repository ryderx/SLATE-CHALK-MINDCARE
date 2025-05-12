
// src/components/layout/Header.tsx
import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut, Settings, PlusCircle } from 'lucide-react'; // Added Settings and PlusCircle icons
import { getCurrentUserSession } from '@/lib/auth-utils'; // Import server-side session check
import { LogoutButton } from './LogoutButton'; // Import client component for logout

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact Us' },
];

export async function Header() {
  // Fetch user session server-side
  const user = getCurrentUserSession();
  const isLoggedIn = !!user;
  const isAdmin = !!user?.isAdmin; // Check if the logged-in user is an admin

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          SLATE & CHALK <span className="font-light">MINDCARE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
           {/* Conditionally show Admin links for admins */}
           {isAdmin && (
             <>
                <NavLink href="/admin/posts" activeClassName="text-accent font-semibold border-b-2 border-accent">
                   Manage Posts
                </NavLink>
                <NavLink href="/blog/new" activeClassName="text-accent font-semibold border-b-2 border-accent">
                   Create Post
                </NavLink>
             </>
            )}
        </nav>

         {/* Auth Buttons - Desktop */}
         <div className="hidden md:flex items-center space-x-2">
           {isLoggedIn ? (
                <LogoutButton />
            ) : (
                <Button asChild variant="ghost">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                </Button>
           )}
         </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
           {/* Auth Buttons - Mobile (before Sheet trigger for layout) */}
           {isLoggedIn ? (
              <LogoutButton size="icon" variant="outline" className="h-8 w-8"/>
           ) : (
             <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                 <Link href="/login">
                     <LogIn className="h-4 w-4" />
                      <span className="sr-only">Login</span>
                 </Link>
             </Button>
           )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                <Link href="/" className="text-xl font-bold text-primary mb-4">
                  SLATE & CHALK <span className="font-light">MINDCARE</span>
                </Link>
                {navItems.map((item) => (
                  // Wrap NavLink in SheetClose for mobile menu items
                   <SheetTrigger key={item.href} asChild>
                       <NavLink href={item.href} className="text-lg text-left justify-start w-full px-2 py-1">
                           {item.label}
                       </NavLink>
                   </SheetTrigger>
                ))}
                 {/* Conditionally show Admin links for admins in mobile */}
                 {isAdmin && (
                   <>
                     <SheetTrigger asChild>
                         <NavLink href="/admin/posts" className="text-lg text-left justify-start w-full px-2 py-1 text-accent">
                            <Settings className="mr-2 h-4 w-4" /> Manage Posts
                         </NavLink>
                    </SheetTrigger>
                     <SheetTrigger asChild>
                         <NavLink href="/blog/new" className="text-lg text-left justify-start w-full px-2 py-1 text-accent">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Post
                         </NavLink>
                    </SheetTrigger>
                   </>
                 )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
