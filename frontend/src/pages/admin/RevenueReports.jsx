import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';

const RevenueReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const [revenueRes, paymentsRes] = await Promise.all([
        adminService.getRevenueReport(),
        adminService.getAllPayments()
      ]);
      
      setRevenueData(revenueRes.revenue || []);
      setPayments(paymentsRes.payments || []);
    } catch (err) {
      setError(err.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const totalSubscribers = new Set(payments.map(p => p.user_id)).size;
    
    return {
      totalRevenue,
      totalSubscribers,
      averageRevenue: totalRevenue / (payments.length || 1)
    };
  };

  const { totalRevenue, totalSubscribers, averageRevenue } = calculateTotals();

  const getSubscriptionStats = () => {
    const stats = {
      'Level 1': { count: 0, revenue: 0 },
      'Level 2': { count: 0, revenue: 0 },
      'Level 3': { count: 0, revenue: 0 }
    };

    payments.forEach(payment => {
      if (stats[payment.level_name]) {
        stats[payment.level_name].count++;
        stats[payment.level_name].revenue += parseFloat(payment.amount);
      }
    });

    return stats;
  };

  const subscriptionStats = getSubscriptionStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading revenue data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Revenue Reports</h1>
          <p className="text-gray-400">Financial analytics and subscription insights</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
            <p className="text-blue-200 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold">£{totalRevenue.toFixed(2)}</p>
            <p className="text-blue-200 text-sm mt-2">All Time</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white">
            <p className="text-green-200 text-sm">Total Subscribers</p>
            <p className="text-3xl font-bold">{totalSubscribers}</p>
            <p className="text-green-200 text-sm mt-2">Unique Users</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
            <p className="text-purple-200 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold">{payments.length}</p>
            <p className="text-purple-200 text-sm mt-2">All Payments</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg p-6 text-white">
            <p className="text-yellow-200 text-sm">Average Revenue</p>
            <p className="text-3xl font-bold">£{averageRevenue.toFixed(2)}</p>
            <p className="text-yellow-200 text-sm mt-2">Per Transaction</p>
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subscription Revenue */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Subscription Revenue</h2>
            <div className="space-y-4">
              {Object.entries(subscriptionStats).map(([plan, data]) => (
                <div key={plan} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{plan}</p>
                    <p className="text-gray-400 text-sm">{data.count} subscribers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">£{data.revenue.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">
                      £{(data.revenue / (data.count || 1)).toFixed(2)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Payments</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.slice(0, 10).map(payment => (
                <div key={payment.payment_id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{payment.full_name}</p>
                      <p className="text-gray-400 text-sm">{payment.email}</p>
                    </div>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                      £{payment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{payment.level_name}</span>
                    <span>{new Date(payment.transaction_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Table */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Monthly Revenue Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-white font-semibold">Month</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Subscription</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Subscribers</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Revenue</th>
                  <th className="px-6 py-3 text-left text-white font-semibold">Currency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {revenueData.map((revenue, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-6 py-4 text-white">
                      {revenue.month}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {revenue.level_name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {revenue.subscriber_count}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      £{parseFloat(revenue.total_revenue).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {revenue.currency_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {revenueData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No revenue data available</p>
              <p className="text-gray-500 text-sm">Revenue data will appear here once payments are processed</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
            Export Report (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports;