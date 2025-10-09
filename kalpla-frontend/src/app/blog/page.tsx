'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Clock, Tag, Search, Filter } from 'lucide-react';

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: 'The Future of Online Learning: Trends and Predictions for 2024',
    excerpt: 'Explore the latest trends in online education, from AI-powered personalization to immersive learning experiences that are shaping the future of how we learn.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Education Technology',
    image: '/api/placeholder/800/400',
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: 'How to Build a Successful Career in Data Science',
      excerpt: 'A comprehensive guide to starting and advancing your career in data science, including essential skills, learning paths, and industry insights.',
      author: 'Michael Chen',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'Career Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'React vs Vue: Which Framework Should You Choose in 2024?',
      excerpt: 'An in-depth comparison of React and Vue.js, helping developers make informed decisions about their frontend framework choice.',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '10 min read',
      category: 'Web Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'The Rise of AI in Education: Opportunities and Challenges',
      excerpt: 'Examining how artificial intelligence is transforming education and the opportunities and challenges it presents for learners and educators.',
      author: 'David Kim',
      date: '2024-01-08',
      readTime: '7 min read',
      category: 'Artificial Intelligence',
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Mastering the Art of Remote Work: Tips for Developers',
      excerpt: 'Essential tips and strategies for developers working remotely, from productivity hacks to maintaining work-life balance.',
      author: 'Lisa Wang',
      date: '2024-01-05',
      readTime: '5 min read',
      category: 'Career Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Building Scalable Web Applications: Best Practices',
      excerpt: 'Learn the key principles and best practices for building web applications that can scale with your growing user base.',
      author: 'Alex Thompson',
      date: '2024-01-03',
      readTime: '9 min read',
      category: 'Web Development',
      image: '/api/placeholder/400/250'
    },
    {
      id: 7,
      title: 'The Complete Guide to Machine Learning Algorithms',
      excerpt: 'A comprehensive overview of machine learning algorithms, from supervised to unsupervised learning, with practical examples.',
      author: 'Maria Garcia',
      date: '2024-01-01',
      readTime: '12 min read',
      category: 'Machine Learning',
      image: '/api/placeholder/400/250'
    }
  ];

  const categories = [
    'All Posts',
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Career Development',
    'Education Technology'
  ];

  const popularTags = [
    'React', 'JavaScript', 'Python', 'AI', 'Machine Learning', 'Career', 'Tutorial', 'Tips', 'Best Practices', 'Industry Trends'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kalpla Blog
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Insights, tutorials, and industry trends to help you stay ahead in your learning journey and career development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-3 rounded-lg text-gray-900 w-full sm:w-80"
                />
              </div>
              <button className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Article
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">K</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Read Full Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories and Tags */}
        <section className="py-10 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories */}
              <div className="lg:w-1/4">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="lg:w-1/4">
                <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts */}
              <div className="lg:w-1/2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">K</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <Link
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
                        >
                          Read More
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Subscribe to our newsletter and never miss an update on the latest trends, tutorials, and insights.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
              />
              <button className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-r-lg font-semibold transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Put the knowledge from our blog into practice with our comprehensive learning programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
              >
                Explore Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/enroll"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Start Learning Today
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
