'use client';

import React, { useEffect, useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminUsers() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accessToken = session?.accessToken;

  useEffect(() => {
    const role = session?.user?.role?.toString?.().toLowerCase?.();
    if (status === 'authenticated' && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, accessToken]);

  async function fetchUsers() {
    setError('');
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to fetch users');
      }
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return;
    setError('');
    setLoading(true);
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Delete failed');
      }
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary-500 rounded-full" />
      </div>
    );
  }
  if (
    status === 'authenticated' &&
    (session?.user?.role?.toString?.().toLowerCase?.() !== 'admin')
  ) {
    return <p className="text-center mt-8 text-red-600">Access Denied</p>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="flex justify-between items-center p-4 border rounded shadow-sm">
              <div>
                <p className="font-semibold">{u.name || u.email}</p>
                <p className="text-sm text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-600">Role: {u.role}</p>
                {u.userID && (
                  <p className="text-xs text-gray-500">UserID: {u.userID}</p>
                )}
              </div>
              <div>
                <button
                  onClick={() => handleDelete(u._id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


