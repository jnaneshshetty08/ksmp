'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, BookOpen, Users, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Program', href: '/program' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'mentor':
        return '/dashboard/mentor';
      case 'student':
        return '/dashboard/student';
      default:
        return '/dashboard';
    }
  };

  const getDashboardIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    
    switch (user.role) {
      case 'admin':
        return <BarChart3 className="w-4 h-4" />;
      case 'mentor':
        return <Users className="w-4 h-4" />;
      case 'student':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Kalpla
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  {getDashboardIcon()}
                  <span className="font-medium">Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {getDashboardIcon()}
                    <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center space-x-2 px-3 py-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
