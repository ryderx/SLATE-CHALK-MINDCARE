
// src/app/admin/page.tsx
import { redirect } from 'next/navigation';
import { isAdminSession } from '@/lib/auth-utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { List, MessageSquareQuote, Settings } from 'lucide-react'; // Import icons

export const dynamic = 'force-dynamic'; // Ensure auth check on every load

export default async function AdminDashboardPage() {
  // --- Authorization Check ---
  if (!(await isAdminSession())) {
    console.log('[Admin Dashboard] Unauthorized access attempt, redirecting to login.');
    redirect('/login?origin=/admin');
  }

  console.log('[Admin Dashboard] Admin verified, rendering dashboard.');

  return (
    <div className="container mx-auto py-12 md:py-20">
      <h1 className="text-4xl font-bold text-primary mb-12 text-center">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Manage Posts Card */}
        <Link href="/admin/posts" className="block hover:no-underline">
           <Card className="shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200 h-full">
            <CardHeader>
                <div className="flex items-center text-primary">
                    <List className="h-8 w-8 mr-3" />
                    <CardTitle className="text-2xl">Manage Blog Posts</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View, edit, delete, and create new blog posts.</p>
            </CardContent>
          </Card>
        </Link>

         {/* Manage Testimonials Card */}
        <Link href="/admin/testimonials" className="block hover:no-underline">
           <Card className="shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200 h-full">
            <CardHeader>
                 <div className="flex items-center text-primary">
                    <MessageSquareQuote className="h-8 w-8 mr-3" />
                    <CardTitle className="text-2xl">Manage Testimonials</CardTitle>
                 </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View, edit, delete, and add new client testimonials.</p>
            </CardContent>
          </Card>
         </Link>

         {/* Placeholder for Settings or other admin sections */}
         <Card className="shadow-lg bg-muted border-dashed h-full flex flex-col justify-center items-center text-center">
            <CardHeader>
                <div className="flex items-center text-muted-foreground">
                    <Settings className="h-8 w-8 mr-3" />
                    <CardTitle className="text-2xl">More Settings (Soon)</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Future admin sections will appear here.</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
