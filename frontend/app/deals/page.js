'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Deals() {
  const { data: session } = useSession();

  const deals = [
    {
      id: 1,
      title: "Pizza Palace Special",
      description: "50% off on all large pizzas",
      discount: "50% OFF",
      originalPrice: "$24.99",
      discountedPrice: "$12.49",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      restaurant: "Pizza Palace",
      validUntil: "2024-01-15"
    },
    {
      id: 2,
      title: "Burger Bonanza",
      description: "Buy 2 burgers, get 1 free",
      discount: "33% OFF",
      originalPrice: "$18.99",
      discountedPrice: "$12.66",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      restaurant: "Burger House",
      validUntil: "2024-01-20"
    },
    {
      id: 3,
      title: "Sushi Sensation",
      description: "20% off on all sushi rolls",
      discount: "20% OFF",
      originalPrice: "$32.99",
      discountedPrice: "$26.39",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      restaurant: "Sushi Express",
      validUntil: "2024-01-25"
    },
    {
      id: 4,
      title: "Pasta Paradise",
      description: "Free garlic bread with any pasta",
      discount: "FREE SIDE",
      originalPrice: "$16.99",
      discountedPrice: "$16.99",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
      restaurant: "Italian Delight",
      validUntil: "2024-01-30"
    },
    {
      id: 5,
      title: "Taco Tuesday",
      description: "All tacos $2 each on Tuesdays",
      discount: "60% OFF",
      originalPrice: "$5.00",
      discountedPrice: "$2.00",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
      restaurant: "Taco Town",
      validUntil: "2024-01-31"
    },
    {
      id: 6,
      title: "Ice Cream Dream",
      description: "Buy 1 scoop, get 1 free",
      discount: "50% OFF",
      originalPrice: "$6.99",
      discountedPrice: "$3.50",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
      restaurant: "Sweet Treats",
      validUntil: "2024-02-05"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Amazing Food Deals
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Discover incredible discounts on your favorite foods. Save money while enjoying delicious meals!
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search deals..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option>All Categories</option>
                <option>Pizza</option>
                <option>Burgers</option>
                <option>Sushi</option>
                <option>Pasta</option>
                <option>Mexican</option>
                <option>Desserts</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option>Sort by</option>
                <option>Discount %</option>
                <option>Price</option>
                <option>Expiry Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-surface rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {deal.discount}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-text-primary">{deal.title}</h3>
                </div>
                
                <p className="text-text-secondary mb-3">{deal.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-red-600">{deal.discountedPrice}</span>
                    {deal.originalPrice !== deal.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">{deal.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-text-secondary">{deal.restaurant}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">
                    Valid until: {new Date(deal.validUntil).toLocaleDateString()}
                  </span>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Get Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {!session && (
          <div className="mt-16 text-center bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Want More Exclusive Deals?</h2>
            <p className="text-lg mb-6">Sign up for free and get access to member-only discounts!</p>
            <Link 
              href="/register" 
              className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 