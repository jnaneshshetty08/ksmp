'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { BookOpen, Search, Filter, MoreVertical, Edit, Trash2, Eye, Plus, Users, Clock, Award, TrendingUp, DollarSign } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  originalPrice: number;
  studentsEnrolled: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  modules: number;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export default function AdminProgramsPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'admin' });
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'admin') {
      fetchPrograms();
    }
  }, [user, authLoading, router]);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPrograms([
        {
          id: '1',
          title: 'Full Stack Web Development',
          description: 'Master modern web development with React, Node.js, and databases. Build real-world applications.',
          category: 'Web Development',
          duration: '6 months',
          price: 1299,
          originalPrice: 1999,
          studentsEnrolled: 2500,
          rating: 4.9,
          status: 'active',
          createdAt: '2023-06-15',
          updatedAt: '2024-01-15',
          modules: 12,
          instructor: 'Sarah Johnson',
          level: 'beginner'
        },
        {
          id: '2',
          title: 'Artificial Intelligence & Machine Learning',
          description: 'Dive deep into AI/ML with hands-on projects, neural networks, and real-world applications.',
          category: 'AI & Machine Learning',
          duration: '8 months',
          price: 1599,
          originalPrice: 2299,
          studentsEnrolled: 1800,
          rating: 4.8,
          status: 'active',
          createdAt: '2023-07-20',
          updatedAt: '2024-01-10',
          modules: 16,
          instructor: 'Michael Chen',
          level: 'intermediate'
        },
        {
          id: '3',
          title: 'Data Science & Analytics',
          description: 'Transform data into insights with Python, SQL, and advanced analytics techniques.',
          category: 'Data Science',
          duration: '5 months',
          price: 1199,
          originalPrice: 1699,
          studentsEnrolled: 1200,
          rating: 4.7,
          status: 'active',
          createdAt: '2023-08-10',
          updatedAt: '2024-01-05',
          modules: 10,
          instructor: 'Emily Rodriguez',
          level: 'beginner'
        },
        {
          id: '4',
          title: 'Mobile App Development',
          description: 'Create stunning mobile apps for iOS and Android using React Native and Flutter.',
          category: 'Mobile Development',
          duration: '4 months',
          price: 999,
          originalPrice: 1399,
          studentsEnrolled: 900,
          rating: 4.6,
          status: 'draft',
          createdAt: '2023-09-05',
          updatedAt: '2024-01-01',
          modules: 8,
          instructor: 'David Kim',
          level: 'intermediate'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || program.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || program.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectProgram = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPrograms(
      selectedPrograms.length === filteredPrograms.length 
        ? [] 
        : filteredPrograms.map(p => p.id)
    );
  };

  const categories = ['all', 'Web Development', 'AI & Machine Learning', 'Data Science', 'Mobile Development', 'Cloud & DevOps', 'Cybersecurity'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Programs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Program Management</h1>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create New Program
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{programs.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {programs.filter(p => p.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {programs.reduce((acc, p) => acc + p.studentsEnrolled, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(programs.reduce((acc, p) => acc + p.rating, 0) / programs.length).toFixed(1)}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
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
                  placeholder="Search programs..."
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
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPrograms.includes(program.id)}
                      onChange={() => handleSelectProgram(program.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
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

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                      {program.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      program.status === 'active' ? 'bg-green-100 text-green-800' :
                      program.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{program.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{program.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="font-semibold">{program.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Modules</span>
                    <span className="font-semibold">{program.modules}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Students</span>
                    <span className="font-semibold">{program.studentsEnrolled.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Rating</span>
                    <span className="font-semibold">{program.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Instructor</span>
                    <span className="font-semibold">{program.instructor}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    program.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    program.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {program.level}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-primary-600">${program.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">${program.originalPrice}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    Edit Program
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedPrograms.length > 0 && (
          <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700 dark:text-primary-300">
                {selectedPrograms.length} program(s) selected
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Publish
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Archive
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
