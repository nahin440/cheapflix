const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Payment = require('../models/Payment');

const subscriptionController = {
  async getSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.getAll();
      res.json({ subscriptions });
    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({ message: 'Error fetching subscriptions' });
    }
  },

  async updateSubscription(req, res) {
    try {
      const user_id = req.params.userId;
      const { subscription_id, payment_method, card_last4 } = req.body;

      // Get current and new subscription details
      const user = await User.findById(user_id);
      const newSubscription = await Subscription.findById(subscription_id);

      if (!newSubscription) {
        return res.status(404).json({ message: 'Subscription not found' });
      }

      // Calculate amount (for upgrade, charge difference; for downgrade, charge full new price)
      let amount = newSubscription.monthly_fee;
      if (user.current_subscription_id && user.current_subscription_id < subscription_id) {
        // Upgrade - charge difference
        const currentSubscription = await Subscription.findById(user.current_subscription_id);
        amount = newSubscription.monthly_fee - currentSubscription.monthly_fee;
      }

      // Record payment if amount > 0
      if (amount > 0) {
        await Payment.create({
          user_id,
          subscription_id,
          payment_method,
          amount,
          currency_code: user.currency_code || 'GBP',
          exchange_rate: 1.0, // Simplified - would use real exchange rates
          card_last4
        });
      }

      // Update user subscription
      await User.updateSubscription(user_id, subscription_id);

      res.json({ 
        message: 'Subscription updated successfully',
        new_subscription: newSubscription.level_name,
        amount_charged: amount
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({ message: 'Error updating subscription' });
    }
  }
};

module.exports = subscriptionController;