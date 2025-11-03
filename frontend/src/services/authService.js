import api from './api';
import { deviceService } from './deviceService';

export const authService = {
  async login(credentials) {
    try {
      console.log('Sending login request...');
      
      let device_token = deviceService.getStoredDeviceToken();
      if (!device_token) {
        device_token = deviceService.generateDeviceToken();
        deviceService.storeDeviceToken(device_token);
      }

      const response = await api.post('/auth/login', {
        ...credentials,
        device_token,
        device_name: deviceService.getCurrentDeviceName()
      });
      
      console.log('Login API response:', response);
      
      if (response.data.success && response.data.user) {
        // Store user data
        const userData = {
          user_id: response.data.user.user_id,
          full_name: response.data.user.full_name,
          email: response.data.user.email,
          current_subscription: response.data.user.current_subscription
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('Login successful, redirecting to movies...');
        
        // Navigate to movies page
        window.location.href = '/movies';
        return response.data;
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
      
    } catch (error) {
      console.error('Login service error:', error);
      
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Please check your connection.' };
      } else {
        throw error;
      }
    }
  },

  async register(userData) {
    try {
      console.log('Sending registration request...');
      
      const device_token = deviceService.generateDeviceToken();
      deviceService.storeDeviceToken(device_token);

      const response = await api.post('/auth/register', {
        ...userData,
        device_token,
        device_name: deviceService.getCurrentDeviceName()
      });
      
      console.log('Registration API response:', response);
      
      if (response.data.success && response.data.user) {
        // Store user data
        const userData = {
          user_id: response.data.user.user_id,
          full_name: response.data.user.full_name,
          email: response.data.user.email,
          current_subscription: response.data.user.current_subscription
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('Registration successful, redirecting to movies...');
        
        // Navigate to movies page
        window.location.href = '/movies';
        return response.data;
      } else {
        throw new Error('Registration failed: Invalid response from server');
      }
      
    } catch (error) {
      console.error('Registration service error:', error);
      
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Please check your connection.' };
      } else {
        throw error;
      }
    }
  },

  logout() {
    deviceService.clearDeviceToken();
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    console.log('User logged out');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};