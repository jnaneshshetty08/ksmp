'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { Copy, CheckCircle, User, Shield, BookOpen } from 'lucide-react';

export default function DemoCredentialsPage() {
  const credentials = [
    {
      role: 'Admin',
      email: 'admin@kalpla.com',
      password: 'admin123',
      description: 'Full access to all features including user management, analytics, and system settings.',
      permissions: ['User Management', 'Analytics Dashboard', 'System Settings', 'Program Management']
    },
    {
      role: 'Mentor',
      email: 'mentor@kalpla.com',
      password: 'mentor123',
      description: 'Access to student management, assignment review, and session scheduling.',
      permissions: ['Student Management', 'Assignment Review', 'Session Scheduling', 'Progress Tracking']
    },
    {
      role: 'Student',
      email: 'student@kalpla.com',
      password: 'student123',
      description: 'Access to courses, assignments, video library, and progress tracking.',
      permissions: ['Course Access', 'Assignment Submission', 'Video Library', 'Progress Tracking']
    }
  ];

  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Demo Credentials
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Use these demo credentials to explore different user roles and features of the Kalpla platform.
            </p>
          </div>
        </section>

        {/* Credentials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Available Demo Accounts
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Each account provides access to different features based on the user role.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {credentials.map((credential, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {credential.role === 'Admin' ? (
                        <Shield className="w-8 h-8 text-white" />
                      ) : credential.role === 'Mentor' ? (
                        <User className="w-8 h-8 text-white" />
                      ) : (
                        <BookOpen className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{credential.role}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{credential.description}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={credential.email}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => copyToClipboard(credential.email, index * 2)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {copiedIndex === index * 2 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="password"
                          value={credential.password}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => copyToClipboard(credential.password, index * 2 + 1)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          {copiedIndex === index * 2 + 1 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Permissions</h4>
                    <ul className="space-y-2">
                      {credential.permissions.map((permission, permIndex) => (
                        <li key={permIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Login as {credential.role}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructions Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Use Demo Credentials
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Follow these steps to explore the platform with different user roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose Role</h3>
                <p className="text-gray-600 dark:text-gray-300">Select the demo account that matches the role you want to explore.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Copy Credentials</h3>
                <p className="text-gray-600 dark:text-gray-300">Click the copy button to copy the email and password to your clipboard.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Login</h3>
                <p className="text-gray-600 dark:text-gray-300">Go to the login page and enter the copied credentials.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Explore</h3>
                <p className="text-gray-600 dark:text-gray-300">Navigate through the platform and explore all available features.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>• These are demo accounts for testing purposes only</li>
                <li>• All data in demo accounts is reset periodically</li>
                <li>• Do not use these credentials for production or personal use</li>
                <li>• Some features may be limited in demo mode</li>
                <li>• For production access, please contact our support team</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
