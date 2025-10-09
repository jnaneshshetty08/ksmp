'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, Users, BookOpen, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'mentor':
          router.push('/dashboard/mentor');
          break;
        case 'student':
          router.push('/dashboard/student');
          break;
        default:
          router.push('/login');
      }
    } else if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-8">
          <BarChart3 className="w-12 h-12 text-primary-600" />
          <Users className="w-12 h-12 text-primary-600" />
          <BookOpen className="w-12 h-12 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Kalpla Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Redirecting you to your personalized dashboard...
        </p>
      </div>
    </div>
  );
}
