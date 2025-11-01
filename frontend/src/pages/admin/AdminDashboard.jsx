import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Movies', value: '150', color: 'bg-blue-500', link: '/admin/manage-movies' },
    { title: 'Total Users', value: '2,847', color: 'bg-green-500', link: '/admin/users' },
    { title: 'Active Subscriptions', value: '1,923', color: 'bg-purple-500', link: '/admin/users' },
    { title: 'Monthly Revenue', value: '£15,230', color: 'bg-yellow-500', link: '/admin/revenue' },
  ];

  const quickActions = [
    { title: 'Add New Movie', description: 'Upload a new movie to the library', link: '/admin/add-movie', icon: '🎬' },
    { title: 'Manage Movies', description: 'Edit or remove existing movies', link: '/admin/manage-movies', icon: '📁' },
    { title: 'User Management', description: 'View and manage all users', link: '/admin/users', icon: '👥' },
    { title: 'Revenue Reports', description: 'View financial reports and analytics', link: '/admin/revenue', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your CheapFlix platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                  <span className="text-white font-bold text-lg">{stat.value.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center">
                <div className="text-3xl mr-4 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1">{action.title}</h3>
                  <p className="text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'New movie added', details: 'The Dark Knight', time: '2 hours ago' },
              { action: 'User registered', details: 'john@example.com', time: '4 hours ago' },
              { action: 'Subscription upgraded', details: 'Level 1 → Level 2', time: '6 hours ago' },
              { action: 'Payment processed', details: '£9.99 - Level 3', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.details}</p>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;