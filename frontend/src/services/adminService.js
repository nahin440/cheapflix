import api from './api';

export const adminService = {
  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get revenue report
  async getRevenueReport() {
    try {
      const response = await api.get('/admin/revenue');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch revenue report' };
    }
  },

  // Get all payments
  async getAllPayments() {
    try {
      const response = await api.get('/admin/payments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  },

  // Add movie
  async addMovie(movieData) {
    try {
      const response = await api.post('/admin/movies', movieData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add movie' };
    }
  }
};