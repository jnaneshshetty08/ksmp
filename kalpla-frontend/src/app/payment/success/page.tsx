'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { CheckCircle, Mail, Calendar, BookOpen, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Welcome to Kalpla! Your enrollment has been confirmed and you now have access to all course materials.
            </p>

            {/* Next Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Check Your Email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      We've sent you a welcome email with your login credentials and getting started guide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Access Your Dashboard
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Log in to your student dashboard to start your learning journey.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Schedule Your First Session
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Book your first mentorship session to get personalized guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/student"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/program"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Explore Courses
              </Link>
            </div>

            {/* Support */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Need help getting started?
              </p>
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
