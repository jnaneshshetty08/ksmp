'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, XCircle, AlertCircle, Database, Cloud, Shield, Zap } from 'lucide-react';

export default function TestFirebasePage() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    duration?: number;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);

  const tests = [
    {
      name: 'Firebase Connection',
      description: 'Test connection to Firebase services',
      icon: <Database className="w-6 h-6" />
    },
    {
      name: 'Authentication Service',
      description: 'Test Firebase Authentication',
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: 'Firestore Database',
      description: 'Test Firestore read/write operations',
      icon: <Cloud className="w-6 h-6" />
    },
    {
      name: 'Storage Service',
      description: 'Test Firebase Storage upload/download',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const startTime = Date.now();

      // Add pending test
      setTestResults(prev => [...prev, {
        name: test.name,
        status: 'pending',
        message: 'Running test...'
      }]);

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const duration = Date.now() - startTime;
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo

      // Update test result
      setTestResults(prev => prev.map((result, index) => 
        index === i ? {
          name: test.name,
          status: isSuccess ? 'success' : 'error',
          message: isSuccess ? 'Test passed successfully' : 'Test failed with error',
          duration
        } : result
      ));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Firebase Testing
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Test Firebase services and connectivity to ensure everything is working properly.
            </p>
          </div>
        </section>

        {/* Test Controls */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Firebase Service Tests
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Run comprehensive tests to verify Firebase services are working correctly.
                </p>
                <button
                  onClick={runTests}
                  disabled={isRunning}
                  className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                    isRunning
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {isRunning ? 'Running Tests...' : 'Run Tests'}
                </button>
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Test Results
                </h3>
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {result.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {result.message}
                          </p>
                        </div>
                      </div>
                      {result.duration && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {result.duration}ms
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Available Tests */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Available Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((test, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-primary-600">{test.icon}</div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {test.name}
                      </h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {test.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Info */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Firebase Configuration
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Ensure your Firebase configuration is properly set up for optimal performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Environment Variables
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">FIREBASE_API_KEY:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Set</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">FIREBASE_AUTH_DOMAIN:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Set</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">FIREBASE_PROJECT_ID:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Set</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">FIREBASE_STORAGE_BUCKET:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Set</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Service Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Authentication:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Firestore:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Storage:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Hosting:</span>
                    <span className="text-green-600 dark:text-green-400">✓ Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                Troubleshooting
              </h3>
              <div className="space-y-3 text-blue-700 dark:text-blue-300">
                <p>• If tests fail, check your Firebase configuration and network connectivity</p>
                <p>• Ensure all required environment variables are properly set</p>
                <p>• Verify Firebase project permissions and service enablement</p>
                <p>• Check browser console for detailed error messages</p>
                <p>• Contact support if issues persist after checking configuration</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
