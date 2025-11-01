import api from './api';

export const subscriptionService = {
  // Get all subscription plans
  async getSubscriptions() {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subscriptions' };
    }
  },

  // Update user subscription
  async updateSubscription(userId, subscriptionData) {
    try {
      const response = await api.put(`/subscriptions/${userId}/update`, subscriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update subscription' };
    }
  },

  // Get subscription by ID
  async getSubscriptionById(subscriptionId) {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subscription' };
    }
  }
};