'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseRoleAccessOptions {
  requiredRole?: 'admin' | 'mentor' | 'student';
  requireAuth?: boolean;
  redirectPath?: string;
}

interface UseRoleAccessReturn {
  user: any;
  isLoading: boolean;
  hasAccess: boolean;
}

export function useRoleAccess(options: UseRoleAccessOptions = {}): UseRoleAccessReturn {
  const { requiredRole, requireAuth = true, redirectPath = '/login' } = options;
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    const checkAccess = () => {
      if (requireAuth && !user) {
        router.push(redirectPath);
        return false;
      }

      if (requiredRole && user && user.role !== requiredRole) {
        router.push('/access-denied');
        return false;
      }
      return true;
    };

    setHasAccess(checkAccess());
    setIsLoading(false);
  }, [user, authLoading, requiredRole, requireAuth, redirectPath, router]);

  return { user, isLoading, hasAccess };
}

export function withRoleAccess<P extends object>(
  Component: React.ComponentType<P>,
  options: UseRoleAccessOptions = {}
) {
  return function RoleProtectedComponent(props: P) {
    const { hasAccess, isLoading } = useRoleAccess(options);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have permission to access this page.</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
