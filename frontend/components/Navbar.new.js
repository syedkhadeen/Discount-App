'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function AuthStatus() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <FaSignInAlt className="mr-2" />
        Sign in
      </button>
    );
  }

  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs bg-surface flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <span className="sr-only">Open user menu</span>
          {session.user?.image ? (
            <img
              className="h-8 w-8 rounded-full"
              src={session.user.image}
              alt={session.user.name || 'User'}
              referrerPolicy="no-referrer"
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
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-text-primary'
                )}
              >
                Your Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'w-full text-left block px-4 py-2 text-sm text-text-primary'
                )}
              >
                <span className="flex items-center">
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700">
                FoodDiscount
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link 
              href="/deals" 
              className={classNames(
                pathname === '/deals' ? 'text-primary-600' : 'text-text-primary hover:text-primary-600',
                'px-3 py-2 rounded-md text-sm font-medium'
              )}
            >
              Deals
            </Link>
            
            <Link 
              href="/restaurants" 
              className={classNames(
                pathname === '/restaurants' ? 'text-primary-600' : 'text-text-primary hover:text-primary-600',
                'ml-4 px-3 py-2 rounded-md text-sm font-medium'
              )}
            >
              Restaurants
            </Link>
            
            <div className="ml-4 flex items-center md:ml-6">
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
