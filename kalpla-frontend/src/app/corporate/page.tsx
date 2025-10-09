'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Users, Building, Target, Award, CheckCircle, ArrowRight, Star, Clock, TrendingUp, Shield } from 'lucide-react';

export default function CorporatePage() {
  const solutions = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: 'Team Training Programs',
      description: 'Comprehensive training solutions tailored to your team\'s specific needs and goals.',
      features: ['Custom curriculum', 'Flexible scheduling', 'Progress tracking', 'Team collaboration'],
      price: 'Custom pricing'
    },
    {
      icon: <Building className="w-8 h-8 text-green-500" />,
      title: 'Enterprise Solutions',
      description: 'Scalable learning platforms for large organizations with advanced analytics and reporting.',
      features: ['Multi-tenant platform', 'Advanced analytics', 'SSO integration', 'Dedicated support'],
      price: 'Enterprise pricing'
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: 'Leadership Development',
      description: 'Executive and leadership training programs to develop your management team.',
      features: ['Executive coaching', 'Leadership workshops', 'Strategic planning', 'Performance metrics'],
      price: 'Premium pricing'
    }
  ];

  const industries = [
    {
      name: 'Technology',
      description: 'Software development, cloud computing, and digital transformation training.',
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta']
    },
    {
      name: 'Finance',
      description: 'Fintech, blockchain, and financial services technology training.',
      companies: ['JPMorgan', 'Goldman Sachs', 'Stripe', 'Square']
    },
    {
      name: 'Healthcare',
      description: 'Health tech, data analytics, and digital health solutions training.',
      companies: ['Johnson & Johnson', 'Pfizer', 'UnitedHealth', 'Cerner']
    },
    {
      name: 'Retail',
      description: 'E-commerce, supply chain, and customer experience optimization training.',
      companies: ['Walmart', 'Target', 'Nike', 'Starbucks']
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: 'Increased Productivity',
      description: 'Teams trained with our programs show 40% improvement in productivity metrics.'
    },
    {
      icon: <Award className="w-6 h-6 text-blue-500" />,
      title: 'Skill Development',
      description: 'Comprehensive skill development aligned with your business objectives.'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'Risk Mitigation',
      description: 'Reduce technical debt and security risks through proper training.'
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: 'Employee Retention',
      description: 'Invest in your team\'s growth and improve retention rates by 60%.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'CTO, TechCorp',
      content: 'Kalpla\'s corporate training transformed our development team. The custom curriculum and hands-on approach delivered exactly what we needed.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      title: 'VP of Engineering, DataFlow',
      content: 'The enterprise platform integration was seamless. Our teams are now more productive and confident in their technical skills.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      title: 'HR Director, InnovateCo',
      content: 'Employee satisfaction and retention improved significantly after implementing Kalpla\'s leadership development program.',
      rating: 5
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Corporate Training Solutions
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Empower your team with cutting-edge skills and knowledge through our comprehensive corporate training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#solutions"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                View Solutions
              </Link>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Training Solutions for Every Need
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From small teams to large enterprises, we have the right solution for your organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-6 flex justify-center">{solution.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-center">{solution.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{solution.description}</p>
                  
                  <ul className="space-y-3 mb-6">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary-600 mb-4">{solution.price}</div>
                    <Link
                      href="/contact"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Kalpla for Corporate Training?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our corporate training programs deliver measurable results and ROI for your organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We work with companies across various industries to deliver tailored training solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold mb-3">{industry.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{industry.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Sample Clients</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.companies.map((company, companyIndex) => (
                        <span
                          key={companyIndex}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Our Corporate Clients Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Hear from leaders who have transformed their organizations with our training programs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Corporate Training Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We follow a structured approach to ensure your training program delivers maximum value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Needs Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300">We analyze your team's current skills and identify training gaps.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Curriculum</h3>
                <p className="text-gray-600 dark:text-gray-300">Design a tailored training program that meets your specific objectives.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Implementation</h3>
                <p className="text-gray-600 dark:text-gray-300">Deploy the training program with ongoing support and guidance.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Measure Results</h3>
                <p className="text-gray-600 dark:text-gray-300">Track progress and measure ROI with comprehensive analytics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Team?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Let's discuss how our corporate training solutions can help your organization achieve its goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/programs"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                View Training Programs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
