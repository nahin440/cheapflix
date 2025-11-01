const db = require('../config/database');
const emailService = require('./emailService');
const Payment = require('../models/Payment');

const billingService = {
  async processMonthlyBilling() {
    try {
      console.log('Starting monthly billing process...');
      
      // Get all active users with subscriptions
      const [users] = await db.execute(
        `SELECT u.*, s.monthly_fee, s.level_name 
         FROM users u 
         JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
         WHERE u.current_subscription_id IS NOT NULL`
      );

      let successfulCharges = 0;
      let failedCharges = 0;

      for (const user of users) {
        try {
          // Simulate payment processing
          // In real implementation, integrate with payment gateway like Stripe
          const paymentSuccessful = await this.chargeUser(user);
          
          if (paymentSuccessful) {
            successfulCharges++;
            
            // Send receipt email
            await emailService.sendPaymentReceipt(user.email, {
              amount: user.monthly_fee,
              currency_code: user.currency_code || 'GBP',
              level_name: user.level_name,
              transaction_date: new Date(),
              payment_method: 'CreditCard', // Assuming saved card
              payment_id: `BILL_${Date.now()}_${user.user_id}`
            });
            
            console.log(`Successfully charged user ${user.email}: ${user.currency_code} ${user.monthly_fee}`);
          } else {
            failedCharges++;
            console.log(`Failed to charge user ${user.email}`);
            
            // Here you would handle failed payments (retry logic, suspension, etc.)
            await this.handleFailedPayment(user);
          }
        } catch (error) {
          failedCharges++;
          console.error(`Error charging user ${user.email}:`, error);
        }
      }

      console.log(`Billing completed: ${successfulCharges} successful, ${failedCharges} failed`);
      return { successfulCharges, failedCharges };
    } catch (error) {
      console.error('Monthly billing process error:', error);
      throw error;
    }
  },

  async chargeUser(user) {
    try {
      // Simulate payment gateway integration
      // In production, replace with actual payment processor like Stripe
      const paymentSuccess = Math.random() > 0.1; // 90% success rate for simulation
      
      if (paymentSuccess) {
        // Record payment in database
        await Payment.create({
          user_id: user.user_id,
          subscription_id: user.current_subscription_id,
          payment_method: 'CreditCard',
          amount: user.monthly_fee,
          currency_code: user.currency_code || 'GBP',
          exchange_rate: 1.0,
          card_last4: '4242' // Simulated last 4 digits
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error charging user ${user.user_id}:`, error);
      return false;
    }
  },

  async handleFailedPayment(user) {
    // Implement failed payment logic:
    // - Send payment failure email
    // - Retry logic
    // - Account suspension after multiple failures
    // - Payment method update requests
    
    const subject = 'Payment Failed - CheapFlix';
    const message = `
      <h2>Payment Failed</h2>
      <p>We were unable to process your monthly subscription payment for CheapFlix.</p>
      <p><strong>Amount:</strong> ${user.currency_code} ${user.monthly_fee}</p>
      <p><strong>Subscription:</strong> ${user.level_name}</p>
      <p>Please update your payment method to avoid service interruption.</p>
      <p>You have 3 days to update your payment details before your account is temporarily suspended.</p>
    `;
    
    await emailService.sendEmail(user.email, subject, message, 'General');
  },

  async processSubscriptionUpgrade(user_id, new_subscription_id) {
    try {
      const [user] = await db.execute(
        'SELECT * FROM users WHERE user_id = ?',
        [user_id]
      );
      
      const [currentSub] = await db.execute(
        'SELECT * FROM subscriptions WHERE subscription_id = (SELECT current_subscription_id FROM users WHERE user_id = ?)',
        [user_id]
      );
      
      const [newSub] = await db.execute(
        'SELECT * FROM subscriptions WHERE subscription_id = ?',
        [new_subscription_id]
      );

      if (currentSub.length > 0 && newSub.length > 0) {
        const currentFee = currentSub[0].monthly_fee;
        const newFee = newSub[0].monthly_fee;
        
        // Charge difference for upgrades
        if (newFee > currentFee) {
          const difference = newFee - currentFee;
          return await this.chargeUser({
            ...user[0],
            monthly_fee: difference
          });
        }
        // Downgrades are free (no refunds as per requirements)
      }
      
      return true;
    } catch (error) {
      console.error('Subscription upgrade error:', error);
      throw error;
    }
  }
};

module.exports = billingService;