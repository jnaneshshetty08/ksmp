'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { CheckCircle, Clock, Users, Award, CreditCard, Shield, ArrowRight } from 'lucide-react';

export default function EnrollPage() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99,
      duration: '3 months',
      description: 'Perfect for beginners who want to get started',
      features: [
        'Access to core curriculum',
        'Basic mentorship (2 sessions/month)',
        'Community forum access',
        'Certificate of completion',
        '30-day money-back guarantee',
      ],
      popular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 199,
      duration: '6 months',
      description: 'Most popular choice for serious learners',
      features: [
        'Full curriculum access',
        'Premium mentorship (4 sessions/month)',
        'Priority support',
        'Live group sessions',
        'Industry certification',
        'Career guidance',
        '30-day money-back guarantee',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      duration: '12 months',
      description: 'Complete package for career transformation',
      features: [
        'Everything in Standard',
        '1-on-1 mentorship (unlimited)',
        'Personalized learning path',
        'Job placement assistance',
        'Lifetime access to materials',
        'Exclusive networking events',
        '30-day money-back guarantee',
      ],
      popular: false,
    },
  ];

  const handleEnroll = async (planId: string) => {
    setIsLoading(true);
    try {
      // Simulate enrollment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Redirect to payment page
      window.location.href = `/payment?plan=${planId}`;
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals with real-world experience.',
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Industry Certification',
      description: 'Earn recognized certificates that boost your career prospects.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: 'Flexible Learning',
      description: 'Study at your own pace with lifetime access to materials.',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Money-Back Guarantee',
      description: '30-day guarantee - if you\'re not satisfied, get a full refund.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Start Your Learning Journey
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Choose the perfect plan for your goals and transform your career with expert guidance and hands-on learning.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Kalpla?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers with our proven approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Select the plan that best fits your learning goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-primary-600 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      /{plan.duration}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleEnroll(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="spinner mx-auto"></div>
                  ) : (
                    <>
                      Enroll Now
                      <ArrowRight className="ml-2 w-4 h-4 inline" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            30-Day Money-Back Guarantee
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We're confident you'll love your learning experience. If you're not completely satisfied 
            within the first 30 days, we'll provide a full refund - no questions asked.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Secure Payment
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              SSL Encrypted
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant Access
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
