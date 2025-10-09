'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Users, BookOpen, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Award className="w-4 h-4 mr-2" />
            Trusted by 10,000+ learners worldwide
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Learning Journey
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Master new skills with expert mentorship, interactive content, and personalized learning paths designed for your success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/enroll"
              className="group bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
            >
              Start Learning Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-primary-200">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-primary-200">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-primary-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
