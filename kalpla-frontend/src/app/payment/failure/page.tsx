'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { XCircle, RefreshCw, ArrowLeft, Phone } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              We're sorry, but your payment could not be processed. Please try again or contact support for assistance.
            </p>

            {/* Common Reasons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Common reasons for payment failure:
              </h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Insufficient funds in your account
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Incorrect card details entered
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Card expired or blocked
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Bank security restrictions
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  Temporary network issues
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/enroll"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                <RefreshCw className="mr-2 w-5 h-5" />
                Try Again
              </Link>
              <Link
                href="/pricing"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Pricing
              </Link>
            </div>

            {/* Support */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our support team is here to help you complete your enrollment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                >
                  Contact Support
                </Link>
                <span className="text-gray-400">|</span>
                <a
                  href="tel:+15551234567"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                >
                  Call +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
