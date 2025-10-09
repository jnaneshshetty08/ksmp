import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard/admin': ['admin'],
  '/dashboard/mentor': ['mentor'],
  '/dashboard/student': ['student'],
  '/dashboard': ['admin', 'mentor', 'student'],
};

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Simulate authentication (replace with actual JWT verification)
  const token = request.cookies.get('jwt')?.value;
  const userRole = request.cookies.get('userRole')?.value; // Simulate user role

  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if the route is protected and if the user has the required role
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const requiredRoles = protectedRoutes[route];
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Redirect to an access denied page or home if role is not sufficient
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
