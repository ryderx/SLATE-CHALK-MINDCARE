import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer'; // Import the Footer component
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Slate & Chalk MindCare',
  description: 'Nurturing minds, fostering well-being. Expert psychological care and counseling services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}><body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer /> {/* Add the Footer component here */}
        </div>
        <Toaster />
      </body></html>
  );
}
