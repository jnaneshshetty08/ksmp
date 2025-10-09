'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Users, Star, Clock, MessageSquare, Award, CheckCircle, ArrowRight, Calendar, Video, BookOpen } from 'lucide-react';

export default function MentorshipPage() {
  const mentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Full Stack Developer',
      company: 'Google',
      experience: '8+ years',
      rating: 4.9,
      students: 150,
      image: '/api/placeholder/150/150',
      specialties: ['React', 'Node.js', 'AWS', 'System Design'],
      bio: 'Passionate about teaching and helping developers grow. Former startup CTO with extensive experience in scaling applications.',
      availability: 'Available for 1:1 sessions'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'AI Research Scientist',
      company: 'OpenAI',
      experience: '10+ years',
      rating: 4.8,
      students: 200,
      image: '/api/placeholder/150/150',
      specialties: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
      bio: 'PhD in Computer Science with focus on AI. Published researcher and industry expert in machine learning applications.',
      availability: 'Available for group sessions'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Data Science Lead',
      company: 'Netflix',
      experience: '7+ years',
      rating: 4.9,
      students: 120,
      image: '/api/placeholder/150/150',
      specialties: ['Python', 'SQL', 'Data Visualization', 'A/B Testing'],
      bio: 'Data-driven professional with expertise in analytics and business intelligence. Loves mentoring aspiring data scientists.',
      availability: 'Available for career guidance'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'DevOps Engineer',
      company: 'Amazon',
      experience: '9+ years',
      rating: 4.7,
      students: 180,
      image: '/api/placeholder/150/150',
      specialties: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      bio: 'Infrastructure expert with deep knowledge of cloud platforms and automation. Passionate about teaching DevOps best practices.',
      availability: 'Available for technical reviews'
    }
  ];

  const mentorshipTypes = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: '1:1 Personal Mentorship',
      description: 'Get personalized guidance tailored to your specific goals and learning pace.',
      features: ['Weekly 1:1 sessions', 'Personalized learning plan', 'Direct feedback', 'Career guidance'],
      price: '$199/month'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: 'Group Mentorship',
      description: 'Learn alongside peers in small groups with shared learning objectives.',
      features: ['Small group sessions', 'Peer learning', 'Collaborative projects', 'Community support'],
      price: '$99/month'
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: 'Career Coaching',
      description: 'Focus on career advancement, interview prep, and professional development.',
      features: ['Resume review', 'Interview prep', 'Salary negotiation', 'Career planning'],
      price: '$149/month'
    }
  ];

  const benefits = [
    'Accelerated learning with expert guidance',
    'Personalized feedback on your projects',
    'Industry insights and best practices',
    'Networking opportunities with professionals',
    'Career advancement support',
    'Portfolio and resume optimization'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expert Mentorship Program
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Get personalized guidance from industry experts to accelerate your learning and career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/enroll"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                Start Your Mentorship Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#mentors"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Meet Our Mentors
              </Link>
            </div>
          </div>
        </section>

        {/* Mentorship Types */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your Mentorship Style
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We offer different mentorship formats to suit your learning style and goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mentorshipTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-6 flex justify-center">{type.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center">{type.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{type.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-4">{type.price}</div>
                    <Link
                      href="/enroll"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Our Mentorship Program?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our mentorship program is designed to provide you with the guidance and support you need to succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Mentors */}
        <section id="mentors" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Expert Mentors
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Learn from industry professionals with years of experience at top tech companies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{mentor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{mentor.title}</p>
                    <p className="text-sm text-primary-600 font-medium">{mentor.company}</p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {mentor.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {mentor.students} students
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{mentor.bio}</p>
                    <p className="text-xs text-primary-600 font-medium">{mentor.availability}</p>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/enroll"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-center block"
                  >
                    Book Session
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Our Mentorship Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our structured approach ensures you get the most out of your mentorship experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Schedule Session</h3>
                <p className="text-gray-600 dark:text-gray-300">Book a session with your preferred mentor at a time that works for you.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Meet & Discuss</h3>
                <p className="text-gray-600 dark:text-gray-300">Have a video call to discuss your goals, challenges, and learning path.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Learn & Practice</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive personalized guidance and work on projects with mentor feedback.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">4. Achieve Goals</h3>
                <p className="text-gray-600 dark:text-gray-300">Reach your learning objectives and advance your career with expert support.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students who have transformed their careers with our mentorship program.
            </p>
            <Link
              href="/enroll"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
            >
              Start Your Mentorship Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
