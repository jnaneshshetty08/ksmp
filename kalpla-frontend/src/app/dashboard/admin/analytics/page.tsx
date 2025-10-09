'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BarChart3, TrendingUp, Users, Clock, DollarSign, Award, Calendar, Download, Filter, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  totalMentors: number;
  totalPrograms: number;
  totalRevenue: number;
  monthlyGrowth: number;
  completionRate: number;
  averageRating: number;
  activeSessions: number;
}

interface ChartData {
  month: string;
  students: number;
  revenue: number;
  completions: number;
}

export default function AdminAnalyticsPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'admin' });
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudents: 0,
    totalMentors: 0,
    totalPrograms: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    completionRate: 0,
    averageRating: 0,
    activeSessions: 0
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'admin') {
      fetchAnalyticsData();
    }
  }, [user, authLoading, router, dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        totalStudents: 1250,
        totalMentors: 45,
        totalPrograms: 12,
        totalRevenue: 150000,
        monthlyGrowth: 12.5,
        completionRate: 88,
        averageRating: 4.7,
        activeSessions: 23
      });

      setChartData([
        { month: 'Jul', students: 850, revenue: 45000, completions: 120 },
        { month: 'Aug', students: 920, revenue: 52000, completions: 135 },
        { month: 'Sep', students: 980, revenue: 58000, completions: 145 },
        { month: 'Oct', students: 1050, revenue: 62000, completions: 155 },
        { month: 'Nov', students: 1120, revenue: 68000, completions: 165 },
        { month: 'Dec', students: 1250, revenue: 75000, completions: 180 }
      ]);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const topPrograms = [
    { name: 'Full Stack Development', students: 450, revenue: 58000, rating: 4.9 },
    { name: 'AI & Machine Learning', students: 320, revenue: 42000, rating: 4.8 },
    { name: 'Data Science', students: 280, revenue: 35000, rating: 4.7 },
    { name: 'Mobile Development', students: 200, revenue: 15000, rating: 4.6 }
  ];

  const recentActivity = [
    { type: 'enrollment', description: 'New student enrolled in Full Stack Development', time: '2 hours ago', count: 5 },
    { type: 'completion', description: 'Student completed AI & Machine Learning program', time: '4 hours ago', count: 3 },
    { type: 'payment', description: 'Payment received for Data Science program', time: '6 hours ago', count: 8 },
    { type: 'session', description: 'Live session completed with 15 participants', time: '8 hours ago', count: 1 }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{analyticsData.monthlyGrowth}% from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${analyticsData.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+8.2% from last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.completionRate}%</p>
                <p className="text-sm text-green-600">+2.1% from last month</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.averageRating}/5</p>
                <p className="text-sm text-green-600">+0.1 from last month</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 75000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">${data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Growth</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(data.students / 1250) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.students}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Programs and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Programs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performing Programs</h3>
            <div className="space-y-4">
              {topPrograms.map((program, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{program.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{program.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${program.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300 mr-1">{program.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < Math.floor(program.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'enrollment' ? 'bg-blue-500' :
                    activity.type === 'completion' ? 'bg-green-500' :
                    activity.type === 'payment' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                    {activity.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.activeSessions}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mentors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalMentors}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalPrograms}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
