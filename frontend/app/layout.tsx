'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>FoodDeal - Best Restaurant Deals & Discounts</title>
        <meta name="description" content="Discover amazing food deals and discounts from your favorite restaurants" />
      </head>
      <body className={`${inter.className} min-h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white`}>
        <SessionProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-center" />
              </SessionProvider>
      </body>
    </html>
  );
}
