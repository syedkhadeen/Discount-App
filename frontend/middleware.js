import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

// List of public paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/deals', '/restaurants', '/restaurant-portal'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      const role = token?.role?.toString?.().toLowerCase?.();
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/deals', request.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    // Restrict /admin to admin role only
    if (pathname.startsWith('/admin')) {
      const role = token?.role?.toString?.().toLowerCase?.();
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/deals', request.url));
      }
    }
  }

  // If user is trying to access a non-public, non-protected route without authentication
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ],
};
