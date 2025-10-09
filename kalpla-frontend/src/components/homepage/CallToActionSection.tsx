'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Award } from 'lucide-react';

export default function CallToActionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful learners who have already started their journey with Kalpla. 
            Your future self will thank you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-primary-200">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-primary-200">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-primary-200">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/enroll"
              className="group bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-primary-500">
            <p className="text-primary-200 mb-4">Trusted by professionals at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-2xl font-bold">Google</div>
              <div className="text-2xl font-bold">Microsoft</div>
              <div className="text-2xl font-bold">Amazon</div>
              <div className="text-2xl font-bold">Meta</div>
              <div className="text-2xl font-bold">Netflix</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
