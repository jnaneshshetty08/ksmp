'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { CheckCircle, Clock, Users, Award, BookOpen, Play, Star } from 'lucide-react';

export default function ProgramPage() {
  const programFeatures = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Comprehensive Curriculum',
      description: 'Structured learning path covering all essential topics and skills.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals with real-world experience.',
    },
    {
      icon: <Play className="w-8 h-8 text-primary-600" />,
      title: 'Interactive Content',
      description: 'Engaging videos, quizzes, and hands-on projects.',
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Industry Certification',
      description: 'Earn recognized certificates upon completion.',
    },
  ];

  const modules = [
    {
      title: 'Foundation Building',
      duration: '4 weeks',
      description: 'Master the fundamentals and build a strong base for advanced learning.',
      topics: ['Basic Concepts', 'Tools & Setup', 'Best Practices', 'Project Planning'],
    },
    {
      title: 'Core Concepts',
      duration: '6 weeks',
      description: 'Dive deep into essential concepts and industry best practices.',
      topics: ['Advanced Techniques', 'Problem Solving', 'Code Quality', 'Testing'],
    },
    {
      title: 'Practical Application',
      duration: '8 weeks',
      description: 'Apply your knowledge through real-world projects and case studies.',
      topics: ['Project Development', 'Team Collaboration', 'Version Control', 'Deployment'],
    },
    {
      title: 'Advanced Techniques',
      duration: '6 weeks',
      description: 'Explore advanced topics and cutting-edge methodologies.',
      topics: ['Advanced Patterns', 'Performance Optimization', 'Security', 'Scalability'],
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'This program completely transformed my career. The mentorship was exceptional and the practical projects were exactly what I needed.',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Product Manager',
      content: 'The structured approach and expert guidance helped me transition into tech successfully. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Data Analyst',
      content: 'The hands-on learning approach and real-world projects prepared me perfectly for my current role.',
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Comprehensive Learning Program
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Master new skills with our structured curriculum, expert mentorship, and hands-on projects designed for real-world success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/enroll"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Enroll Now
              </Link>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive program covers everything you need to succeed in your chosen field.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Modules */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Program Modules
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A carefully structured learning path that takes you from beginner to expert level.
            </p>
          </div>

          <div className="space-y-8">
            {modules.map((module, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    {module.duration}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful learners and transform your career today.
          </p>
          <Link
            href="/enroll"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            Enroll Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
