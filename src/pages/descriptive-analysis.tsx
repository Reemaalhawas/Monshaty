import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

// Helper functions for statistical calculations
const calculateMedian = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
};

const calculateMode = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const counts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const entries = Object.entries(counts);
  if (entries.length === 0) return 0;
  return Number(entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]);
};

const calculateStandardDeviation = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
};

const calculateVariance = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
};

const calculateQuartiles = (values: number[]) => {
  if (!values || values.length === 0) return { q1: 0, q2: 0, q3: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)] || 0;
  const q2 = calculateMedian(sorted) || 0;
  const q3 = sorted[Math.floor(sorted.length * 0.75)] || 0;
  return { q1, q2, q3 };
};

const calculateSkewness = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = calculateStandardDeviation(values);
  const cubedDiffs = values.map(value => Math.pow(value - mean, 3));
  const sumCubedDiffs = cubedDiffs.reduce((a, b) => a + b, 0);
  return (sumCubedDiffs / values.length) / Math.pow(std, 3);
};

const calculateKurtosis = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = calculateStandardDeviation(values);
  const fourthPowerDiffs = values.map(value => Math.pow(value - mean, 4));
  const sumFourthPowerDiffs = fourthPowerDiffs.reduce((a, b) => a + b, 0);
  return (sumFourthPowerDiffs / values.length) / Math.pow(std, 4) - 3;
};

const calculateEntropy = (distribution: Array<{ relativeFrequency: number }>) => {
  if (!distribution || distribution.length === 0) return 0;
  return -distribution.reduce((sum, item) => {
    const p = item.relativeFrequency;
    return sum + (p * Math.log2(p));
  }, 0);
};

const calculateGiniIndex = (distribution: Array<{ relativeFrequency: number }>) => {
  if (!distribution || distribution.length === 0) return 0;
  const sortedFreqs = distribution.map(d => d.relativeFrequency).sort((a, b) => a - b);
  const n = sortedFreqs.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (n - i) * sortedFreqs[i];
  }
  return 1 - (2 * sum) / (n * sortedFreqs.reduce((a, b) => a + b, 0));
};

// Business metrics calculations
const calculateGrowthRate = (data: any[], revenueColumn: string, dateColumn: string) => {
  if (!data || data.length === 0) return 0;
  const sortedData = [...data].sort((a, b) => new Date(a[dateColumn]).getTime() - new Date(b[dateColumn]).getTime());
  const firstRevenue = parseFloat(sortedData[0][revenueColumn]) || 0;
  const lastRevenue = parseFloat(sortedData[sortedData.length - 1][revenueColumn]) || 0;
  return firstRevenue === 0 ? 0 : ((lastRevenue - firstRevenue) / firstRevenue) * 100;
};

const calculateAverageTransactionValue = (data: any[]) => {
  if (!data || data.length === 0) return 0;
  const totalRevenue = data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0);
  return totalRevenue / data.length;
};

const calculateCLV = (data: any[]) => {
  if (!data || data.length === 0) return 0;
  const avgTransactionValue = calculateAverageTransactionValue(data);
  const uniqueCustomers = new Set(data.map(row => row.customerId)).size;
  const avgPurchaseFrequency = data.length / uniqueCustomers;
  const avgCustomerLifespan = 12; // Assuming 12 months
  return avgTransactionValue * avgPurchaseFrequency * avgCustomerLifespan;
};

const calculateChurnRate = (data: any[]) => {
  if (!data || data.length === 0) return 0;
  const uniqueCustomers = new Set(data.map(row => row.customerId)).size;
  const churnedCustomers = data.filter(row => row.status === 'churned').length;
  return (churnedCustomers / uniqueCustomers) * 100;
};

const calculateRetentionRate = (data: any[]) => {
  return 100 - calculateChurnRate(data);
};

const calculateConversionRate = (data: any[]) => {
  if (!data || data.length === 0) return 0;
  const totalVisitors = data.reduce((sum, row) => sum + (parseInt(row.visitors) || 0), 0);
  return totalVisitors === 0 ? 0 : (data.length / totalVisitors) * 100;
};

const calculateAOV = (data: any[]) => {
  return calculateAverageTransactionValue(data);
};

const calculateARPU = (data: any[]) => {
  if (!data || data.length === 0) return 0;
  const totalRevenue = data.reduce((sum, row) => sum + (parseFloat(row.revenue) || 0), 0);
  const uniqueCustomers = new Set(data.map(row => row.customerId)).size;
  return uniqueCustomers === 0 ? 0 : totalRevenue / uniqueCustomers;
};

const performRFMAnalysis = (data: any[]) => {
  if (!data || data.length === 0) return [];
  const now = new Date();
  const customerMetrics = data.reduce((acc, row) => {
    const customerId = row.customerId;
    if (!acc[customerId]) {
      acc[customerId] = {
        recency: Infinity,
        frequency: 0,
        monetary: 0
      };
    }
    
    const purchaseDate = new Date(row.date);
    const recency = now.getTime() - purchaseDate.getTime();
    acc[customerId].recency = Math.min(acc[customerId].recency, recency);
    acc[customerId].frequency += 1;
    acc[customerId].monetary += parseFloat(row.revenue || 0);
    
    return acc;
  }, {} as Record<string, { recency: number; frequency: number; monetary: number }>);

  return Object.entries(customerMetrics).map(([customerId, metrics]: [string, { recency: number; frequency: number; monetary: number }]) => ({
    customerId,
    recency: metrics.recency / (1000 * 60 * 60 * 24), // Convert to days
    frequency: metrics.frequency,
    monetary: metrics.monetary
  }));
};

const calculateDescriptiveStats = (data: any[], column: string) => {
  const values = data.map(row => row[column]).filter(v => typeof v === 'number');
  
  return {
    count: values.length,
    mean: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    median: calculateMedian(values),
    mode: calculateMode(values),
    std: calculateStandardDeviation(values),
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
    quartiles: calculateQuartiles(values),
    variance: calculateVariance(values)
  };
};

const analyzeCategoricalData = (data: any[], column: string) => {
  const frequencies: Record<string, number> = {};
  const total = data.length;
  
  data.forEach(row => {
    const value = row[column];
    frequencies[value] = (frequencies[value] || 0) + 1;
  });
  
  const distribution = Object.entries(frequencies)
    .map(([category, count]) => ({
      category,
      count,
      percentage: (count / total) * 100,
      relativeFrequency: count / total
    }))
    .sort((a, b) => b.count - a.count);
  
  return {
    distribution,
    uniqueValues: Object.keys(frequencies).length,
    mostCommon: distribution[0] || { category: '', count: 0, percentage: 0, relativeFrequency: 0 },
    leastCommon: distribution[distribution.length - 1] || { category: '', count: 0, percentage: 0, relativeFrequency: 0 }
  };
};

const analyzeBusinessMetrics = (data: any[]) => {
  return {
    growthRate: calculateGrowthRate(data, 'revenue', 'date'),
    customerMetrics: {
      averageTransactionValue: calculateAverageTransactionValue(data),
      customerLifetimeValue: calculateCLV(data),
      churnRate: calculateChurnRate(data),
      retentionRate: calculateRetentionRate(data)
    },
    performanceIndicators: {
      conversionRate: calculateConversionRate(data),
      averageOrderValue: calculateAOV(data),
      revenuePerUser: calculateARPU(data)
    },
    segmentation: performRFMAnalysis(data)
  };
};

const DescriptiveAnalysis = () => {
  const { data, headers, types } = useData();
  const [descriptiveStats, setDescriptiveStats] = useState<Record<string, any>>({});
  const [categoricalAnalysis, setCategoricalAnalysis] = useState<Record<string, any>>({});
  const [businessMetrics, setBusinessMetrics] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate descriptive statistics for numeric columns
      const stats: Record<string, any> = {};
      headers.forEach(header => {
        if (types[header] === 'numeric') {
          stats[header] = calculateDescriptiveStats(data, header);
        }
      });
      setDescriptiveStats(stats);

      // Calculate categorical analysis for non-numeric columns
      const categorical: Record<string, any> = {};
      headers.forEach(header => {
        if (types[header] !== 'numeric') {
          categorical[header] = analyzeCategoricalData(data, header);
        }
      });
      setCategoricalAnalysis(categorical);

      // Calculate business metrics
      setBusinessMetrics(analyzeBusinessMetrics(data));
    }
  }, [data, headers, types]);

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">التحليل الوصفي | Descriptive Analysis</h1>
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
          <h1 className="text-4xl font-bold text-green-800 mb-6">التحليل الوصفي | Descriptive Analysis</h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto">تحليل شامل للبيانات | Comprehensive Data Analysis</p>
        </div>

        {/* Descriptive Statistics Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">الإحصائيات الوصفية | Descriptive Statistics</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(descriptiveStats).map(([column, stats]) => (
                <div key={column} className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">{column}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-600">عدد القيم | Count:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.count}</span>
                    </div>
                    <div>
                      <span className="text-green-600">المتوسط الحسابي | Mean:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.mean.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">الوسيط | Median:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.median.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">المنوال | Mode:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.mode.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">الانحراف المعياري | Std Dev:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.std.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">التباين | Variance:</span>
                      <span className="ml-2 font-bold text-gray-900">{stats.variance.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">الرباعيات | Quartiles:</span>
                      <div className="ml-2 text-gray-900">
                        <div>Q1: {(stats.quartiles?.q1 ?? 0).toFixed(2)}</div>
                        <div>Q2: {(stats.quartiles?.q2 ?? 0).toFixed(2)}</div>
                        <div>Q3: {(stats.quartiles?.q3 ?? 0).toFixed(2)}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-600">النطاق | Range:</span>
                      <div className="ml-2 text-gray-900">
                        <div>Min: {stats.min.toFixed(2)}</div>
                        <div>Max: {stats.max.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categorical Analysis Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">التحليل الفئوي | Categorical Analysis</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoricalAnalysis).map(([column, analysis]) => (
                <div key={column} className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">{column}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-600">عدد القيم الفريدة | Unique Values:</span>
                      <span className="ml-2 font-bold text-gray-900">{analysis.uniqueValues}</span>
                    </div>
                    <div>
                      <span className="text-green-600">القيمة الأكثر تكراراً | Most Common:</span>
                      <div className="ml-2 text-gray-900">
                        <div>{analysis.mostCommon.category}</div>
                        <div>Count: {analysis.mostCommon.count}</div>
                        <div>Percentage: {analysis.mostCommon.percentage.toFixed(2)}%</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-green-600">القيمة الأقل تكراراً | Least Common:</span>
                      <div className="ml-2 text-gray-900">
                        <div>{analysis.leastCommon.category}</div>
                        <div>Count: {analysis.leastCommon.count}</div>
                        <div>Percentage: {analysis.leastCommon.percentage.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Metrics Section */}
        {businessMetrics && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">مؤشرات الأعمال | Business Metrics</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Growth Rate */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">معدل النمو | Growth Rate</h3>
                <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-3xl font-bold text-gray-900">{businessMetrics.growthRate.toFixed(2)}%</div>
                </div>
              </div>

              {/* Customer Metrics */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">مؤشرات العملاء | Customer Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">متوسط قيمة المعاملة | Average Transaction Value</div>
                    <div className="text-2xl font-bold text-gray-900">${businessMetrics.customerMetrics.averageTransactionValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">قيمة العميل مدى الحياة | Customer Lifetime Value</div>
                    <div className="text-2xl font-bold text-gray-900">${businessMetrics.customerMetrics.customerLifetimeValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">معدل التسرب | Churn Rate</div>
                    <div className="text-2xl font-bold text-gray-900">{businessMetrics.customerMetrics.churnRate.toFixed(2)}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">معدل الاحتفاظ | Retention Rate</div>
                    <div className="text-2xl font-bold text-gray-900">{businessMetrics.customerMetrics.retentionRate.toFixed(2)}%</div>
                  </div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-green-700 mb-4">مؤشرات الأداء | Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">معدل التحويل | Conversion Rate</div>
                    <div className="text-2xl font-bold text-gray-900">{businessMetrics.performanceIndicators.conversionRate.toFixed(2)}%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">متوسط قيمة الطلب | Average Order Value</div>
                    <div className="text-2xl font-bold text-gray-900">${businessMetrics.performanceIndicators.averageOrderValue.toFixed(2)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-lg text-green-600 mb-2">الإيرادات لكل مستخدم | Revenue Per User</div>
                    <div className="text-2xl font-bold text-gray-900">${businessMetrics.performanceIndicators.revenuePerUser.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* RFM Analysis */}
              <div>
                <h3 className="text-2xl font-semibold text-green-700 mb-4">تحليل RFM | RFM Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-green-500 uppercase tracking-wider">العميل | Customer</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-green-500 uppercase tracking-wider">الحداثة | Recency (days)</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-green-500 uppercase tracking-wider">التكرار | Frequency</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-green-500 uppercase tracking-wider">القيمة النقدية | Monetary</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-200">
                      {businessMetrics.segmentation.map((segment: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{segment.customerId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{segment.recency.toFixed(0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{segment.frequency}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${segment.monetary.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptiveAnalysis;