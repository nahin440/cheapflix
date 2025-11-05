import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieService, adminService } from '../../services';
import { Play, Film, Users, Crown } from 'lucide-react';

const HeroSection = ({ user }) => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [moviesRes, usersRes] = await Promise.all([
        movieService.getAllMovies().catch(err => ({ movies: [] })),
        adminService.getAllUsers().catch(err => ({ users: [] }))
      ]);

      const movies = moviesRes.movies || [];
      const users = usersRes.users || [];
      const activeSubscriptions = users.filter(user => user.current_subscription_id).length;

      setStats({
        totalMovies: movies.length,
        totalUsers: users.length,
        activeSubscriptions
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-20 pb-16 px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Clean Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-600/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-purple-600/10 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-center items-center min-h-screen">
        {/* Main Content */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          >
            <span className="text-white">Cheap</span>
            <span className="text-red-600">Flix</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Premium streaming experience at an unbeatable price. 
            Watch thousands of movies in stunning quality, no ads, no commitments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <Play size={20} className="fill-current" />
                  <span>Start Free Trial</span>
                </Link>
                <Link 
                  to="/movies" 
                  className="border-2 border-gray-600 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                >
                  Browse Movies
                </Link>
              </>
            ) : (
              <Link 
                to="/movies" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <Play size={20} className="fill-current" />
                <span>Continue Watching</span>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {/* Movies Stat */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-white">
                    {loading ? '...' : stats.totalMovies.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400">+</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Movies & Shows</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl">
                <Film size={24} className="text-red-400" />
              </div>
            </div>
          </div>

          {/* Users Stat */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-white">
                    {loading ? '...' : stats.totalUsers.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400">+</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Happy Members</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Users size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          {/* Subscriptions Stat */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-white">
                    {loading ? '...' : stats.activeSubscriptions.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400">+</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">Active Streams</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Crown size={24} className="text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">4K Ultra HD Quality</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">No Advertisements</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">Cancel Anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;