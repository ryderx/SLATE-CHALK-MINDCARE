// src/components/layout/ClientNavLinks.tsx
'use client';

import Link from 'next/link';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn, LogOut, Settings, PlusCircle, MessageSquareQuote, List, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard
import { LogoutButton } from './LogoutButton';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Added useState, useEffect

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact Us' },
];

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts', label: 'Manage Posts', icon: List },
    { href: '/admin/blog/new', label: 'Create Post', icon: PlusCircle },
    { href: '/admin/testimonials', label: 'Manage Testimonials', icon: List },
    { href: '/admin/testimonials/new', label: 'Add Testimonial', icon: MessageSquareQuote },
    { href: '/admin/settings', label: 'App Settings', icon: Settings },
];

// Removed props: isAdmin, isLoggedIn. Component will fetch these.
export function ClientNavLinks() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                setIsLoadingSession(true);
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(data.isLoggedIn);
                    setIsAdmin(data.isAdmin);
                } else {
                    // Handle error, assume logged out
                    console.error('API session fetch error:', response.status);
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Failed to fetch session:', error);
                setIsLoggedIn(false);
                setIsAdmin(false);
            } finally {
                setIsLoadingSession(false);
            }
        }
        fetchSession();
    }, []);

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
               {isLoggedIn && isAdmin && !isLoadingSession && (
                 <div className="flex items-center space-x-3 border-l pl-4 ml-4 border-border">
                    <NavLink href="/admin" activeClassName="text-accent font-semibold border-b-2 border-accent">
                        <LayoutDashboard className="mr-1 h-4 w-4 inline-block" /> Admin
                    </NavLink>
                 </div>
               )}
            </nav>

             {/* Auth Buttons - Desktop */}
             <div className="hidden md:flex items-center space-x-2">
               {isLoadingSession ? (
                 <div className="h-9 w-20 bg-muted rounded animate-pulse"></div> /* Loading Skeleton */
               ) : isLoggedIn ? (
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
               {isLoadingSession ? (
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div> /* Loading Skeleton */
               ) : isLoggedIn ? (
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
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <div className="grid gap-4 py-6">
                    <Link href="/" className="flex items-center text-xl font-bold text-primary mb-4">
                        <Image
                            src="/images/SlatenChalk@1x.svg" 
                            alt="Slate & Chalk MindCare Logo"
                            width={60} 
                            height={20} 
                            className="mr-2"
                        />
                      SLATE & CHALK <span className="font-light">MINDCARE</span>
                    </Link>
                    {navItems.map((item) => (
                       <SheetTrigger key={item.href} asChild>
                           <NavLink href={item.href} className="text-lg text-left justify-start w-full px-2 py-1">
                               {item.label}
                           </NavLink>
                       </SheetTrigger>
                    ))}
                     {isLoggedIn && isAdmin && !isLoadingSession && (
                       <>
                        <div className="border-t pt-4 mt-4">
                            <span className="text-sm font-semibold text-muted-foreground px-2">Admin Menu</span>
                            {adminNavItems.map(item => (
                                <SheetTrigger key={item.href} asChild>
                                    <NavLink href={item.href} className="text-lg text-left justify-start w-full px-2 py-1 text-accent">
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        {item.label}
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
