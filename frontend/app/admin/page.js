'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session, status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    redirect('/deals');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/restaurants" className="bg-surface p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Manage Restaurants</h2>
            <p className="text-text-secondary">Create, edit, and delete restaurants.</p>
          </Link>
          <Link href="/admin/clothing" className="bg-surface p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Manage Clothing</h2>
            <p className="text-text-secondary">Create, edit, and delete clothing brands.</p>
          </Link>
          <Link href="/admin/users" className="bg-surface p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <p className="text-text-secondary">View and remove users.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


