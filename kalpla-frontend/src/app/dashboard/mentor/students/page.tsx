'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Users, Search, Filter, MoreVertical, Eye, MessageSquare, Calendar, Star, Clock, BookOpen, Award, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  program: string;
  progress: number;
  lastActivity: string;
  assignmentsCompleted: number;
  totalAssignments: number;
  rating: number;
  status: 'active' | 'struggling' | 'excellent';
  nextSession: string;
  notes: string;
}

export default function MentorStudentsPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'mentor' });
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mentor')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'mentor') {
      fetchStudents();
    }
  }, [user, authLoading, router]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudents([
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice.johnson@email.com',
          enrollmentDate: '2024-01-15',
          program: 'Full Stack Development',
          progress: 85,
          lastActivity: '2024-01-20',
          assignmentsCompleted: 17,
          totalAssignments: 20,
          rating: 4.8,
          status: 'excellent',
          nextSession: '2024-01-25',
          notes: 'Excellent progress, ready for advanced topics'
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob.smith@email.com',
          enrollmentDate: '2024-01-10',
          program: 'Full Stack Development',
          progress: 45,
          lastActivity: '2024-01-18',
          assignmentsCompleted: 9,
          totalAssignments: 20,
          rating: 4.2,
          status: 'struggling',
          nextSession: '2024-01-22',
          notes: 'Needs extra help with React concepts'
        },
        {
          id: '3',
          name: 'Carol Davis',
          email: 'carol.davis@email.com',
          enrollmentDate: '2023-12-20',
          program: 'Data Science',
          progress: 70,
          lastActivity: '2024-01-19',
          assignmentsCompleted: 14,
          totalAssignments: 20,
          rating: 4.6,
          status: 'active',
          nextSession: '2024-01-24',
          notes: 'Good understanding of Python basics'
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david.wilson@email.com',
          enrollmentDate: '2024-01-05',
          program: 'AI & Machine Learning',
          progress: 30,
          lastActivity: '2024-01-17',
          assignmentsCompleted: 6,
          totalAssignments: 20,
          rating: 4.0,
          status: 'struggling',
          nextSession: '2024-01-21',
          notes: 'Requires additional support with mathematical concepts'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      selectedStudents.length === filteredStudents.length 
        ? [] 
        : filteredStudents.map(s => s.id)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">My Students</h1>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
            Schedule Session
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(students.reduce((acc, s) => acc + s.rating, 0) / students.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Struggling</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {students.filter(s => s.status === 'struggling').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="excellent">Excellent</option>
                <option value="active">Active</option>
                <option value="struggling">Struggling</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{student.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Program</span>
                  <span className="font-semibold">{student.program}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold">{student.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Assignments</span>
                  <span className="font-semibold">{student.assignmentsCompleted}/{student.totalAssignments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{student.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Next Session</span>
                  <span className="font-semibold">{new Date(student.nextSession).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  student.status === 'excellent' ? 'bg-green-100 text-green-800' :
                  student.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{student.notes}</p>

              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                  View Profile
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700 dark:text-primary-300">
                {selectedStudents.length} student(s) selected
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Send Message
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Schedule Group Session
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Export Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
