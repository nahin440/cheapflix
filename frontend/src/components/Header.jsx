import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Film, 
  Crown, 
  Settings,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { authService } from '../services';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = authService.getCurrentUser();

  // Check if current user is the admin
  const isAdminUser = user && user.email === 'admin@cheapflix.com';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      color: "#EF4444",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/movies', label: 'Movies', icon: Film },
    { path: '/subscription', label: 'Subscription', icon: Crown },
    // Only show Admin for admin@cheapflix.com
    ...(isAdminUser ? [{ path: '/admin', label: 'Admin', icon: Settings }] : [])
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-700/50' 
          : 'bg-gray-900/80 backdrop-blur-md'
      }`}
    >
      {/* Add padding to prevent content overlap */}
      <div style={{ paddingTop: '80px' }} className="hidden"></div>
      
      <div className="container mx-auto w-11/12 px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center">
              <motion.img 
                src="/logo.png" 
                alt="CheapFlix"
                className="h-10 w-30 object-contain"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.div key={item.path} variants={navItemVariants} whileHover="hover">
                  <Link 
                    to={item.path} 
                    className={`relative flex items-center space-x-2 font-semibold transition-colors px-3 py-2 ${
                      isActive(item.path) 
                        ? 'text-red-500' 
                        : 'text-white hover:text-red-400'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="relative">
                      {item.label}
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}

            {/* User Menu */}
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Only show Profile for non-admin users */}
                {!isAdminUser && (
                  <motion.div whileHover="hover" variants={navItemVariants}>
                    <Link 
                      to="/profile" 
                      className={`flex items-center space-x-2 font-semibold px-3 py-2 ${
                        isActive('/profile') ? 'text-red-500' : 'text-white'
                      }`}
                    >
                      <User size={20} />
                      <span className="relative">
                        Profile
                        {isActive('/profile') && (
                          <motion.div
                            layoutId="activeProfileIndicator"
                            className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                )}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05, backgroundColor: "#DC2626" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl transition-all duration-200 font-semibold shadow-lg"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div whileHover="hover" variants={navItemVariants}>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 bg-gray-700/80 hover:bg-gray-600/80 px-6 py-2 rounded-xl transition-all duration-200 font-semibold backdrop-blur-sm border border-gray-600"
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" variants={navItemVariants}>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 px-6 py-2 rounded-xl transition-all duration-200 font-semibold shadow-lg"
                  >
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white p-2 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.8)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              variants={{
                closed: { rotate: 0 },
                open: { rotate: 90 }
              }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-md rounded-2xl mt-4 border border-gray-700/50 shadow-2xl"
            >
              <div className="py-4 space-y-3">
                {[
                  ...navItems,
                  // Only add Profile to mobile menu for non-admin users
                  ...(user && !isAdminUser ? [{ path: '/profile', label: 'Profile', icon: User }] : [])
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        to={item.path} 
                        className={`flex items-center space-x-3 px-6 py-3 mx-2 rounded-xl transition-all duration-200 font-semibold ${
                          isActive(item.path)
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'text-white hover:bg-gray-800/50 hover:text-red-400'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent size={20} />
                        <span>{item.label}</span>
                        {isActive(item.path) && (
                          <motion.div
                            className="w-2 h-2 bg-red-500 rounded-full ml-auto"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="px-3 pt-2"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="px-3 space-y-2 pt-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      to="/login" 
                      className="flex items-center space-x-3 w-full bg-gray-700/80 hover:bg-gray-600/80 px-6 py-3 rounded-xl transition-all duration-200 font-semibold text-center text-white border border-gray-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex items-center space-x-3 w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold text-center text-white shadow-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus size={18} />
                      <span>Sign Up</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;