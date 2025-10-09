'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BookOpen, Search, Filter, MoreVertical, Eye, Edit, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  student: string;
  studentId: string;
  program: string;
  dueDate: string;
  submittedDate?: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'overdue';
  grade?: number;
  maxGrade: number;
  feedback?: string;
  priority: 'low' | 'medium' | 'high';
  type: 'project' | 'quiz' | 'essay' | 'coding';
}

export default function MentorAssignmentsPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'mentor' });
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'mentor')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'mentor') {
      fetchAssignments();
    }
  }, [user, authLoading, router]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments([
        {
          id: '1',
          title: 'React Todo App',
          description: 'Build a complete todo application using React with state management',
          student: 'Alice Johnson',
          studentId: '1',
          program: 'Full Stack Development',
          dueDate: '2024-01-25',
          submittedDate: '2024-01-24',
          status: 'submitted',
          grade: undefined,
          maxGrade: 100,
          priority: 'high',
          type: 'project'
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals Quiz',
          description: 'Complete the JavaScript fundamentals quiz covering variables, functions, and objects',
          student: 'Bob Smith',
          studentId: '2',
          program: 'Full Stack Development',
          dueDate: '2024-01-22',
          status: 'overdue',
          grade: undefined,
          maxGrade: 50,
          priority: 'medium',
          type: 'quiz'
        },
        {
          id: '3',
          title: 'Data Analysis Report',
          description: 'Analyze the provided dataset and write a comprehensive report',
          student: 'Carol Davis',
          studentId: '3',
          program: 'Data Science',
          dueDate: '2024-01-30',
          status: 'pending',
          grade: undefined,
          maxGrade: 100,
          priority: 'medium',
          type: 'essay'
        },
        {
          id: '4',
          title: 'Machine Learning Model',
          description: 'Implement a classification model using scikit-learn',
          student: 'David Wilson',
          studentId: '4',
          program: 'AI & Machine Learning',
          dueDate: '2024-01-28',
          submittedDate: '2024-01-27',
          status: 'reviewed',
          grade: 85,
          maxGrade: 100,
          feedback: 'Great implementation! Consider adding more feature engineering.',
          priority: 'high',
          type: 'coding'
        },
        {
          id: '5',
          title: 'CSS Grid Layout',
          description: 'Create responsive layouts using CSS Grid',
          student: 'Alice Johnson',
          studentId: '1',
          program: 'Full Stack Development',
          dueDate: '2024-01-26',
          status: 'pending',
          grade: undefined,
          maxGrade: 75,
          priority: 'low',
          type: 'project'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || assignment.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId) 
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedAssignments(
      selectedAssignments.length === filteredAssignments.length 
        ? [] 
        : filteredAssignments.map(a => a.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'reviewed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'essay': return <Edit className="w-4 h-4" />;
      case 'coding': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Assignments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Assignment Management</h1>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
            Create Assignment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assignments.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter(a => a.status === 'submitted').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter(a => a.status === 'overdue').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter(a => a.status === 'reviewed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
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
                  placeholder="Search assignments..."
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
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="overdue">Overdue</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAssignments.includes(assignment.id)}
                    onChange={() => handleSelectAssignment(assignment.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-4"
                  />
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{assignment.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{assignment.student}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{assignment.program}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    {assignment.submittedDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(assignment.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{assignment.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max: {assignment.maxGrade} pts</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority} priority
                    </span>
                    {assignment.grade !== undefined && (
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        Grade: {assignment.grade}/{assignment.maxGrade}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {assignment.feedback && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Feedback:</strong> {assignment.feedback}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                {assignment.status === 'submitted' && (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    Review Assignment
                  </button>
                )}
                {assignment.status === 'pending' && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    Send Reminder
                  </button>
                )}
                {assignment.status === 'overdue' && (
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    Follow Up
                  </button>
                )}
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedAssignments.length > 0 && (
          <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700 dark:text-primary-300">
                {selectedAssignments.length} assignment(s) selected
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Bulk Review
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Send Reminders
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Export Grades
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
