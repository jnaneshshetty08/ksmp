'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { Users, Award, Globe, Heart, Target, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary-600" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from curriculum design to student support.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Community',
      description: 'Building a supportive community where learners can grow and succeed together.',
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary-600" />,
      title: 'Innovation',
      description: 'Continuously innovating our teaching methods and technology to enhance learning.',
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      title: 'Passion',
      description: 'Driven by our passion for education and helping others achieve their goals.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Students Enrolled' },
    { number: '500+', label: 'Expert Mentors' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Countries' },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former Google engineer with 15+ years in tech education.',
      image: '/team/sarah.jpg',
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      bio: 'Ex-Microsoft architect specializing in scalable learning platforms.',
      image: '/team/mike.jpg',
    },
    {
      name: 'Emily Davis',
      role: 'Head of Education',
      bio: 'PhD in Education Technology with expertise in curriculum design.',
      image: '/team/emily.jpg',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Kalpla
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              We're on a mission to democratize education and help people worldwide achieve their career goals through innovative learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At Kalpla, we believe that education should be accessible, engaging, and transformative. 
                Our mission is to provide world-class learning experiences that empower individuals to 
                achieve their professional goals and make a positive impact in their communities.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We combine cutting-edge technology with proven pedagogical methods to create learning 
                experiences that are not just educational, but truly inspiring. Our platform connects 
                learners with expert mentors, provides hands-on projects, and offers personalized 
                learning paths tailored to individual needs.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Award Winning</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Global Reach</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Our Impact
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core values guide everything we do and shape our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4 mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our passionate team of educators, technologists, and industry experts is dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Kalpla was founded in 2020 with a simple yet powerful vision: to make quality education 
                accessible to everyone, regardless of their background or location. What started as a 
                small team of passionate educators has grown into a global platform serving thousands 
                of learners worldwide.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our journey began when our founders, frustrated with the limitations of traditional 
                education, decided to create a learning platform that combines the best of online 
                education with personalized mentorship and hands-on experience. Today, we're proud 
                to be at the forefront of educational innovation.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                As we continue to grow, our commitment remains the same: to provide transformative 
                learning experiences that empower individuals to achieve their dreams and make a 
                positive impact in the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
