
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/auth-utils';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Ensure layout checks auth on initial load, pages will re-check dynamically if needed
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // --- Authorization Check ---
  const isAdmin = await isAdminSession();
  if (!isAdmin) {
    // Redirect if not admin when accessing any /admin/* route
    console.log('[Admin Layout] Unauthorized access, redirecting to login.');
    redirect('/login?origin=/admin'); // Redirect to login, could capture specific path if needed
  }

  return (
    <div>
       {/* Optional: Add a simple admin header or back navigation */}
        <div className="container mx-auto py-4 border-b mb-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
                </Link>
            </Button>
        </div>
      {children}
    </div>
  );
}
