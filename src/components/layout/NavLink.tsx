'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type NavLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
  className?: string;
};

export function NavLink({ href, children, activeClassName = 'text-primary font-semibold border-b-2 border-primary', className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href.toString();

  return (
    <Link href={href} className={cn(
      "text-sm font-medium text-muted-foreground transition-colors hover:text-primary pb-1 text-center", // Added text-center class
      isActive && activeClassName,
      className
    )} {...props}>
      {children}
    </Link>
  );
}
