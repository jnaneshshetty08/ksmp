'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Clock, Users, Star, Award, ArrowRight, BookOpen, Code, Brain, Database, Smartphone } from 'lucide-react';

export default function ProgramsPage() {
  const programs = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, and databases. Build real-world applications.',
      duration: '6 months',
      students: '2,500+',
      rating: 4.9,
      level: 'Beginner to Advanced',
      price: '$1,299',
      originalPrice: '$1,999',
      icon: <Code className="w-8 h-8 text-blue-500" />,
      features: ['React & Next.js', 'Node.js & Express', 'MongoDB & PostgreSQL', 'Deployment & DevOps', 'Portfolio Projects'],
      category: 'Web Development'
    },
    {
      id: 2,
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Dive deep into AI/ML with hands-on projects, neural networks, and real-world applications.',
      duration: '8 months',
      students: '1,800+',
      rating: 4.8,
      level: 'Intermediate to Advanced',
      price: '$1,599',
      originalPrice: '$2,299',
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      features: ['Python & TensorFlow', 'Neural Networks', 'Computer Vision', 'NLP', 'AI Ethics'],
      category: 'AI & Machine Learning'
    },
    {
      id: 3,
      title: 'Data Science & Analytics',
      description: 'Transform data into insights with Python, SQL, and advanced analytics techniques.',
      duration: '5 months',
      students: '1,200+',
      rating: 4.7,
      level: 'Beginner to Intermediate',
      price: '$1,199',
      originalPrice: '$1,699',
      icon: <Database className="w-8 h-8 text-green-500" />,
      features: ['Python & Pandas', 'SQL & NoSQL', 'Data Visualization', 'Statistical Analysis', 'Business Intelligence'],
      category: 'Data Science'
    },
    {
      id: 4,
      title: 'Mobile App Development',
      description: 'Create stunning mobile apps for iOS and Android using React Native and Flutter.',
      duration: '4 months',
      students: '900+',
      rating: 4.6,
      level: 'Beginner to Advanced',
      price: '$999',
      originalPrice: '$1,399',
      icon: <Smartphone className="w-8 h-8 text-orange-500" />,
      features: ['React Native', 'Flutter', 'iOS & Android', 'App Store Deployment', 'UI/UX Design'],
      category: 'Mobile Development'
    },
    {
      id: 5,
      title: 'Cloud Computing & DevOps',
      description: 'Master cloud platforms, containerization, and DevOps practices for scalable applications.',
      duration: '6 months',
      students: '800+',
      rating: 4.8,
      level: 'Intermediate to Advanced',
      price: '$1,399',
      originalPrice: '$1,999',
      icon: <BookOpen className="w-8 h-8 text-teal-500" />,
      features: ['AWS & Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging'],
      category: 'Cloud & DevOps'
    },
    {
      id: 6,
      title: 'Cybersecurity Fundamentals',
      description: 'Learn to protect systems and data with comprehensive cybersecurity training.',
      duration: '5 months',
      students: '600+',
      rating: 4.7,
      level: 'Beginner to Intermediate',
      price: '$1,299',
      originalPrice: '$1,799',
      icon: <Award className="w-8 h-8 text-red-500" />,
      features: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response'],
      category: 'Cybersecurity'
    }
  ];

  const categories = ['All Programs', 'Web Development', 'AI & Machine Learning', 'Data Science', 'Mobile Development', 'Cloud & DevOps', 'Cybersecurity'];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              All Programs
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Discover our comprehensive range of programs designed to accelerate your career in technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {program.icon}
                      <span className="ml-3 text-sm font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {program.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{program.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {program.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {program.students}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {program.rating}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Level: </span>
                      <span className="text-sm font-medium">{program.level}</span>
                    </div>
                    
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {program.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">{program.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{program.originalPrice}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/program/${program.id}`}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Contact us to discuss custom programs or corporate training solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Us
              </Link>
              <Link
                href="/corporate"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Corporate Training
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
