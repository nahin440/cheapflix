import api from './api';
import { authService } from './authService';

export const userService = {
  // Get user devices from real database
  async getUserDevices() {
    try {
      console.log('Fetching user devices from API...');
      const response = await api.get('/devices');
      console.log('Devices API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get user devices error:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch devices' };
    }
  },

  // Remove device
  async removeDevice(deviceId) {
    try {
      console.log('Removing device:', deviceId);
      const response = await api.delete(`/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Remove device error:', error);
      throw error.response?.data || { success: false, message: 'Failed to remove device' };
    }
  },

  // Get device information and limits
  async getDeviceInfo() {
    try {
      console.log('Fetching device info from API...');
      const response = await api.get('/devices/info');
      console.log('Device info API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get device info error:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch device info' };
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const response = await api.get(`/users/${currentUser.user_id}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch user profile' };
    }
  }
};

export default userService;