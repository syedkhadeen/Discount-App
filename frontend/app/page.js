'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-onPrimary sm:text-5xl md:text-6xl">
            <span className="block">Hungry for Great Deals?</span>
            <span className="block text-primary-100">We've Got You Covered</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-onPrimary sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover amazing food discounts from your favorite restaurants. Sign up now and save on your next meal!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link 
                href={session ? '/dashboard' : '/login'} 
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-onPrimary bg-accent-500 hover:bg-accent-600 md:py-4 md:text-lg md:px-10"
              >
                {session ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link 
                href="/deals" 
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-surface hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Deals</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Today's Best Offers
            </p>
            <p className="mt-4 max-w-2xl text-xl text-text-secondary lg:mx-auto">
              Check out these amazing deals from restaurants near you
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {/* Sample Deal Cards */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-surface overflow-hidden shadow rounded-lg">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-text-primary">Delicious Meal {item}</h3>
                      <span className="px-2 py-1 text-xs font-semibold text-onSecondary bg-secondary-500 rounded-full">
                        {item * 10}% OFF
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">
                      Amazing deal on your favorite meal. Limited time offer!
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-text-primary">${(20 - item * 2).toFixed(2)}</span>
                      <button className="px-4 py-2 bg-primary-500 text-onPrimary text-sm font-medium rounded-md hover:bg-primary-600">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
