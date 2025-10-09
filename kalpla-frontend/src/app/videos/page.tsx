'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Play, Search, Filter, MoreVertical, Eye, Clock, CheckCircle, Star, BookOpen, Download, Calendar, User, Tag } from 'lucide-react';

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
  views: number;
  likes: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchVideos();
  }, []);

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
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-15',
          difficulty: 'beginner',
          tags: ['React', 'Components', 'JSX'],
          views: 1250,
          likes: 89
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
          tags: ['Redux', 'State Management', 'React'],
          views: 980,
          likes: 67
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
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-12',
          difficulty: 'beginner',
          tags: ['Python', 'Data Structures', 'Lists'],
          views: 2100,
          likes: 156
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
          tags: ['Machine Learning', 'Algorithms', 'AI'],
          views: 750,
          likes: 45
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
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-10',
          difficulty: 'intermediate',
          tags: ['CSS', 'Grid', 'Layout'],
          views: 1680,
          likes: 123
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
          tags: ['Database', 'SQL', 'Design'],
          views: 920,
          likes: 78
        },
        {
          id: '7',
          title: 'Mobile App Development with React Native',
          description: 'Build cross-platform mobile applications using React Native.',
          duration: '1:30:45',
          thumbnail: '/api/placeholder/300/200',
          program: 'Mobile Development',
          module: 'React Native',
          instructor: 'Alex Thompson',
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-19',
          difficulty: 'intermediate',
          tags: ['React Native', 'Mobile', 'Cross-platform'],
          views: 1100,
          likes: 82
        },
        {
          id: '8',
          title: 'AWS Cloud Computing Basics',
          description: 'Introduction to Amazon Web Services and cloud computing concepts.',
          duration: '1:25:15',
          thumbnail: '/api/placeholder/300/200',
          program: 'Cloud & DevOps',
          module: 'AWS Fundamentals',
          instructor: 'Maria Garcia',
          watched: false,
          watchProgress: 0,
          uploadedDate: '2024-01-17',
          difficulty: 'beginner',
          tags: ['AWS', 'Cloud', 'DevOps'],
          views: 1450,
          likes: 98
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
    return matchesSearch && matchesProgram && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
      case 'oldest':
        return new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime();
      case 'popular':
        return b.views - a.views;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      default:
        return 0;
    }
  });

  const programs = ['all', 'Full Stack Development', 'Data Science', 'AI & Machine Learning', 'Mobile Development', 'Cloud & DevOps'];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
          <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Videos...</div>
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
              Video Library
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Access our comprehensive collection of educational videos covering the latest technologies and best practices.
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="duration">Duration</option>
                </select>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredVideos.length} Videos Found
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {filteredVideos.length} of {videos.length} videos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{video.description}</p>

                    <div className="space-y-2 mb-3">
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

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {video.likes}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{video.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center justify-center">
                        <Play className="w-4 h-4 mr-2" />
                        Watch
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
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
        </section>
      </div>
    </Layout>
  );
}
