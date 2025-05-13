// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SocialLinks {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/settings/social');
        if (response.ok) {
          const data: SocialLinks = await response.json();
          setSocialLinks(data);
        } else {
          console.error('Failed to fetch social media links');
          // Optionally set a default or handle error display
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
        // Optionally set a default or handle error display
      }
    };

    fetchSocialLinks();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Site Name */}
        <div>
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            SLATE & CHALK <span className="font-light">MINDCARE</span>
          </Link>
          {/* Optional: Add a slogan here if desired */}
          {/* <p className="mt-2 text-sm text-muted-foreground">Nurturing Minds, Fostering Well-being</p> */}
        </div>

        {/* Column 2: Company */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
            {/* Add other company links if needed, e.g., Partners */}
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
          <ul className="space-y-2 text-muted-foreground">
          <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Connect</h3>
          <ul className="space-y-2 text-muted-foreground">
            {/* Conditionally render social media links if fetched */}
            {socialLinks?.linkedin && (
                <li><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
            )}
             {socialLinks?.instagram && (
                <li><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a></li>
            )}
             {socialLinks?.facebook && (
                <li><a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a></li>
            )}
            {/* Keep login link or move it as needed */}
             <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 mt-8 text-center text-sm text-muted-foreground">
        &copy; {currentYear} SLATE & CHALK MINDCARE. All rights reserved.
      </div>
    </footer>
  );
}
