import { useState, useEffect } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const authStatus = authService.isAuthenticated();
      
      console.log('Auth hook update:', { currentUser, authStatus });
      
      setUser(currentUser);
      setIsAuthenticated(authStatus);
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (across tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  return { user, isAuthenticated };
};