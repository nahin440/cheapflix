const db = require('../config/database');

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Find user by email error:', error);
      throw error;
    }
  }

  static async findById(user_id) {
    try {
      const [rows] = await db.execute(
        `SELECT u.*, s.level_name, s.can_download, s.max_devices 
         FROM users u 
         LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
         WHERE u.user_id = ?`,
        [user_id]
      );
      return rows[0];
    } catch (error) {
      console.error('Find user by ID error:', error);
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { full_name, email, password_hash, phone, address, country, currency_code } = userData;
      
      const [result] = await db.execute(
        'INSERT INTO users (full_name, email, password_hash, phone, address, country, currency_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [full_name, email, password_hash, phone, address, country, currency_code]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  static async updateSubscription(user_id, subscription_id) {
    try {
      const [result] = await db.execute(
        'UPDATE users SET current_subscription_id = ? WHERE user_id = ?',
        [subscription_id, user_id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update user subscription error:', error);
      throw error;
    }
  }

  static async getSubscriptionInfo(user_id) {
    try {
      const [rows] = await db.execute(
        `SELECT u.user_id, s.* 
         FROM users u 
         LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
         WHERE u.user_id = ?`,
        [user_id]
      );
      return rows[0];
    } catch (error) {
      console.error('Get user subscription info error:', error);
      throw error;
    }
  }
}

module.exports = User;