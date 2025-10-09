'use client';

import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
