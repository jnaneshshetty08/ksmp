'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Award, CheckCircle, Star, Users, Clock, ArrowRight, Download, Share2, Eye } from 'lucide-react';

export default function CertificationsPage() {
  const certifications = [
    {
      id: 1,
      title: 'Full Stack Web Development Certificate',
      description: 'Comprehensive certification covering modern web development technologies and best practices.',
      duration: '6 months',
      level: 'Advanced',
      students: '2,500+',
      rating: 4.9,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
      requirements: [
        'Complete all 6 modules',
        'Build 3 portfolio projects',
        'Pass final assessment',
        'Complete capstone project'
      ],
      benefits: [
        'Industry-recognized certificate',
        'Portfolio showcase',
        'Job placement assistance',
        'Lifetime access to updates'
      ],
      price: '$1,299',
      originalPrice: '$1,999'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Professional',
      description: 'Master artificial intelligence and machine learning with hands-on projects and real-world applications.',
      duration: '8 months',
      level: 'Expert',
      students: '1,800+',
      rating: 4.8,
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
      requirements: [
        'Complete all 8 modules',
        'Build 5 ML projects',
        'Pass technical interview',
        'Publish research paper'
      ],
      benefits: [
        'Professional certification',
        'Research publication',
        'Industry connections',
        'Advanced career support'
      ],
      price: '$1,599',
      originalPrice: '$2,299'
    },
    {
      id: 3,
      title: 'Data Science & Analytics Specialist',
      description: 'Transform data into actionable insights with comprehensive data science training.',
      duration: '5 months',
      level: 'Intermediate',
      students: '1,200+',
      rating: 4.7,
      skills: ['Python', 'SQL', 'Tableau', 'Statistics', 'Business Intelligence'],
      requirements: [
        'Complete all 5 modules',
        'Analyze 10 datasets',
        'Create data dashboard',
        'Present findings'
      ],
      benefits: [
        'Specialist certification',
        'Portfolio of analyses',
        'Business case studies',
        'Industry mentorship'
      ],
      price: '$1,199',
      originalPrice: '$1,699'
    },
    {
      id: 4,
      title: 'Cloud Computing & DevOps Engineer',
      description: 'Master cloud platforms and DevOps practices for scalable, reliable applications.',
      duration: '6 months',
      level: 'Advanced',
      students: '800+',
      rating: 4.8,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      requirements: [
        'Complete all 6 modules',
        'Deploy 3 applications',
        'Pass hands-on labs',
        'Design scalable architecture'
      ],
      benefits: [
        'Engineer certification',
        'Cloud portfolio',
        'Architecture designs',
        'DevOps best practices'
      ],
      price: '$1,399',
      originalPrice: '$1,999'
    },
    {
      id: 5,
      title: 'Mobile App Development Expert',
      description: 'Create stunning mobile applications for iOS and Android platforms.',
      duration: '4 months',
      level: 'Intermediate',
      students: '900+',
      rating: 4.6,
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'App Store'],
      requirements: [
        'Complete all 4 modules',
        'Build 2 mobile apps',
        'Publish to app stores',
        'User testing & feedback'
      ],
      benefits: [
        'Expert certification',
        'Published apps',
        'App store presence',
        'User acquisition strategies'
      ],
      price: '$999',
      originalPrice: '$1,399'
    },
    {
      id: 6,
      title: 'Cybersecurity Professional',
      description: 'Protect systems and data with comprehensive cybersecurity training and certification.',
      duration: '5 months',
      level: 'Advanced',
      students: '600+',
      rating: 4.7,
      skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Compliance', 'Incident Response'],
      requirements: [
        'Complete all 5 modules',
        'Pass security assessments',
        'Complete penetration testing',
        'Develop security policies'
      ],
      benefits: [
        'Professional certification',
        'Security portfolio',
        'Industry compliance',
        'Threat analysis skills'
      ],
      price: '$1,299',
      originalPrice: '$1,799'
    }
  ];

  const certificateFeatures = [
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: 'Industry Recognition',
      description: 'Certificates recognized by top tech companies and hiring managers worldwide.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: 'Verified Skills',
      description: 'Demonstrate your expertise with hands-on projects and comprehensive assessments.'
    },
    {
      icon: <Star className="w-8 h-8 text-blue-500" />,
      title: 'Career Advancement',
      description: 'Boost your resume and increase your earning potential with professional certifications.'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: 'Professional Network',
      description: 'Join a community of certified professionals and expand your industry connections.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Certifications
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Earn industry-recognized certifications that validate your skills and accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/enroll"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                Start Your Certification Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#certifications"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                View All Certifications
              </Link>
            </div>
          </div>
        </section>

        {/* Certificate Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Get Certified with Kalpla?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our certifications are designed to give you a competitive edge in the job market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {certificateFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Grid */}
        <section id="certifications" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Available Certifications
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choose from our comprehensive range of professional certifications.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{cert.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {cert.duration}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      {cert.students} certified
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      {cert.level}
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      {cert.rating} rating
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Skills You'll Master:</h4>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {cert.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">What You'll Get:</h4>
                    <ul className="space-y-1">
                      {cert.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">{cert.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{cert.originalPrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      href="/enroll"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-center"
                    >
                      Enroll Now
                    </Link>
                    <Link
                      href={`/program/${cert.id}`}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certification Process */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Get Certified
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Follow our structured process to earn your professional certification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Enroll in Program</h3>
                <p className="text-gray-600 dark:text-gray-300">Choose your certification program and start your learning journey.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete Modules</h3>
                <p className="text-gray-600 dark:text-gray-300">Work through all course modules and hands-on projects.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Pass Assessment</h3>
                <p className="text-gray-600 dark:text-gray-300">Complete the final assessment and capstone project.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Certified</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive your digital certificate and add it to your profile.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Certified?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of professionals who have advanced their careers with our certifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/enroll"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center"
              >
                Start Your Certification
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              >
                Ask Questions
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
