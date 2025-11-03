import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authStatus = authService.isAuthenticated();
      
      console.log('Header auth check:', { currentUser, authStatus });
      
      setUser(currentUser);
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    authService.logout();
  };

  const isActive = (path) => location.pathname === path;

  console.log('Header rendering with:', { user, isAuthenticated });

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition-colors">
            CheapFlix
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/" 
              className={`hover:text-red-500 transition-colors ${
                isActive('/') ? 'text-red-500' : 'text-white'
              }`}
            >
              Home
            </Link>
            
            {/* Show these links only when authenticated */}
            {isAuthenticated && user && (
              <>
                <Link 
                  to="/movies" 
                  className={`hover:text-red-500 transition-colors ${
                    isActive('/movies') ? 'text-red-500' : 'text-white'
                  }`}
                >
                  Movies
                </Link>
                <Link 
                  to="/subscription" 
                  className={`hover:text-red-500 transition-colors ${
                    isActive('/subscription') ? 'text-red-500' : 'text-white'
                  }`}
                >
                  Subscription
                </Link>
                <Link 
                  to="/admin" 
                  className={`hover:text-red-500 transition-colors ${
                    isActive('/admin') ? 'text-red-500' : 'text-white'
                  }`}
                >
                  Admin
                </Link>
              </>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.full_name}</span>
                <Link 
                  to="/profile" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-white"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link 
              to="/" 
              className="block hover:text-red-500 transition-colors text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Show these links only when authenticated */}
            {isAuthenticated && user && (
              <>
                <Link 
                  to="/movies" 
                  className="block hover:text-red-500 transition-colors text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Movies
                </Link>
                <Link 
                  to="/subscription" 
                  className="block hover:text-red-500 transition-colors text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subscription
                </Link>
                <Link 
                  to="/admin" 
                  className="block hover:text-red-500 transition-colors text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </>
            )}
            
            {isAuthenticated && user ? (
              <>
                <div className="text-gray-300 py-2 border-b border-gray-700">
                  Welcome, {user.full_name}
                </div>
                <Link 
                  to="/profile" 
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  className="block bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-center text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-center text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;