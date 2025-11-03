import api from './api';

export const deviceService = {
  // Generate a unique device token
  generateDeviceToken() {
    return 'device_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  },

  // Store device token in localStorage
  storeDeviceToken(token) {
    localStorage.setItem('device_token', token);
  },

  // Get stored device token
  getStoredDeviceToken() {
    return localStorage.getItem('device_token');
  },

  // Clear device token
  clearDeviceToken() {
    localStorage.removeItem('device_token');
  },

  // Get current device name
  getCurrentDeviceName() {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
      return 'Mobile Device';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  },

  // Register device
  async registerDevice(deviceData) {
    try {
      const response = await api.post('/devices/register', deviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register device' };
    }
  },

  // Force logout from all devices except current
  async forceLogoutAll() {
    try {
      const response = await api.post('/devices/logout-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to logout from all devices' };
    }
  },

  // Validate current device
  async validateDevice() {
    try {
      const response = await api.get('/devices/validate');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to validate device' };
    }
  }
};