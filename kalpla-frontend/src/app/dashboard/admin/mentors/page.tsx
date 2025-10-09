'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Users, Search, Filter, MoreVertical, Edit, Trash2, Eye, Mail, Phone, Calendar, Star, Award, Clock, BookOpen } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  specialization: string[];
  rating: number;
  status: 'active' | 'inactive' | 'on-leave';
  studentsCount: number;
  sessionsCompleted: number;
  lastActive: string;
  bio: string;
  experience: string;
}

export default function AdminMentorsPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'admin' });
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'admin') {
      fetchMentors();
    }
  }, [user, authLoading, router]);

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMentors([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@kalpla.com',
          phone: '+1 (555) 123-4567',
          joinDate: '2023-06-15',
          specialization: ['React', 'Node.js', 'AWS'],
          rating: 4.9,
          status: 'active',
          studentsCount: 25,
          sessionsCompleted: 150,
          lastActive: '2024-01-20',
          bio: 'Senior Full Stack Developer with 8+ years of experience at Google.',
          experience: '8+ years'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@kalpla.com',
          phone: '+1 (555) 234-5678',
          joinDate: '2023-08-20',
          specialization: ['Python', 'Machine Learning', 'TensorFlow'],
          rating: 4.8,
          status: 'active',
          studentsCount: 30,
          sessionsCompleted: 200,
          lastActive: '2024-01-19',
          bio: 'AI Research Scientist with PhD in Computer Science.',
          experience: '10+ years'
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@kalpla.com',
          phone: '+1 (555) 345-6789',
          joinDate: '2023-09-10',
          specialization: ['Data Science', 'SQL', 'Tableau'],
          rating: 4.7,
          status: 'on-leave',
          studentsCount: 20,
          sessionsCompleted: 120,
          lastActive: '2024-01-15',
          bio: 'Data Science Lead at Netflix with expertise in analytics.',
          experience: '7+ years'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || mentor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentors(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedMentors(
      selectedMentors.length === filteredMentors.length 
        ? [] 
        : filteredMentors.map(m => m.id)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Mentors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Mentor Management</h1>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
            Add New Mentor
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Mentors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mentors.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Mentors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mentors.filter(m => m.status === 'active').length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(mentors.reduce((acc, m) => acc + m.rating, 0) / mentors.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mentors.reduce((acc, m) => acc + m.sessionsCompleted, 0)}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
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
                  placeholder="Search mentors..."
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
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMentors.includes(mentor.id)}
                    onChange={() => handleSelectMentor(mentor.id)}
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

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{mentor.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.email}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{mentor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Students</span>
                  <span className="font-semibold">{mentor.studentsCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sessions</span>
                  <span className="font-semibold">{mentor.sessionsCompleted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Experience</span>
                  <span className="font-semibold">{mentor.experience}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {mentor.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  mentor.status === 'active' ? 'bg-green-100 text-green-800' :
                  mentor.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {mentor.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{mentor.bio}</p>

              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                  View Profile
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedMentors.length > 0 && (
          <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700 dark:text-primary-300">
                {selectedMentors.length} mentor(s) selected
              </span>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Bulk Actions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
