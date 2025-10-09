'use client';

import React, { useState, useEffect } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BarChart3, Users, BookOpen, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  activeMentors: number;
  totalPrograms: number;
  completedSessions: number;
  pendingAssignments: number;
  totalRevenue: number;
  monthlyGrowth: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'admin' });
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeMentors: 0,
    totalPrograms: 0,
    completedSessions: 0,
    pendingAssignments: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 1247,
        activeMentors: 89,
        totalPrograms: 12,
        completedSessions: 3456,
        pendingAssignments: 23,
        totalRevenue: 125000,
        monthlyGrowth: 15.2,
        completionRate: 87.5
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: <Users className="w-8 h-8 text-blue-600" />,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Mentors',
      value: stats.activeMentors.toString(),
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Programs',
      value: stats.totalPrograms.toString(),
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions.toLocaleString(),
      icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments.toString(),
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      change: '-3',
      changeType: 'negative' as const,
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      change: `+${stats.monthlyGrowth}%`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {user?.name}. Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {stat.icon}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Manage Users
              </span>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Create Program
              </span>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                View Analytics
              </span>
            </button>
            <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                System Alerts
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
