'use client';

import React from 'react';
import { Award, Users, Clock, Shield, Headphones, Globe } from 'lucide-react';

export default function WhyChooseKSMP() {
  const reasons = [
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Industry Recognition',
      description: 'Our certificates are recognized by top companies and industry leaders worldwide.',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Expert Mentors',
      description: 'Learn from professionals with 10+ years of industry experience.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to course materials.',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Money-Back Guarantee',
      description: '100% satisfaction guarantee with 30-day money-back policy.',
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary-600" />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team.',
    },
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: 'Global Community',
      description: 'Join a worldwide community of learners and professionals.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Kalpla?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're not just another learning platform. We're your partner in success, 
            committed to helping you achieve your career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
