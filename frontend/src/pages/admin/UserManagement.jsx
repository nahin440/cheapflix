import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services';
import { 
  Users, 
  Filter, 
  Search, 
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  MoreVertical
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'withSubscription') return matchesSearch && user.current_subscription_id;
    if (filter === 'withoutSubscription') return matchesSearch && !user.current_subscription_id;
    if (filter === 'level1') return matchesSearch && user.level_name === 'Level 1';
    if (filter === 'level2') return matchesSearch && user.level_name === 'Level 2';
    if (filter === 'level3') return matchesSearch && user.level_name === 'Level 3';
    
    return matchesSearch;
  });

  const getSubscriptionBadge = (user) => {
    if (!user.current_subscription_id) {
      return (
        <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">
          No Subscription
        </span>
      );
    }
    
    const colors = {
      'Level 1': 'bg-blue-500',
      'Level 2': 'bg-green-500', 
      'Level 3': 'bg-purple-500'
    };
    
    return (
      <span className={`${colors[user.level_name] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
        <Crown size={12} />
        <span>{user.level_name || 'Unknown'}</span>
      </span>
    );
  };

  const getStats = () => {
    const totalUsers = users.length;
    const subscribedUsers = users.filter(u => u.current_subscription_id).length;
    const level1Users = users.filter(u => u.level_name === 'Level 1').length;
    const level2Users = users.filter(u => u.level_name === 'Level 2').length;
    const level3Users = users.filter(u => u.level_name === 'Level 3').length;

    return { totalUsers, subscribedUsers, level1Users, level2Users, level3Users };
  };

  const stats = getStats();

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
            Loading users...
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
              User Management
            </h1>
            <p className="text-gray-400 text-lg">Manage all registered users and their subscriptions</p>
          </div>
          <div className="text-white text-lg">
            Total Users: <span className="font-bold text-2xl">{stats.totalUsers}</span>
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
              <span className="font-medium">{error}</span>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {[
            { label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-cyan-500', icon: Users },
            { label: 'Subscribed', value: stats.subscribedUsers, color: 'from-green-500 to-emerald-500', icon: Crown },
            { label: 'Level 1', value: stats.level1Users, color: 'from-purple-500 to-pink-500', icon: User },
            { label: 'Level 2', value: stats.level2Users, color: 'from-yellow-500 to-orange-500', icon: User },
            { label: 'Level 3', value: stats.level3Users, color: 'from-red-500 to-pink-500', icon: User },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 text-white shadow-2xl border border-white/10`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/80 text-xs font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <IconComponent size={18} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-white mb-3 font-medium flex items-center">
                <Search size={16} className="mr-2" />
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div>
              <label className="block text-white mb-3 font-medium flex items-center">
                <Filter size={16} className="mr-2" />
                Filter Users
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: `All (${stats.totalUsers})` },
                  { value: 'withSubscription', label: `Subscribed (${stats.subscribedUsers})` },
                  { value: 'withoutSubscription', label: `No Sub (${stats.totalUsers - stats.subscribedUsers})` },
                  { value: 'level1', label: `Level 1 (${stats.level1Users})` },
                  { value: 'level2', label: `Level 2 (${stats.level2Users})` },
                  { value: 'level3', label: `Level 3 (${stats.level3Users})` },
                ].map(filterOption => (
                  <motion.button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      filter === filterOption.value
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {filterOption.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Grid - FIXED: Removed stagger animation that was causing issues */}
        <motion.div 
          key={`users-grid-${filter}-${searchTerm}`} // Unique key to force re-render
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Users className="mr-3" size={24} />
            User Directory ({filteredUsers.length} users)
          </h2>

          {filteredUsers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users size={64} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-xl mb-2">No users found</p>
              <p className="text-gray-500 text-sm">Try changing your search or filter criteria</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={`user-${user.user_id}-${index}`} // Enhanced key with index
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }} // Simpler animation
                  className="bg-gray-700/30 rounded-2xl p-6 border border-gray-600/50 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
                >
                  {/* User Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-500/20 p-3 rounded-xl">
                        <User size={20} className="text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{user.full_name}</h3>
                        <p className="text-gray-400 text-sm">ID: {user.user_id}</p>
                      </div>
                    </div>
                    {getSubscriptionBadge(user)}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Mail size={16} />
                      <span className="text-sm truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Phone size={16} />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    {user.country && (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin size={16} />
                        <span className="text-sm">{user.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-600/50">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar size={14} />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserManagement;