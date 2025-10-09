'use client';

import React from 'react';
import { CheckCircle, Clock, Users, Target } from 'lucide-react';

export default function ProgramOverview() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals with years of real-world experience.',
    },
    {
      icon: <Target className="w-8 h-8 text-primary-600" />,
      title: 'Personalized Learning',
      description: 'Customized learning paths tailored to your goals and skill level.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to all materials.',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary-600" />,
      title: 'Certification',
      description: 'Earn industry-recognized certificates upon completion.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Learning Program
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our structured curriculum combines theoretical knowledge with practical application, 
            ensuring you gain the skills needed to excel in your chosen field.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
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
  );
}

export function ModulesBreakdown() {
  const modules = [
    {
      number: '01',
      title: 'Foundation Building',
      description: 'Master the fundamentals and build a strong base for advanced learning.',
      duration: '4 weeks',
    },
    {
      number: '02',
      title: 'Core Concepts',
      description: 'Dive deep into essential concepts and industry best practices.',
      duration: '6 weeks',
    },
    {
      number: '03',
      title: 'Practical Application',
      description: 'Apply your knowledge through real-world projects and case studies.',
      duration: '8 weeks',
    },
    {
      number: '04',
      title: 'Advanced Techniques',
      description: 'Explore advanced topics and cutting-edge methodologies.',
      duration: '6 weeks',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
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
            <div
              key={index}
              className="flex flex-col md:flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {module.number}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {module.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  {module.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
