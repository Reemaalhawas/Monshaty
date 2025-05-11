import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">404</h1>
        <p className="text-xl text-green-600 mb-8">الصفحة غير موجودة | Page Not Found</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          العودة للرئيسية | Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404; 