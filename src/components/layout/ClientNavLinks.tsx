// src/components/layout/ClientNavLinks.tsx
'use client';

import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut, Settings, PlusCircle, MessageSquareQuote, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from './LogoutButton';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact Us' },
];

const adminNavItems = [
    { href: '/admin/posts', label: 'Manage Posts', icon: List },
    { href: '/blog/new', label: 'Create Post', icon: PlusCircle },
    { href: '/admin/testimonials', label: 'Manage Testimonials', icon: List },
    { href: '/admin/testimonials/new', label: 'Add Testimonial', icon: MessageSquareQuote },
];

interface ClientNavLinksProps {
    isAdmin: boolean;
    isLoggedIn: boolean; // Also need isLoggedIn for the LogoutButton/Login button
}

export function ClientNavLinks({ isAdmin, isLoggedIn }: ClientNavLinksProps) {
    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4"> {/* Reduced space-x-6 to space-x-4 */}
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
               {/* Conditionally show Admin links for admins */}
               {isAdmin && (
                 <div className="flex items-center space-x-3 border-l pl-4 ml-4 border-border"> {/* Reduced space-x-4 to space-x-3 */}
                    <span className="text-sm font-semibold text-muted-foreground">Admin:</span>
                    {adminNavItems.slice(0,2).map(item => (
                         <NavLink key={item.href} href={item.href} activeClassName="text-accent font-semibold border-b-2 border-accent">
                             <item.icon className="mr-1 h-4 w-4 inline-block" /> {item.label}
                         </NavLink>
                     ))}
                     <NavLink href="/admin/testimonials" activeClassName="text-accent font-semibold border-b-2 border-accent">
                         <List className="mr-1 h-4 w-4 inline-block" /> Manage Testimonials
                     </NavLink>
                 </div>
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
                       <SheetTrigger key={item.href} asChild>
                           <NavLink href={item.href} className="text-lg text-left justify-start w-full px-2 py-1">
                               {item.label}
                           </NavLink>
                       </SheetTrigger>
                    ))}
                     {/* Conditionally show Admin links for admins in mobile */}
                     {isAdmin && (
                       <>
                        <div className="border-t pt-4 mt-4">
                            <span className="text-sm font-semibold text-muted-foreground px-2">Admin Menu</span>
                            {adminNavItems.map(item => (
                                <SheetTrigger key={item.href} asChild>
                                    <NavLink href={item.href} className="text-lg text-left justify-start w-full px-2 py-1 text-accent">
                                        <item.icon className="mr-2 h-4 w-4" /> {item.label}
                                    </NavLink>
                                </SheetTrigger>
                            ))}
                        </div>
                       </>
                     )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </>
    );
}
