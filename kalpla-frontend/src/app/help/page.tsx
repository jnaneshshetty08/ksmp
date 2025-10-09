'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, BookOpen, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      articles: 12,
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary-600" />,
      title: 'Account & Billing',
      description: 'Manage your account and billing information',
      articles: 8,
    },
    {
      icon: <Phone className="w-8 h-8 text-primary-600" />,
      title: 'Technical Support',
      description: 'Get help with technical issues',
      articles: 15,
    },
    {
      icon: <Mail className="w-8 h-8 text-primary-600" />,
      title: 'Course Content',
      description: 'Questions about courses and learning materials',
      articles: 20,
    },
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you a reset link via email.',
    },
    {
      question: 'How do I access my courses?',
      answer: 'Once enrolled, you can access your courses through your student dashboard. All course materials are available 24/7.',
    },
    {
      question: 'Can I download course materials?',
      answer: 'Yes, most course materials can be downloaded for offline viewing. Look for the download icon next to each resource.',
    },
    {
      question: 'How do I schedule a mentorship session?',
      answer: 'You can schedule sessions through your dashboard. Go to the "Mentorship" section and select an available time slot.',
    },
    {
      question: 'What if I need to cancel my enrollment?',
      answer: 'You can cancel your enrollment within 30 days for a full refund. Contact our support team for assistance.',
    },
    {
      question: 'How do I update my payment method?',
      answer: 'Go to your account settings and select "Billing". You can update your payment method there.',
    },
  ];

  const popularArticles = [
    'How to get started with your first course',
    'Understanding your learning dashboard',
    'Scheduling mentorship sessions',
    'Downloading course materials',
    'Updating your profile information',
    'Troubleshooting login issues',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the help you need organized by topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4 mx-auto">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                  {category.description}
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400 text-center font-medium">
                  {category.articles} articles
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Most frequently viewed help articles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {article}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Contact Support
            </a>
            <a
              href="mailto:support@kalpla.com"
              className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Mail className="mr-2 w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
