import api from './api';

export const userService = {
  // Get user profile
  async getProfile(userId) {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Get user devices
  async getUserDevices(userId) {
    try {
      const response = await api.get(`/users/${userId}/devices`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch devices' };
    }
  },

  // Remove device
  async removeDevice(userId, deviceId) {
    try {
      const response = await api.delete(`/users/${userId}/devices/${deviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove device' };
    }
  },

  // Get user downloads
  async getUserDownloads(userId) {
    try {
      const response = await api.get(`/users/${userId}/downloads`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch downloads' };
    }
  },

  // Get user payments
  async getUserPayments(userId) {
    try {
      const response = await api.get(`/users/${userId}/payments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  }
};