// services/subscriptionService.js - COMPLETE WITH ALL METHODS
import api from './api';

export const subscriptionService = {
  async getSubscriptions() {
    try {
      console.log('🔄 getSubscriptions called');
      const response = await api.get('/subscriptions');
      console.log('✅ getSubscriptions response:', response.data);
      
      // Multiple format checks
      if (response.data && response.data.subscriptions) {
        return response.data.subscriptions;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data;
      } else {
        console.warn('❓ Unexpected subscriptions format, using fallback');
        return this.getDefaultSubscriptions();
      }
    } catch (error) {
      console.error('❌ getSubscriptions failed:', error);
      // Return fallback immediately without throwing
      return this.getDefaultSubscriptions();
    }
  },

  async getCurrentSubscription(userId) {
    try {
      console.log(`🔄 getCurrentSubscription called for user ${userId}`);
      const response = await api.get(`/users/${userId}/profile`);
      console.log('✅ getCurrentSubscription response:', response.data);
      
      if (response.data && response.data.user) {
        const user = response.data.user;
        
        if (!user.current_subscription_id) {
          return this.getFreeSubscription();
        }
        
        return {
          current_subscription_id: user.current_subscription_id,
          level_name: user.level_name || 'Unknown',
          can_download: user.can_download || false,
          max_devices: user.max_devices || 1
        };
      } else {
        console.warn('❓ No user data in response');
        return this.getFreeSubscription();
      }
    } catch (error) {
      console.error('❌ getCurrentSubscription failed:', error);
      // Return fallback immediately without throwing
      return this.getFreeSubscription();
    }
  },

  // ADD THE MISSING METHOD
  async updateSubscription(userId, subscriptionData) {
    try {
      console.log(`🔄 updateSubscription called for user ${userId}`, subscriptionData);
      
      const response = await api.put(`/subscriptions/${userId}/update`, subscriptionData);
      console.log('✅ updateSubscription response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ updateSubscription failed:', error);
      
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'No response from server. Please check your connection.' };
      } else {
        throw { message: 'Subscription update failed. Please try again.' };
      }
    }
  },

  getDefaultSubscriptions() {
    console.log('🔄 Using default subscriptions');
    return [
      { subscription_id: 1, level_name: 'Level 1', monthly_fee: 4.99, can_download: false, max_devices: 1, cooldown_days: 7 },
      { subscription_id: 2, level_name: 'Level 2', monthly_fee: 7.99, can_download: true, max_devices: 1, cooldown_days: 0 },
      { subscription_id: 3, level_name: 'Level 3', monthly_fee: 9.99, can_download: true, max_devices: 3, cooldown_days: 0 }
    ];
  },

  getFreeSubscription() {
    return {
      current_subscription_id: null,
      level_name: 'Free',
      can_download: false,
      max_devices: 1
    };
  }
};