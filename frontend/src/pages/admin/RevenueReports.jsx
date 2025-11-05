import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Download,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
  AlertCircle,
  Eye
} from 'lucide-react';

const RevenueReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const [revenueRes, paymentsRes] = await Promise.all([
        adminService.getRevenueReport(timeRange),
        adminService.getAllPayments(timeRange)
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
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
    const totalSubscribers = new Set(payments.map(p => p.user_id)).size;
    const totalTransactions = payments.length;
    
    return {
      totalRevenue,
      totalSubscribers,
      totalTransactions,
      averageRevenue: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
    };
  };

  const { totalRevenue, totalSubscribers, totalTransactions, averageRevenue } = calculateTotals();

  const getSubscriptionStats = () => {
    const stats = {
      'Level 1': { count: 0, revenue: 0, color: 'from-blue-500 to-cyan-500' },
      'Level 2': { count: 0, revenue: 0, color: 'from-green-500 to-emerald-500' },
      'Level 3': { count: 0, revenue: 0, color: 'from-purple-500 to-pink-500' }
    };

    payments.forEach(payment => {
      const levelName = payment.level_name || 'Level 1';
      if (stats[levelName]) {
        stats[levelName].count++;
        stats[levelName].revenue += parseFloat(payment.amount || 0);
      }
    });

    return stats;
  };

  const subscriptionStats = getSubscriptionStats();

  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'year', label: 'This Year' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-xl font-light"
          >
            Loading revenue data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
        >
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Revenue Reports
            </h1>
            <p className="text-gray-400 text-lg">Financial analytics and subscription insights</p>
          </div>
          
          {/* Time Range Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
            >
              <Download size={18} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <div className="bg-red-600/20 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-6 flex items-center space-x-3">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              icon: DollarSign, 
              label: 'Total Revenue', 
              value: `£${totalRevenue.toFixed(2)}`, 
              color: 'from-blue-500 to-cyan-500',
              description: 'All Time Revenue'
            },
            { 
              icon: Users, 
              label: 'Total Subscribers', 
              value: totalSubscribers.toString(), 
              color: 'from-green-500 to-emerald-500',
              description: 'Unique Paying Users'
            },
            { 
              icon: CreditCard, 
              label: 'Total Transactions', 
              value: totalTransactions.toString(), 
              color: 'from-purple-500 to-pink-500',
              description: 'All Payments Processed'
            },
            { 
              icon: TrendingUp, 
              label: 'Average Revenue', 
              value: `£${averageRevenue.toFixed(2)}`, 
              color: 'from-yellow-500 to-orange-500',
              description: 'Per Transaction'
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-2xl border border-white/10`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-white/60 text-xs mt-1">{stat.description}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <IconComponent size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Subscription Breakdown & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subscription Revenue */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <PieChart className="mr-3" size={24} />
              Subscription Revenue
            </h2>
            <div className="space-y-4">
              {Object.entries(subscriptionStats).map(([plan, data]) => (
                <motion.div
                  key={plan}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`bg-gradient-to-r ${data.color} rounded-2xl p-6 text-white border border-white/10`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{plan}</h3>
                      <p className="text-white/70 text-sm">{data.count} subscribers</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">£{data.revenue.toFixed(2)}</p>
                      <p className="text-white/70 text-sm">
                        £{(data.revenue / (data.count || 1)).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Payments */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="mr-3" size={24} />
              Recent Payments
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {payments.length > 0 ? (
                payments.slice(0, 10).map((payment, index) => (
                  <motion.div
                    key={payment.payment_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-2xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{payment.full_name || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm truncate">{payment.email || 'No email'}</p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
                        £{parseFloat(payment.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 bg-gray-600/50 px-2 py-1 rounded">
                        {payment.level_name || 'Level 1'}
                      </span>
                      <span className="text-gray-400 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(payment.transaction_date).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCard size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No payments found</p>
                  <p className="text-gray-500 text-sm mt-1">Payments will appear here once processed</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Monthly Revenue Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="mr-3" size={24} />
              Revenue Breakdown
            </h2>
            <div className="text-gray-400 text-sm">
              Showing {revenueData.length} periods
            </div>
          </div>

          {revenueData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-6 py-4 text-left text-white font-semibold">Period</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Subscription</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Subscribers</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Revenue</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Currency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {revenueData.map((revenue, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {revenue.month || revenue.period}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                          {revenue.level_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {revenue.subscriber_count}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-bold">
                          £{parseFloat(revenue.total_revenue || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {revenue.currency_code || 'GBP'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={64} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No revenue data available</p>
              <p className="text-gray-500 text-sm">Revenue data will appear here once payments are processed</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueReports;