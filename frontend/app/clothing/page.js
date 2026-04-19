'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Clothing() {
  const { data: session } = useSession();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const role = session?.user?.role?.toString?.().toLowerCase?.();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await apiService.getClothing({}, session);
      setBrands(Array.isArray(data) ? data : (data?.clothing || data?.brands || []));
    } catch (error) {
      console.error('Error loading clothing brands:', error);
      toast.error('Failed to load clothing brands');
    } finally {
      setLoading(false);
    }
  };

  const generateCoupon = async (brandId) => {
    if (!session || role !== 'user') {
      toast.error('Please login as a user to generate coupons');
      return;
    }

    try {
      const couponData = {
        restaurantId: brandId, // reuse coupon flow by treating brand as restaurant entity
        discountPercentage: 15,
        maxDiscount: 10,
        minOrderAmount: 20,
      };

      const result = await apiService.generateCoupon(couponData, session);
      toast.success(`Coupon generated: ${result.code}`);
      loadBrands();
    } catch (error) {
      console.error('Error generating coupon:', error);
      toast.error(error.message || 'Failed to generate coupon');
    }
  };

  const filteredBrands = brands.filter((b) => {
    const matchesSearch = (b.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(brands.map((b) => b.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Available Clothing Brands</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">Browse brands and generate exclusive discount coupons!</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search clothing brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">No brands found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((b) => (
              <div key={b._id} className="bg-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">👗</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-text-primary">{b.name}</h3>
                  </div>
                  <p className="text-text-secondary mb-1">ID: {b.brandId}</p>
                  <p className="text-text-secondary mb-1">{b.location}</p>
                  <p className="text-text-secondary mb-1">{b.website}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-text-secondary">Discount: {b.discount}%</div>
                    <button
                      onClick={() => generateCoupon(b._id)}
                      disabled={role !== 'user'}
                      title={role !== 'user' ? 'Login as a user to generate coupons' : ''}
                      className={`px-4 py-2 rounded-lg transition-colors text-white ${
                        role !== 'user' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'
                      }`}
                    >
                      Generate Coupon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


