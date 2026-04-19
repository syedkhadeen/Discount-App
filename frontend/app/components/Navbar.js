'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaUserCircle, FaShoppingCart, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-surface shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold text-primary-600 cursor-pointer">FoodDiscount</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link href="/deals" className="text-text-primary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Deals
            </Link>
            
            <Link href="/restaurants" className="text-text-primary hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ml-4">
              Restaurants
            </Link>

            {/* Profile Button */}
            <button
              onClick={() => session ? window.location.href = '/profile' : signIn(undefined, { callbackUrl: '/profile' })}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-onPrimary bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaUserCircle className="mr-2 h-5 w-5" />
              {session ? 'My Profile' : 'Sign In'}
            </button>
            
            {session && (
              <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-surface flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span className="sr-only">Open user menu</span>
                      {session.user?.image ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                        />
                      ) : (
                        <FaUserCircle className="h-8 w-8 text-gray-400" />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-surface ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link 
                            href="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-text-primary`}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/orders"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-text-primary`}
                          >
                            Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } w-full text-left block px-4 py-2 text-sm text-text-primary flex items-center`}
                          >
                            <FaSignOutAlt className="mr-2" />
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
