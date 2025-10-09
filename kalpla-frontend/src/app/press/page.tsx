'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Calendar, ExternalLink, Download, Mail, Phone, MapPin, ArrowRight, Newspaper, Award, Users, TrendingUp } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      id: 1,
      title: 'Kalpla Raises $10M Series A to Expand Global Learning Platform',
      date: '2024-01-15',
      summary: 'Funding will accelerate product development and international expansion to make quality education accessible worldwide.',
      category: 'Funding',
      featured: true
    },
    {
      id: 2,
      title: 'Kalpla Partners with Leading Universities for Credit Transfer Program',
      date: '2024-01-10',
      summary: 'New partnership enables students to earn college credits through Kalpla\'s industry-focused programs.',
      category: 'Partnerships'
    },
    {
      id: 3,
      title: 'Kalpla Launches AI-Powered Personalized Learning Assistant',
      date: '2024-01-05',
      summary: 'Revolutionary AI technology provides personalized learning paths and real-time feedback for students.',
      category: 'Product Launch'
    },
    {
      id: 4,
      title: 'Kalpla Achieves 100,000 Student Milestone',
      date: '2023-12-20',
      summary: 'Platform celebrates reaching 100,000 enrolled students across 50+ countries worldwide.',
      category: 'Milestone'
    }
  ];

  const mediaCoverage = [
    {
      outlet: 'TechCrunch',
      title: 'EdTech Startup Kalpla Raises $10M to Democratize Technical Education',
      date: '2024-01-16',
      link: '#',
      logo: '/api/placeholder/150/50'
    },
    {
      outlet: 'Forbes',
      title: 'How Kalpla is Revolutionizing Online Learning with AI',
      date: '2024-01-12',
      link: '#',
      logo: '/api/placeholder/150/50'
    },
    {
      outlet: 'EdSurge',
      title: 'Kalpla\'s Personalized Learning Approach Shows Promise for Student Success',
      date: '2024-01-08',
      link: '#',
      logo: '/api/placeholder/150/50'
    },
    {
      outlet: 'VentureBeat',
      title: 'Kalpla Secures Series A Funding to Scale Global Education Platform',
      date: '2024-01-06',
      link: '#',
      logo: '/api/placeholder/150/50'
    }
  ];

  const awards = [
    {
      title: 'Best EdTech Platform 2024',
      organization: 'EdTech Awards',
      date: '2024-01-20',
      description: 'Recognized for innovation in online learning and student outcomes.'
    },
    {
      title: 'Top 50 Startups to Watch',
      organization: 'TechCrunch',
      date: '2023-12-15',
      description: 'Featured in annual list of most promising technology startups.'
    },
    {
      title: 'Excellence in Education Technology',
      organization: 'Global EdTech Summit',
      date: '2023-11-30',
      description: 'Awarded for outstanding contribution to educational technology.'
    }
  ];

  const companyStats = [
    { number: '100K+', label: 'Students Enrolled' },
    { number: '50+', label: 'Countries' },
    { number: '200+', label: 'Expert Instructors' },
    { number: '95%', label: 'Student Satisfaction' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      title: 'CEO & Co-Founder',
      bio: 'Former Google engineer with 10+ years in EdTech. Passionate about making quality education accessible to everyone.',
      email: 'sarah@kalpla.com',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Chen',
      title: 'CTO & Co-Founder',
      bio: 'AI researcher and former Microsoft engineer. Expert in machine learning and educational technology.',
      email: 'michael@kalpla.com',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Emily Rodriguez',
      title: 'VP of Education',
      bio: 'Former university professor and curriculum designer. Focused on creating engaging learning experiences.',
      email: 'emily@kalpla.com',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest news, announcements, and media coverage about Kalpla's mission to democratize education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#press-releases"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                Latest News
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Media Inquiries
              </Link>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Kalpla by the Numbers
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our impact in transforming education worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {companyStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section id="press-releases" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Press Releases
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Official announcements and company news.
              </p>
            </div>

            <div className="space-y-8">
              {pressReleases.map((release) => (
                <div
                  key={release.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 ${
                    release.featured ? 'border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {release.category}
                      </span>
                      {release.featured && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(release.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{release.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{release.summary}</p>
                  
                  <div className="flex space-x-4">
                    <Link
                      href={`/press/${release.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Read Full Release
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    <button className="inline-flex items-center text-gray-600 hover:text-gray-700">
                      <Download className="w-4 h-4 mr-1" />
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Coverage */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Media Coverage
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                What the media is saying about Kalpla.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mediaCoverage.map((article, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mr-4">
                      <Newspaper className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{article.outlet}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3">{article.title}</h3>
                  
                  <a
                    href={article.link}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Read Article
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Awards & Recognition
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Industry recognition for our commitment to educational excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4 flex justify-center">
                    <Award className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                  <p className="text-primary-600 font-semibold mb-2">{award.organization}</p>
                  <p className="text-sm text-gray-500 mb-3">{new Date(award.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Leadership Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Meet the leaders driving Kalpla's mission to democratize education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{member.title}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Kit */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Press Kit
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Download our press kit for logos, images, and company information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <Download className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Company Logo</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">High-resolution logos in various formats</p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                  Download
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Team Photos</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Professional headshots and team photos</p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                  Download
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Company Facts</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Key statistics and company information</p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200">
                  Download
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Media Inquiries
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              For press inquiries, interviews, or media requests, please contact our press team.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center">
                <Mail className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-primary-200">press@kalpla.com</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-primary-200">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-6 h-6 mr-3" />
                <div>
                  <p className="font-semibold">Office</p>
                  <p className="text-primary-200">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
