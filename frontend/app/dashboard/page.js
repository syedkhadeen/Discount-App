'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [coupons, setCoupons] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [couponsData, restaurantsData] = await Promise.all([
        apiService.getUserCoupons({}, session),
        apiService.getRestaurants({}, session),
      ]);
      setCoupons(couponsData.coupons || []);
      setRestaurants(restaurantsData.restaurants || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Welcome back, {session?.user?.name || 'Foodie'}! 🍔
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Coupons Section */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-primary mb-4">My Coupons</h2>
            {coupons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary mb-4">You don't have any coupons yet</p>
                <Link 
                  href="/restaurants" 
                  className="inline-block bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.slice(0, 3).map((coupon) => (
                  <div key={coupon._id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-text-primary">{coupon.code}</p>
                        <p className="text-sm text-text-secondary">
                          {coupon.restaurantId?.name || 'Restaurant'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        coupon.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.status}
                      </span>
                    </div>
                  </div>
                ))}
                {coupons.length > 3 && (
                  <Link href="/coupons" className="text-primary-600 hover:text-primary-700 text-sm">
                    View all {coupons.length} coupons →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Available Restaurants */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Available Restaurants</h2>
            {restaurants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">No restaurants available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurants.slice(0, 3).map((restaurant) => (
                  <div key={restaurant._id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-text-primary">{restaurant.name}</p>
                        <p className="text-sm text-text-secondary">{restaurant.cuisine}</p>
                      </div>
                      <Link 
                        href={`/restaurants/${restaurant._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
                {restaurants.length > 3 && (
                  <Link href="/restaurants" className="text-primary-600 hover:text-primary-700 text-sm">
                    View all {restaurants.length} restaurants →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link 
            href="/restaurants" 
            className="bg-primary-500 text-white p-6 rounded-lg text-center hover:bg-primary-600 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Browse Restaurants</h3>
            <p className="text-primary-100">Find restaurants and generate coupons</p>
          </Link>

          <Link 
            href="/clothing" 
            className="bg-indigo-500 text-white p-6 rounded-lg text-center hover:bg-indigo-600 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Browse Clothing</h3>
            <p className="text-indigo-100">Find brands and generate coupons</p>
          </Link>

          <Link 
            href="/coupons" 
            className="bg-secondary-500 text-white p-6 rounded-lg text-center hover:bg-secondary-600 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">My Coupons</h3>
            <p className="text-secondary-100">View and manage your coupons</p>
          </Link>

          <Link 
            href="/profile" 
            className="bg-accent-500 text-white p-6 rounded-lg text-center hover:bg-accent-600 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <p className="text-accent-100">Update your account settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
