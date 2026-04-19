'use client';

import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

const NavbarClient = dynamic(
  () => import('../components/NavbarClient'),
  { ssr: false }
);

export default function ClientLayout({ children }) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavbarClient />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-surface border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-text-secondary text-sm">
              &copy; {new Date().getFullYear()} FoodDiscount. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}
