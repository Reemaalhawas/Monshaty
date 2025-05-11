import React from 'react';
import Link from 'next/link';

const AnalysisMenuPage = () => {
  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-800 mb-4">قائمة التحليلات | Analysis Menu</h1>
          <p className="text-lg text-green-600">اختر نوع التحليل المطلوب | Choose the type of analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/descriptive-analysis"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">التحليل الوصفي | Descriptive Analysis</h2>
            <p className="text-gray-600">تحليل شامل للبيانات وتوزيعها | Comprehensive analysis of data and its distribution</p>
          </Link>

          <Link
            href="/predictive-analysis"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">التحليل التنبؤي | Predictive Analysis</h2>
            <p className="text-gray-600">تنبؤات مستقبلية بناءً على البيانات التاريخية | Future predictions based on historical data</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            العودة للصفحة الرئيسية | Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMenuPage;