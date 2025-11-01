import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      console.log('Sending registration request to backend...');
      
      const response = await api.post('/auth/register', userData);
      console.log('Registration API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Registration service error:', error);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        console.error('Server error response:', serverError);
        throw serverError;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        throw { message: 'No response from server. Please check your connection.' };
      } else {
        // Something else happened
        console.error('Error setting up request:', error.message);
        throw { message: 'Registration failed. Please try again.' };
      }
    }
  },

  // Login user
  async login(credentials) {
    try {
      console.log('Sending login request...');
      
      const response = await api.post('/auth/login', credentials);
      console.log('Login API response:', response);
      
      if (response.data.user) {
        // Store user data and token in localStorage
        localStorage.setItem('token', response.data.token || 'demo-token');
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Please check your connection.' };
      } else {
        throw { message: 'Login failed. Please try again.' };
      }
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }
};