import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

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

            {/* Admin Link - Only show for logged-in users */}
            {user && (
              <Link 
                to="/admin" 
                className={`hover:text-red-500 transition-colors ${
                  isActive('/admin') ? 'text-red-500' : 'text-white'
                }`}
              >
                Admin
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className={`hover:text-red-500 transition-colors ${
                    isActive('/profile') ? 'text-red-500' : 'text-white'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
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
              className="block hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="block hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              to="/subscription" 
              className="block hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Subscription
            </Link>
            
            {/* Admin Link in Mobile Menu */}
            {user && (
              <Link 
                to="/admin" 
                className="block hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/login" 
                  className="block bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-center"
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