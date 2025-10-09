'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { MapPin, Clock, Users, Heart, ArrowRight, CheckCircle, Star, Briefcase, Lightbulb, Globe } from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Join our engineering team to build scalable web applications and mentor junior developers.',
      requirements: [
        '5+ years of full-stack development experience',
        'Proficiency in React, Node.js, and databases',
        'Experience with cloud platforms (AWS, Azure)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget'
      ]
    },
    {
      id: 2,
      title: 'Data Science Instructor',
      department: 'Education',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Teach data science concepts and mentor students in our comprehensive programs.',
      requirements: [
        '3+ years of data science experience',
        'Strong background in Python, SQL, and ML',
        'Previous teaching or mentoring experience',
        'Excellent communication and presentation skills'
      ],
      benefits: [
        'Remote work flexibility',
        'Competitive compensation',
        'Learning and development opportunities',
        'Impact on student success'
      ]
    },
    {
      id: 3,
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Drive product marketing strategy and help scale our educational platform.',
      requirements: [
        '4+ years of product marketing experience',
        'Experience in EdTech or SaaS',
        'Strong analytical and creative skills',
        'Bachelor\'s degree in Marketing or related field'
      ],
      benefits: [
        'Competitive salary and bonus',
        'Comprehensive benefits package',
        'Stock options',
        'Career growth opportunities'
      ]
    },
    {
      id: 4,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Austin, TX',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Help our students and corporate clients achieve their learning goals.',
      requirements: [
        '2+ years of customer success experience',
        'Strong relationship-building skills',
        'Experience with CRM systems',
        'Passion for education and learning'
      ],
      benefits: [
        'Base salary + commission',
        'Health and wellness benefits',
        'Flexible PTO policy',
        'Team building events'
      ]
    }
  ];

  const companyValues = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Passion for Learning',
      description: 'We believe in the transformative power of education and are committed to making quality learning accessible to everyone.'
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: 'Collaborative Culture',
      description: 'We foster a supportive environment where team members learn from each other and grow together.'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: 'Innovation',
      description: 'We constantly explore new technologies and methodologies to improve the learning experience.'
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      title: 'Global Impact',
      description: 'We\'re building a platform that empowers learners worldwide to achieve their career goals.'
    }
  ];

  const benefits = [
    'Competitive salary and equity packages',
    'Comprehensive health, dental, and vision insurance',
    'Flexible work arrangements and remote options',
    'Professional development and learning budget',
    'Generous paid time off and holidays',
    'Stock options and performance bonuses',
    'Team building events and company retreats',
    'Modern office spaces with great amenities'
  ];

  const stats = [
    { number: '50+', label: 'Team Members' },
    { number: '15+', label: 'Countries' },
    { number: '10K+', label: 'Students Served' },
    { number: '95%', label: 'Employee Satisfaction' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Help us transform education and empower learners worldwide. Join a team that's passionate about making quality learning accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#positions"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                View Open Positions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                These core values guide everything we do and shape our company culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Work at Kalpla?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We offer competitive benefits and a supportive environment to help you thrive both personally and professionally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Open Positions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join our team and help us build the future of education. We're always looking for talented individuals who share our passion for learning.
              </p>
            </div>

            <div className="space-y-8">
              {openPositions.map((position) => (
                <div
                  key={position.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {position.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {position.type}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {position.experience}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <Link
                        href="/contact"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">{position.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Hiring Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We believe in a transparent and efficient hiring process that gives you the best chance to showcase your skills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Application</h3>
                <p className="text-gray-600 dark:text-gray-300">Submit your application and resume through our portal.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Initial Screening</h3>
                <p className="text-gray-600 dark:text-gray-300">Brief phone or video call to discuss your background and interests.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Technical Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300">Skills-based assessment relevant to the role you're applying for.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Final Interview</h3>
                <p className="text-gray-600 dark:text-gray-300">Meet the team and discuss how you'll contribute to our mission.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              We're always looking for talented individuals. Send us your resume and let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
              >
                Send Your Resume
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
