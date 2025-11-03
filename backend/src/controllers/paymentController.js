const Payment = require('../models/Payment');
const currencyRates = require('../utils/currencyRates');

const paymentController = {
  async processPayment(req, res) {
    try {
      const { user_id, subscription_id, payment_method, amount, currency_code, card_last4 } = req.body;

      // Get exchange rate
      const exchange_rate = await currencyRates.getExchangeRate(currency_code, 'GBP');

      // Convert amount to GBP for storage
      const amountGBP = amount * exchange_rate;

      const payment_id = await Payment.create({
        user_id,
        subscription_id,
        payment_method,
        amount: amountGBP,
        currency_code,
        exchange_rate,
        card_last4
      });

      // Here you would integrate with actual payment gateway
      // For now, we'll simulate successful payment

      res.json({ 
        message: 'Payment processed successfully',
        payment_id,
        amount_charged: amount,
        currency: currency_code
      });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ message: 'Error processing payment' });
    }
  },

  async getPaymentHistory(req, res) {
    try {
      const user_id = req.params.userId;
      const payments = await Payment.getUserPayments(user_id);
      
      res.json({ payments });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({ message: 'Error fetching payment history' });
    }
  }
};

module.exports = paymentController;