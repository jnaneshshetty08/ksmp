'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Play, Search, Filter, MoreVertical, Eye, Clock, CheckCircle, Star, BookOpen, Download, Calendar, User } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  program: string;
  module: string;
  instructor: string;
  watched: boolean;
  watchProgress: number;
  rating?: number;
  uploadedDate: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export default function StudentVideosPage() {
  const { user, isLoading: authLoading } = useRoleAccess({ requiredRole: 'student' });
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterWatched, setFilterWatched] = useState('all');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) {
      router.push('/access-denied');
      return;
    }

    if (user && user.role === 'student') {
      fetchVideos();
    }
  }, [user, authLoading, router]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVideos([
        {
          id: '1',
          title: 'Introduction to React Components',
          description: 'Learn the fundamentals of React components and how to build reusable UI elements.',
          duration: '45:30',
          thumbnail: '/api/placeholder/300/200',
          program: 'Full Stack Development',
          module: 'React Fundamentals',
          instructor: 'Sarah Johnson',
          watched: true,
          watchProgress: 100,
          rating: 5,
          uploadedDate: '2024-01-15',
          difficulty: 'beginner',
          tags: ['React', 'Components', 'JSX']
        },
        {
          id: '2',
          title: 'State Management with Redux',
          description: 'Master Redux for managing complex application state in React applications.',
          duration: '1:20:15',
          thumbnail: '/api/placeholder/300/200',
          program: 'Full Stack Development',
          module: 'Advanced React',
          instructor: 'Sarah Johnson',
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-18',
          difficulty: 'intermediate',
          tags: ['Redux', 'State Management', 'React']
        },
        {
          id: '3',
          title: 'Python Data Structures',
          description: 'Deep dive into Python data structures including lists, dictionaries, and sets.',
          duration: '38:45',
          thumbnail: '/api/placeholder/300/200',
          program: 'Data Science',
          module: 'Python Basics',
          instructor: 'Emily Rodriguez',
          watched: true,
          watchProgress: 75,
          rating: 4,
          uploadedDate: '2024-01-12',
          difficulty: 'beginner',
          tags: ['Python', 'Data Structures', 'Lists']
        },
        {
          id: '4',
          title: 'Machine Learning Algorithms',
          description: 'Introduction to supervised and unsupervised machine learning algorithms.',
          duration: '1:45:20',
          thumbnail: '/api/placeholder/300/200',
          program: 'AI & Machine Learning',
          module: 'ML Fundamentals',
          instructor: 'Michael Chen',
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-20',
          difficulty: 'advanced',
          tags: ['Machine Learning', 'Algorithms', 'AI']
        },
        {
          id: '5',
          title: 'CSS Grid Layout System',
          description: 'Master CSS Grid for creating complex, responsive layouts.',
          duration: '52:10',
          thumbnail: '/api/placeholder/300/200',
          program: 'Full Stack Development',
          module: 'CSS Advanced',
          instructor: 'David Kim',
          watched: true,
          watchProgress: 100,
          rating: 5,
          uploadedDate: '2024-01-10',
          difficulty: 'intermediate',
          tags: ['CSS', 'Grid', 'Layout']
        },
        {
          id: '6',
          title: 'Database Design Principles',
          description: 'Learn essential database design principles and normalization techniques.',
          duration: '1:15:30',
          thumbnail: '/api/placeholder/300/200',
          program: 'Full Stack Development',
          module: 'Database Design',
          instructor: 'Sarah Johnson',
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-22',
          difficulty: 'intermediate',
          tags: ['Database', 'SQL', 'Design']
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProgram = filterProgram === 'all' || video.program === filterProgram;
    const matchesDifficulty = filterDifficulty === 'all' || video.difficulty === filterDifficulty;
    const matchesWatched = filterWatched === 'all' || 
                          (filterWatched === 'watched' && video.watched) ||
                          (filterWatched === 'unwatched' && !video.watched);
    return matchesSearch && matchesProgram && matchesDifficulty && matchesWatched;
  });

  const programs = ['all', 'Full Stack Development', 'Data Science', 'AI & Machine Learning', 'Mobile Development'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">Video Library</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {videos.filter(v => v.watched).length} of {videos.length} videos watched
            </div>
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${(videos.filter(v => v.watched).length / videos.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{videos.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Watched</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {videos.filter(v => v.watched).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {videos.filter(v => v.watchProgress > 0 && v.watchProgress < 100).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(videos.filter(v => v.rating).reduce((acc, v) => acc + (v.rating || 0), 0) / videos.filter(v => v.rating).length).toFixed(1) || 'N/A'}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
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
                  placeholder="Search videos..."
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
                value={filterWatched}
                onChange={(e) => setFilterWatched(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Videos</option>
                <option value="watched">Watched</option>
                <option value="unwatched">Unwatched</option>
              </select>
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    video.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    video.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {video.difficulty}
                  </span>
                </div>
                {video.watched && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{video.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">{video.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">{video.module}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">{new Date(video.uploadedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {video.watchProgress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Progress</span>
                      <span className="text-gray-600 dark:text-gray-300">{video.watchProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${video.watchProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {video.rating && (
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < video.rating! ? 'text-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">({video.rating}/5)</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    {video.watched ? 'Rewatch' : 'Watch Now'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No videos found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
