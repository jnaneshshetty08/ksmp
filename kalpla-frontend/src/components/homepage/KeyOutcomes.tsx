'use client';

import React from 'react';
import { TrendingUp, Briefcase, Network, Star } from 'lucide-react';

export default function KeyOutcomes() {
  const outcomes = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: 'Career Advancement',
      description: '85% of our graduates report significant career growth within 6 months.',
      stat: '85%',
    },
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      title: 'Industry Readiness',
      description: 'Gain practical skills that employers are actively seeking.',
      stat: '100%',
    },
    {
      icon: <Network className="w-8 h-8 text-purple-600" />,
      title: 'Professional Network',
      description: 'Connect with industry professionals and like-minded peers.',
      stat: '500+',
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: 'Certification',
      description: 'Earn industry-recognized certificates to validate your skills.',
      stat: '95%',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What You'll Achieve
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful learners who have transformed their careers with our program.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {outcomes.map((outcome, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 mx-auto">
                {outcome.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {outcome.stat}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {outcome.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramFeatures() {
  const features = [
    {
      title: 'Interactive Learning',
      description: 'Engage with multimedia content, quizzes, and hands-on exercises.',
    },
    {
      title: 'Live Sessions',
      description: 'Join weekly live sessions with mentors and fellow learners.',
    },
    {
      title: 'Project-Based Learning',
      description: 'Build real-world projects to showcase your skills.',
    },
    {
      title: 'Peer Collaboration',
      description: 'Work with peers on group projects and assignments.',
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team.',
    },
    {
      title: 'Mobile Learning',
      description: 'Access your courses anywhere, anytime with our mobile app.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Program Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience learning like never before with our comprehensive feature set.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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
  );
}
