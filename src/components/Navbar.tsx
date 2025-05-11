import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-32">
          <div className="flex items-center space-x-16">
            <Link href="/" className="flex items-center space-x-8">
              <div className="relative w-32 h-32 p-2">
                <Image
                  src="/logo.png"
                  alt="Monshaty Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  quality={100}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-green-800">Monshaty</h1>
                <p className="text-xl text-green-600">Data Analysis Platform</p>
              </div>
            </Link>
            <div className="flex items-center space-x-10">
              <Link href="/upload" className="text-gray-600 hover:text-green-600 transition-colors text-xl font-medium">
                Upload
              </Link>
              <Link href="/analysis-menu" className="text-gray-600 hover:text-green-600 transition-colors text-xl font-medium">
                Analysis
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors text-xl font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;