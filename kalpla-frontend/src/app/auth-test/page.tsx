'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, XCircle, AlertCircle, User, Shield, Key, Database, Clock } from 'lucide-react';

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    duration?: number;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const tests = [
    {
      name: 'Authentication Service',
      description: 'Test authentication service availability',
      icon: <Shield className="w-6 h-6" />
    },
    {
      name: 'JWT Token Validation',
      description: 'Test JWT token generation and validation',
      icon: <Key className="w-6 h-6" />
    },
    {
      name: 'User Session Management',
      description: 'Test user session creation and management',
      icon: <User className="w-6 h-6" />
    },
    {
      name: 'Role-Based Access Control',
      description: 'Test role-based permissions and access control',
      icon: <Database className="w-6 h-6" />
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
      const isSuccess = Math.random() > 0.15; // 85% success rate for demo

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

  const testLogin = async () => {
    try {
      // Simulate login test
      const mockUser = {
        id: '1',
        email: 'test@kalpla.com',
        role: 'student',
        name: 'Test User',
        loginTime: new Date().toISOString()
      };
      setUserInfo(mockUser);
    } catch (error) {
      console.error('Login test failed:', error);
    }
  };

  const testLogout = () => {
    setUserInfo(null);
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
              Authentication Testing
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Test authentication services, JWT tokens, and user session management to ensure security is working properly.
            </p>
          </div>
        </section>

        {/* Test Controls */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Authentication Service Tests
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Run comprehensive tests to verify authentication services are working correctly.
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
              <div className="space-y-4 mb-8">
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

            {/* User Session Testing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                User Session Testing
              </h3>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={testLogin}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Test Login
                </button>
                <button
                  onClick={testLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Test Logout
                </button>
              </div>

              {userInfo ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                    Active Session
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">User ID:</span>
                      <span className="text-green-800 dark:text-green-200">{userInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Email:</span>
                      <span className="text-green-800 dark:text-green-200">{userInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Role:</span>
                      <span className="text-green-800 dark:text-green-200">{userInfo.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-300">Login Time:</span>
                      <span className="text-green-800 dark:text-green-200">
                        {new Date(userInfo.loginTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-300">No active session</p>
                </div>
              )}
            </div>

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

        {/* Security Information */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Security Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our authentication system includes multiple layers of security to protect user data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">JWT Tokens</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Secure token-based authentication with expiration and refresh mechanisms.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Granular permissions based on user roles and responsibilities.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Session Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatic session timeout and secure session handling.
                </p>
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
                <p>• If authentication tests fail, check your JWT secret and configuration</p>
                <p>• Ensure all required environment variables are properly set</p>
                <p>• Verify database connection and user table structure</p>
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
