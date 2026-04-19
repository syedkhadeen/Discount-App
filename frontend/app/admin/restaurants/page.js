'use client';

import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminRestaurants() {
  // 1) All hooks run unconditionally at top
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    restaurantID: '',
    name: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    discount: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // derive the JWT from session
  const accessToken = session?.accessToken;

  // 2) Redirect non-admins once authenticated
  useEffect(() => {
    const role = session?.user?.role?.toString?.().toLowerCase?.();
    if (status === 'authenticated' && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // 3) Fetch list after auth
  useEffect(() => {
    if (status === 'authenticated') {
      fetchRestaurants();
    }
  }, [status, accessToken]);

  async function fetchRestaurants() {
    setError('');
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Fetch failed');
      }
      setRestaurants(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // validation
    if (!form.restaurantID || !form.name) {
      setError('Restaurant ID and Name are required');
      setLoading(false);
      return;
    }

    const endpoint = editingId
      ? `/restaurants/${editingId}`
      : '/restaurants';
    const method = editingId ? 'PUT' : 'POST';
    const payload = {
      restaurantID: form.restaurantID,
      name: form.name,
      email: form.email,
      address: form.address,
      phoneNumber: form.phoneNumber,
      discount: parseFloat(form.discount) || 0,
      ...(form.password ? { password: form.password } : {}),
    };
    const body = JSON.stringify(payload);

    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      console.log('Creating restaurant at:', `${API_BASE_URL}${endpoint}`, 'with token present:', Boolean(token));
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body,
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Save failed');
      }
      // reset & reload
    setForm({ restaurantID:'', name:'', email:'', password:'', address:'', phoneNumber:'', discount:'' });
      setEditingId(null);
      await fetchRestaurants();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm({
      restaurantID: r.restaurantID,
      name: r.name,
      email: r.email || '',
      password: '',
      address: r.address,
      phoneNumber: r.phoneNumber,
      discount: String(r.discount),
    });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this restaurant?')) return;
    setError('');
    try {
      const liveSession = status === 'authenticated' ? (await getSession()) : null;
      const token = accessToken || liveSession?.accessToken;
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Delete failed');
      }
      await fetchRestaurants();
    } catch (err) {
      setError(err.message);
    }
  };

  // 4) Loading & auth guards
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

  // 5) Render UI
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Restaurants</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <input
          name="restaurantID"
          value={form.restaurantID}
          onChange={(e) => setForm({ ...form, restaurantID: e.target.value })}
          placeholder="Restaurant ID"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Restaurant Name"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Login Email (for restaurant portal)"
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
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          className="border px-3 py-2 rounded w-full"
          disabled={loading}
          required
        />
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          placeholder="Phone Number"
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
                setForm({ restaurantID:'', name:'', address:'', phoneNumber:'', discount:'' });
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
        {restaurants.length === 0 ? (
          <p className="text-gray-500">No restaurants.</p>
        ) : (
          restaurants.map((r) => (
            <div
              key={r._id}
              className="flex justify-between p-4 border rounded shadow-sm"
            >
              <div>
                <p className="font-semibold">
                  {r.name} ({r.restaurantID})
                </p>
                <p className="text-sm text-gray-600">{r.email}</p>
                <p className="text-sm text-gray-600">{r.address}</p>
                <p className="text-sm text-gray-600">{r.phoneNumber}</p>
                <p className="text-sm text-gray-600">
                  Discount: {r.discount}%
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(r)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
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