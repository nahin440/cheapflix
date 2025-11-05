import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Play, Clapperboard, Popcorn } from 'lucide-react';

const ErrorPage = ({ errorCode = 404, message = "Page Not Found" }) => {
  const cinematicVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const filmReelVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0">
        {/* Film Grain Effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBvcGFjaXR5PSIwLjAzIj4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMwMDAiLz4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')] opacity-10"></div>
        
        {/* Spotlight Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

        {/* Floating Popcorn */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={floatingVariants}
            animate="float"
            transition={{ delay: i * 0.5 }}
          >
            <Popcorn size={24} />
          </motion.div>
        ))}
      </div>

      {/* Film Reel Borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-gray-800 to-transparent border-b border-gray-700/50">
        <div className="flex justify-between px-8">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-600 rounded-full"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-gray-800 to-transparent border-t border-gray-700/50">
        <div className="flex justify-between px-8">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-600 rounded-full"></div>
          ))}
        </div>
      </div>

      <motion.div
        variants={cinematicVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Film Reel */}
          <motion.div
            variants={filmReelVariants}
            animate="animate"
            className="relative mb-8 mx-auto w-32 h-32"
          >
            <div className="absolute inset-0 bg-gray-800 rounded-full border-4 border-gray-600"></div>
            <div className="absolute inset-4 bg-gray-900 rounded-full"></div>
            <div className="absolute inset-2 border-2 border-dashed border-gray-600 rounded-full"></div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-6 bg-gray-700"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(40px)`,
                }}
              />
            ))}
          </motion.div>

          {/* Error Code with Cinema Style */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="relative inline-block">
              <motion.h1 
                className="text-9xl md:text-12xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  delay: 0.5 
                }}
              >
                {errorCode}
              </motion.h1>
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 blur-2xl rounded-full"></div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {message}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Looks like this scene got cut from the final edit. 
              Don't worry, there's plenty more entertainment waiting for you!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="flex items-center space-x-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl"
              >
                <Home size={20} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/movies"
                className="flex items-center space-x-3 border-2 border-gray-600 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                <Film size={20} />
                <span>Browse Movies</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Cinematic Footer */}
          <motion.div 
            variants={itemVariants}
            className="text-gray-500 text-sm"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clapperboard size={16} />
                <span>THE END</span>
              </div>
            </div>
            <p>© {new Date().getFullYear()} CheapFlix - Premium Streaming Experience</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Countdown Timer Effect */}
      <div className="absolute bottom-8 left-8 text-gray-500 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Reel {errorCode}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;