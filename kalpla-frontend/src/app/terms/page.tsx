'use client';

import React from 'react';
import Layout from '@/components/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Terms of Service
            </h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>Last updated:</strong> January 1, 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing and using Kalpla's services, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Use License
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Permission is granted to temporarily access the materials on Kalpla's website for personal, 
                  non-commercial transitory viewing only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. User Accounts
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You are responsible for maintaining the confidentiality of your account and password. 
                  You agree to accept responsibility for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Payment Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All payments are processed securely. We offer a 30-day money-back guarantee for all courses. 
                  Refunds will be processed within 5-7 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Intellectual Property
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All content, including but not limited to text, graphics, logos, and software, is the 
                  property of Kalpla and is protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  In no event shall Kalpla or its suppliers be liable for any damages arising out of the 
                  use or inability to use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Email:</strong> legal@kalpla.com<br />
                    <strong>Address:</strong> 123 Learning Street, Education City, EC 12345
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
