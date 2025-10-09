'use client';

import React from 'react';
import { UserPlus, BookOpen, Users, Award } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-primary-600" />,
      title: 'Sign Up',
      description: 'Create your account and choose your learning path based on your goals.',
      step: '01',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Start Learning',
      description: 'Access your personalized curriculum and begin your learning journey.',
      step: '02',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Get Mentored',
      description: 'Connect with expert mentors and join live sessions for guidance.',
      step: '03',
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Get Certified',
      description: 'Complete your program and earn industry-recognized certificates.',
      step: '04',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Getting started is simple. Follow these four easy steps to begin your learning journey.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4 mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
