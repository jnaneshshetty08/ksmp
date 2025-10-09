'use client';

import React, { useState, useEffect } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle, Calendar, MessageCircle } from 'lucide-react';

interface StudentStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  hoursStudied: number;
  currentStreak: number;
  upcomingSessions: number;
  pendingAssignments: number;
  overallProgress: number;
  recent: Array<{
    id: string;
    title: string;
    type: string;
    date: string;
    status: string;
  }>;
}

export default function StudentDashboard() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'student' });
  const [stats, setStats] = useState<StudentStats>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    hoursStudied: 0,
    currentStreak: 0,
    upcomingSessions: 0,
    pendingAssignments: 0,
    overallProgress: 0,
    recent: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        coursesEnrolled: 3,
        coursesCompleted: 1,
        hoursStudied: 45,
        currentStreak: 7,
        upcomingSessions: 2,
        pendingAssignments: 3,
        overallProgress: 65,
        recent: [
          {
            id: '1',
            title: 'JavaScript Fundamentals',
            type: 'Course',
            date: '2024-01-15',
            status: 'completed'
          },
          {
            id: '2',
            title: 'React Development',
            type: 'Course',
            date: '2024-01-14',
            status: 'in-progress'
          },
          {
            id: '3',
            title: 'Mentor Session',
            type: 'Session',
            date: '2024-01-13',
            status: 'completed'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch student data:', error);
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
      title: 'Courses Enrolled',
      value: stats.coursesEnrolled.toString(),
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      change: '+1 this month',
      changeType: 'positive' as const,
    },
    {
      title: 'Courses Completed',
      value: stats.coursesCompleted.toString(),
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      change: '1 completed',
      changeType: 'positive' as const,
    },
    {
      title: 'Hours Studied',
      value: stats.hoursStudied.toString(),
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      change: '+12h this week',
      changeType: 'positive' as const,
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      change: 'Keep it up!',
      changeType: 'positive' as const,
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions.toString(),
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      change: 'This week',
      changeType: 'neutral' as const,
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments.toString(),
      icon: <Award className="w-8 h-8 text-red-600" />,
      change: 'Due soon',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {user?.name}. Here's your learning progress overview.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Overall Progress
              </h2>
              <span className="text-2xl font-bold text-primary-600">
                {stats.overallProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Great progress! You're on track to complete your learning goals.
            </p>
          </div>
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
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {stats.recent.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.type} • {activity.date}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : activity.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Play className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Continue Learning</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Calendar className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Schedule Session</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Award className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-gray-900 dark:text-white">View Assignments</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <MessageCircle className="w-5 h-5 text-orange-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Contact Mentor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
