'use client';

import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminClothing() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [clothing, setClothing] = useState([]);
  const [form, setForm] = useState({
    brandId: '',
    name: '',
    category: '',
    discount: '',
    website: '',
    email: '',
    password: '',
    location: '',
  });
  const [editingId, setEditingId] = useState(null);
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
      fetchClothing();
    }
  }, [status, accessToken]);

  async function fetchClothing() {
    setError('');
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/clothing`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Fetch failed');
      }
      setClothing(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!form.brandId || !form.name) {
      setError('Brand ID and Name are required');
      setLoading(false);
      return;
    }

    const endpoint = editingId ? `/clothing/${editingId}` : '/clothing';
    const method = editingId ? 'PATCH' : 'POST';
    const payload = {
      brandId: form.brandId,
      name: form.name,
      category: form.category,
      discount: parseFloat(form.discount) || 0,
      website: form.website,
      email: form.email,
      location: form.location,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Save failed');
      }
      setForm({ brandId: '', name: '', category: '', discount: '', website: '', email: '', password: '', location: '' });
      setEditingId(null);
      await fetchClothing();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      brandId: item.brandId || '',
      name: item.name || '',
      category: item.category || '',
      discount: String(item.discount ?? ''),
      website: item.website || '',
      email: item.email || '',
      password: '',
      location: item.location || '',
    });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this clothing item?')) return;
    setError('');
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/clothing/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Delete failed');
      }
      await fetchClothing();
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary-500 rounded-full" />
      </div>
    );
  }
  if (status === 'authenticated' && (session?.user?.role?.toString?.().toLowerCase?.() !== 'admin')) {
    return <p className="text-center mt-8 text-red-600">Access Denied</p>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Clothing</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <input
          name="brandId"
          value={form.brandId}
          onChange={(e) => setForm({ ...form, brandId: e.target.value })}
          placeholder="Brand ID"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Brand Name"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={editingId ? 'Login Email' : 'Login Email (for brand portal)'}
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={editingId ? 'New Password (leave blank to keep current)' : 'Password (min 6 characters)'}
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required={!editingId}
        />
        <input
          name="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="discount"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          placeholder="Discount %"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          placeholder="Website URL"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {loading ? 'Saving…' : editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ brandId: '', name: '', category: '', discount: '', website: '', email: '', password: '', location: '' });
                setError('');
              }}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6 max-w-2xl">
        {clothing.length === 0 ? (
          <p className="text-gray-500">No clothing brands.</p>
        ) : (
          clothing.map((item) => (
            <div key={item._id} className="flex justify-between p-4 border rounded shadow-sm">
              <div>
                <p className="font-semibold">
                  {item.name} ({item.brandId})
                </p>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Website: {item.website}</p>
                <p className="text-sm text-gray-600">Email: {item.email}</p>
                <p className="text-sm text-gray-600">Location: {item.location}</p>
                <p className="text-sm text-gray-600">Discount: {item.discount}%</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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


