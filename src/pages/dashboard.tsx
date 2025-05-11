import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from 'recharts';
import { ResponsiveContainer } from 'recharts';

interface DistributionData {
  range: string;
  count: number;
}

interface CategoricalData {
  category: string;
  count: number;
}

const Dashboard = () => {
  const { data, headers, types } = useData();
  const [distributionData, setDistributionData] = useState<Record<string, DistributionData[]>>({});
  const [categoricalData, setCategoricalData] = useState<Record<string, CategoricalData[]>>({});

  const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

  useEffect(() => {
    if (data.length > 0) {
      // Calculate distribution for numeric columns
      const numericDistributions: Record<string, DistributionData[]> = {};
      const categoricalDistributions: Record<string, CategoricalData[]> = {};

      headers.forEach(header => {
        if (types[header] === 'numeric') {
          const values = data
            .map(row => parseFloat(row[header]))
            .filter(value => !isNaN(value));

          if (values.length > 0) {
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            const binCount = 10;
            const binSize = range / binCount;

            const distribution = Array.from({ length: binCount }, (_, i) => {
              const binStart = min + i * binSize;
              const binEnd = binStart + binSize;
              const count = values.filter(v => v >= binStart && v < binEnd).length;
              return {
                range: `${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`,
                count
              };
            });

            numericDistributions[header] = distribution;
          }
        } else {
          // Calculate distribution for categorical columns
          const categoryCounts = data.reduce((acc: Record<string, number>, row) => {
            const value = row[header];
            if (value !== null && value !== '') {
              acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
          }, {});

          categoricalDistributions[header] = Object.entries(categoryCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
        }
      });

      setDistributionData(numericDistributions);
      setCategoricalData(categoricalDistributions);
    }
  }, [data, headers, types]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">لوحة التحكم | Dashboard</h1>
            <p className="text-lg text-green-600 mb-8">لم يتم تحميل أي بيانات بعد | No data has been loaded yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-6">لوحة التحكم | Dashboard</h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto">نظرة عامة على البيانات | Data Overview</p>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">ملخص البيانات | Data Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
              <div className="text-lg text-green-600 mb-2">Total Rows</div>
              <div className="text-3xl font-bold text-gray-900">{data.length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
              <div className="text-lg text-green-600 mb-2">Total Columns</div>
              <div className="text-3xl font-bold text-gray-900">{headers.length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
              <div className="text-lg text-green-600 mb-2">Numeric Columns</div>
              <div className="text-3xl font-bold text-gray-900">
                {Object.values(types).filter(type => type === 'numeric').length}
              </div>
            </div>
          </div>
        </div>

        {/* Numeric Column Distributions */}
        {Object.entries(distributionData).map(([column, data]) => (
          <div key={column} className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">{column} Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        {/* Categorical Column Distributions */}
        {Object.entries(categoricalData).map(([column, data]) => (
          <div key={column} className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">{column} Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;