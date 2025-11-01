const db = require('../config/database');

class Payment {
  static async create(paymentData) {
    const { user_id, subscription_id, payment_method, amount, currency_code, exchange_rate, card_last4 } = paymentData;
    
    const [result] = await db.execute(
      `INSERT INTO payments (user_id, subscription_id, payment_method, amount, currency_code, exchange_rate, card_last4) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, subscription_id, payment_method, amount, currency_code, exchange_rate, card_last4]
    );
    
    return result.insertId;
  }

  static async getUserPayments(user_id) {
    const [rows] = await db.execute(
      `SELECT p.*, s.level_name 
       FROM payments p 
       JOIN subscriptions s ON p.subscription_id = s.subscription_id 
       WHERE p.user_id = ? 
       ORDER BY p.transaction_date DESC`,
      [user_id]
    );
    return rows;
  }

  static async getAllPayments() {
    const [rows] = await db.execute(
      `SELECT p.*, u.full_name, u.email, s.level_name 
       FROM payments p 
       JOIN users u ON p.user_id = u.user_id 
       JOIN subscriptions s ON p.subscription_id = s.subscription_id 
       ORDER BY p.transaction_date DESC`
    );
    return rows;
  }

  static async getRevenueReport() {
    const [rows] = await db.execute(
      `SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m') as month,
        s.level_name,
        COUNT(*) as subscriber_count,
        SUM(p.amount) as total_revenue,
        currency_code
       FROM payments p
       JOIN subscriptions s ON p.subscription_id = s.subscription_id
       GROUP BY month, s.level_name, currency_code
       ORDER BY month DESC, s.level_name`
    );
    return rows;
  }
}

module.exports = Payment;