'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Restaurants() {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const role = session?.user?.role?.toString?.().toLowerCase?.();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRestaurants({}, session);
      setRestaurants(Array.isArray(data) ? data : (data?.restaurants || []));
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const generateCoupon = async (restaurantId) => {
    if (!session || role !== 'user') {
      toast.error('Please login as a user to generate coupons');
      return;
    }

    try {
      const couponData = {
        restaurantId,
        discountPercentage: 15, // Default 15% discount
        maxDiscount: 10, // Max $10 discount
        minOrderAmount: 20, // Min $20 order
      };

      const result = await apiService.generateCoupon(couponData, session);
      toast.success(`Coupon generated: ${result.code}`);
      // Refresh restaurants to show updated status
      loadRestaurants();
    } catch (error) {
      console.error('Error generating coupon:', error);
      toast.error(error.message || 'Failed to generate coupon');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisines = [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Available Restaurants
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Browse restaurants and generate exclusive discount coupons for your next meal!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((r) => (
              <div key={r._id} className="bg-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">🍽️</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-text-primary">{r.name}</h3>
                  </div>
                  <p className="text-text-secondary mb-1">ID: {r.restaurantID}</p>
                  <p className="text-text-secondary mb-1">{r.address}</p>
                  <p className="text-text-secondary mb-4">{r.phoneNumber}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-text-secondary">Discount: {r.discount}%</div>
                    <button
                      onClick={() => generateCoupon(r._id)}
                      disabled={role !== 'user'}
                      title={role !== 'user' ? 'Login as a user to generate coupons' : ''}
                      className={`px-4 py-2 rounded-lg transition-colors text-white ${
                        role !== 'user'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary-500 hover:bg-primary-600'
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