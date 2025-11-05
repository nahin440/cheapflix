import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services';
import MovieCard from '../../components/MovieCard';

const FeaturedMoviesSection = ({ loading, featuredMovies }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const user = authService.getCurrentUser();

  const handleCardClick = (movie) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.current_subscription_id) {
      navigate('/subscription');
      return;
    }
    
    // If user has subscription, allow navigation to movie details
    navigate(`/movie/${movie.movie_id}`);
  };

  const handleViewAll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.current_subscription_id) {
      navigate('/subscription');
      return;
    }
    
    navigate('/movies');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    },
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/30 backdrop-blur-sm"
        >
          <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-2xl"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-700 rounded mb-3 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-transparent relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="flex justify-between items-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
              Featured Movies
            </h2>
            <p className="text-gray-400 text-lg">Recently added to our premium collection</p>
          </div>
          
          <motion.button
            onClick={handleViewAll}
            className="group flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-all duration-300"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Subscription Notice for Non-Subscribers */}
        {!user?.current_subscription_id && featuredMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-8 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm max-w-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <h3 className="text-yellow-400 font-semibold text-lg mb-1">
                  Subscribe to Start Streaming
                </h3>
                <p className="text-yellow-200/80 text-sm">
                  Preview our collection! Get full access with any subscription plan.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {featuredMovies.slice(0, 5).map((movie, index) => (
                <motion.div
                  key={movie.movie_id}
                  variants={itemVariants}
                  layout
                  className="relative"
                  onMouseEnter={() => setHoveredCard(movie.movie_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Subscription Overlay for Non-Subscribers */}
                  {!user?.current_subscription_id && (
                    <motion.div
                      className="absolute inset-0 bg-black/80 rounded-2xl z-20 flex items-center justify-center backdrop-blur-sm cursor-pointer"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => navigate('/subscription')}
                    >
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">🔒</span>
                        </div>
                        <h4 className="text-white font-semibold mb-2">Subscribe to Watch</h4>
                        <p className="text-gray-300 text-sm">Unlock full access to our library</p>
                        <motion.button
                          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Plans
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Movie Card */}
                  <motion.div
                    className={`transform transition-all duration-500 ${
                      hoveredCard === movie.movie_id 
                        ? 'scale-105 shadow-2xl shadow-red-500/20' 
                        : 'scale-100'
                    }`}
                    whileHover={{ 
                      y: -8,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <MovieCard 
                      movie={movie} 
                      index={index}
                      onCardClick={() => handleCardClick(movie)}
                      showPlayButton={!!user?.current_subscription_id}
                    />
                  </motion.div>

                  {/* Hover Indicator */}
                  <AnimatePresence>
                    {hoveredCard === movie.movie_id && (
                      <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-red-500 to-purple-500 rounded-full"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 48, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && featuredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎭</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Featured Movies</h3>
            <p className="text-gray-400">Check back later for new additions</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMoviesSection;