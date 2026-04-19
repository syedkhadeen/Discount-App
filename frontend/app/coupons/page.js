'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiService } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Coupons() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const confirmCoupon = async (code) => {
    try {
      await apiService.confirmCouponAsUser(code, session);
      toast.success('Confirmed! Waiting for restaurant if not already confirmed.');
      loadCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to confirm coupon');
    }
  };

  useEffect(() => {
    if (session) {
      loadCoupons();
    }
  }, [session, filter]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? { status: filter } : {};
      const data = await apiService.getUserCoupons(query, session);
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'redeemed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
            My Coupons
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            View and manage your discount coupons
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-2 bg-surface rounded-lg p-1">
            {['all', 'active', 'redeemed', 'expired'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No coupons found</h3>
            <p className="text-text-secondary mb-6">
              {filter === 'all' 
                ? "You don't have any coupons yet. Start by browsing restaurants and generating coupons!"
                : `No ${filter} coupons found.`
              }
            </p>
            {filter === 'all' && (
              <a 
                href="/restaurants" 
                className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Browse Restaurants
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="bg-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Coupon Code */}
                  <div className="text-center mb-4">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-lg">
                      <h3 className="text-2xl font-bold tracking-wider">{coupon.code}</h3>
                      <p className="text-sm opacity-90">Coupon Code</p>
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-text-primary mb-1">
                      {coupon.restaurantId?.name || 'Restaurant'}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {coupon.restaurantId?.address || 'Address not available'}
                    </p>
                  </div>

                  {/* Discount Details */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Discount:</span>
                      <span className="font-semibold text-green-600">
                        {coupon.discountPercentage}% OFF
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Max Discount:</span>
                      <span className="font-semibold">${coupon.maxDiscount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Min Order:</span>
                      <span className="font-semibold">${coupon.minOrderAmount}</span>
                    </div>
                  </div>

                  {/* Validity */}
                  <div className="mb-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Valid From:</span>
                      <span>{formatDate(coupon.validFrom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Valid Until:</span>
                      <span>{formatDate(coupon.validUntil)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon.status)}`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {formatDate(coupon.createdAt)}
                    </span>
                  </div>

                  {/* Confirm & Usage Notes */}
                  {coupon.status === 'active' && (
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => confirmCoupon(coupon.code)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                      <span className="text-sm text-text-secondary">
                        User confirmed: {coupon.userConfirmed ? 'Yes' : 'No'} • Restaurant confirmed: {coupon.restaurantConfirmed ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {/* Usage Notes */}
                  {coupon.usageNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-text-secondary">
                        <strong>Notes:</strong> {coupon.usageNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
