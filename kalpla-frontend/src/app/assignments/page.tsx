'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BookOpen, Search, Filter, MoreVertical, Eye, Clock, CheckCircle, Star, Calendar, User, Tag, Download } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  program: string;
  module: string;
  instructor: string;
  dueDate: string;
  maxGrade: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'project' | 'quiz' | 'essay' | 'coding';
  tags: string[];
  estimatedTime: string;
  submissions: number;
  averageGrade: number;
  status: 'available' | 'upcoming' | 'closed';
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments([
        {
          id: '1',
          title: 'Build a React Todo Application',
          description: 'Create a complete todo application using React with state management, local storage, and responsive design.',
          program: 'Full Stack Development',
          module: 'React Fundamentals',
          instructor: 'Sarah Johnson',
          dueDate: '2024-02-15',
          maxGrade: 100,
          difficulty: 'intermediate',
          type: 'project',
          tags: ['React', 'State Management', 'Local Storage', 'Responsive Design'],
          estimatedTime: '8-12 hours',
          submissions: 45,
          averageGrade: 87,
          status: 'available'
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals Quiz',
          description: 'Test your knowledge of JavaScript fundamentals including variables, functions, objects, and ES6 features.',
          program: 'Full Stack Development',
          module: 'JavaScript Basics',
          instructor: 'David Kim',
          dueDate: '2024-02-10',
          maxGrade: 50,
          difficulty: 'beginner',
          type: 'quiz',
          tags: ['JavaScript', 'Variables', 'Functions', 'ES6'],
          estimatedTime: '1-2 hours',
          submissions: 78,
          averageGrade: 92,
          status: 'available'
        },
        {
          id: '3',
          title: 'Data Analysis Report',
          description: 'Analyze the provided dataset and write a comprehensive report with insights and visualizations.',
          program: 'Data Science',
          module: 'Data Analysis',
          instructor: 'Emily Rodriguez',
          dueDate: '2024-02-20',
          maxGrade: 100,
          difficulty: 'intermediate',
          type: 'essay',
          tags: ['Data Analysis', 'Python', 'Pandas', 'Visualization'],
          estimatedTime: '6-8 hours',
          submissions: 32,
          averageGrade: 84,
          status: 'available'
        },
        {
          id: '4',
          title: 'Machine Learning Model Implementation',
          description: 'Implement a classification model using scikit-learn and evaluate its performance.',
          program: 'AI & Machine Learning',
          module: 'ML Implementation',
          instructor: 'Michael Chen',
          dueDate: '2024-02-25',
          maxGrade: 100,
          difficulty: 'advanced',
          type: 'coding',
          tags: ['Machine Learning', 'Scikit-learn', 'Classification', 'Evaluation'],
          estimatedTime: '10-15 hours',
          submissions: 28,
          averageGrade: 79,
          status: 'available'
        },
        {
          id: '5',
          title: 'CSS Grid Layout Challenge',
          description: 'Create responsive layouts using CSS Grid for different screen sizes.',
          program: 'Full Stack Development',
          module: 'CSS Advanced',
          instructor: 'David Kim',
          dueDate: '2024-02-12',
          maxGrade: 75,
          difficulty: 'intermediate',
          type: 'project',
          tags: ['CSS', 'Grid', 'Responsive', 'Layout'],
          estimatedTime: '4-6 hours',
          submissions: 56,
          averageGrade: 88,
          status: 'available'
        },
        {
          id: '6',
          title: 'Database Design Project',
          description: 'Design a normalized database schema for an e-commerce application.',
          program: 'Full Stack Development',
          module: 'Database Design',
          instructor: 'Sarah Johnson',
          dueDate: '2024-02-18',
          maxGrade: 100,
          difficulty: 'intermediate',
          type: 'project',
          tags: ['Database', 'SQL', 'Normalization', 'Schema Design'],
          estimatedTime: '6-8 hours',
          submissions: 41,
          averageGrade: 85,
          status: 'available'
        },
        {
          id: '7',
          title: 'Mobile App Prototype',
          description: 'Create a mobile app prototype using React Native with navigation and state management.',
          program: 'Mobile Development',
          module: 'React Native',
          instructor: 'Alex Thompson',
          dueDate: '2024-02-22',
          maxGrade: 100,
          difficulty: 'advanced',
          type: 'project',
          tags: ['React Native', 'Mobile', 'Navigation', 'State Management'],
          estimatedTime: '12-16 hours',
          submissions: 23,
          averageGrade: 82,
          status: 'available'
        },
        {
          id: '8',
          title: 'AWS Deployment Guide',
          description: 'Write a comprehensive guide for deploying a web application to AWS.',
          program: 'Cloud & DevOps',
          module: 'AWS Deployment',
          instructor: 'Maria Garcia',
          dueDate: '2024-02-28',
          maxGrade: 100,
          difficulty: 'intermediate',
          type: 'essay',
          tags: ['AWS', 'Deployment', 'DevOps', 'Cloud'],
          estimatedTime: '5-7 hours',
          submissions: 19,
          averageGrade: 86,
          status: 'available'
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
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProgram = filterProgram === 'all' || assignment.program === filterProgram;
    const matchesType = filterType === 'all' || assignment.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || assignment.difficulty === filterDifficulty;
    return matchesSearch && matchesProgram && matchesType && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'submissions':
        return b.submissions - a.submissions;
      default:
        return 0;
    }
  });

  const programs = ['all', 'Full Stack Development', 'Data Science', 'AI & Machine Learning', 'Mobile Development', 'Cloud & DevOps'];
  const types = ['all', 'project', 'quiz', 'essay', 'coding'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'essay': return <BookOpen className="w-4 h-4" />;
      case 'coding': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Assignments...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Assignments
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Practice your skills with hands-on assignments designed to reinforce your learning and build real-world experience.
            </p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {programs.map(program => (
                    <option key={program} value={program}>
                      {program === 'all' ? 'All Programs' : program}
                    </option>
                  ))}
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="submissions">Popularity</option>
                </select>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Assignments Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredAssignments.length} Assignments Found
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredAssignments.length} of {assignments.length} assignments
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(assignment.type)}
                        <span className="text-sm font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                          {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                        </span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        assignment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assignment.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{assignment.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{assignment.instructor}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <BookOpen className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{assignment.module}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{assignment.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <span className="mr-4">Max Grade: {assignment.maxGrade}</span>
                        <span>Avg: {assignment.averageGrade}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{assignment.submissions} submissions</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {assignment.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {assignment.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{assignment.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Assignment
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No assignments found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
