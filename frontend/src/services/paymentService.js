import api from './api';

export const paymentService = {
  // Process payment
  async processPayment(paymentData) {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment failed' };
    }
  },

  // Get payment history
  async getPaymentHistory(userId) {
    try {
      const response = await api.get(`/payments/${userId}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  }
};