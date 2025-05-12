import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google'; // Removed Playfair_Display
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";

// const playfair = Playfair_Display({ // Removed Playfair_Display
//   subsets: ['latin'],
//   variable: '--font-playfair',
//   display: 'swap',
//   weight: ['400', '700'],
// });

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '700', '900'], // Added 900 for potentially bolder headings
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
    <html lang="en" className={`${montserrat.variable}`}> {/* Removed playfair.variable */}
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
