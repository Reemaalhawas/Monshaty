import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">منصة منشآتي | Monshaty Platform</h1>
          <p className="text-xl text-green-600 mb-8">منصة تحليل البيانات المتكاملة | Integrated Data Analysis Platform</p>
          
          <div className="space-y-4">
            <Link
              href="/upload"
              className="block w-full max-w-md mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              تحميل البيانات | Upload Data
            </Link>
            
            <Link
              href="/descriptive-analysis"
              className="block w-full max-w-md mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              التحليل الوصفي | Descriptive Analysis
            </Link>
            
            <Link
              href="/dashboard"
              className="block w-full max-w-md mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              لوحة التحكم | Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;