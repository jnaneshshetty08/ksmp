'use client';

import React, { useState, useEffect } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Users, BookOpen, Clock, Star, TrendingUp, MessageCircle, Calendar, Award } from 'lucide-react';

interface MentorStats {
  totalStudents: number;
  sessionsThisMonth: number;
  averageRating: number;
  hoursMentored: number;
  assignmentsPending: number;
  upcomingSessions: number;
  studentProgress: number;
  recent: Array<{
    id: string;
    studentName: string;
    sessionType: string;
    date: string;
    status: string;
  }>;
}

export default function MentorDashboard() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'mentor' });
  const [stats, setStats] = useState<MentorStats>({
    totalStudents: 0,
    sessionsThisMonth: 0,
    averageRating: 0,
    hoursMentored: 0,
    assignmentsPending: 0,
    upcomingSessions: 0,
    studentProgress: 0,
    recent: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'mentor') {
      fetchMentorData();
    }
  }, [user]);

  const fetchMentorData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalStudents: 24,
        sessionsThisMonth: 18,
        averageRating: 4.8,
        hoursMentored: 156,
        assignmentsPending: 5,
        upcomingSessions: 3,
        studentProgress: 78,
        recent: [
          {
            id: '1',
            studentName: 'Sarah Johnson',
            sessionType: '1-on-1',
            date: '2024-01-15',
            status: 'completed'
          },
          {
            id: '2',
            studentName: 'Mike Chen',
            sessionType: 'Group',
            date: '2024-01-14',
            status: 'completed'
          },
          {
            id: '3',
            studentName: 'Emily Davis',
            sessionType: '1-on-1',
            date: '2024-01-13',
            status: 'scheduled'
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch mentor data:', error);
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
      value: stats.totalStudents.toString(),
      icon: <Users className="w-8 h-8 text-blue-600" />,
      change: '+3 this month',
      changeType: 'positive' as const,
    },
    {
      title: 'Sessions This Month',
      value: stats.sessionsThisMonth.toString(),
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toString(),
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      change: '4.8/5.0',
      changeType: 'positive' as const,
    },
    {
      title: 'Hours Mentored',
      value: stats.hoursMentored.toString(),
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      change: '+24h',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Assignments',
      value: stats.assignmentsPending.toString(),
      icon: <BookOpen className="w-8 h-8 text-orange-600" />,
      change: 'Need review',
      changeType: 'neutral' as const,
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions.toString(),
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      change: 'This week',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mentor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Welcome back, {user?.name}. Here's your mentoring overview.
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Sessions
            </h2>
            <div className="space-y-4">
              {stats.recent.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.studentName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {session.sessionType} • {session.date}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {session.status}
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
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Schedule Session</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <BookOpen className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Review Assignments</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <MessageCircle className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-gray-900 dark:text-white">Student Messages</span>
              </button>
              <button className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Award className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-gray-900 dark:text-white">View Certificates</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
