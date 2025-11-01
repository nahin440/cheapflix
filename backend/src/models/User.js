const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { full_name, email, password_hash, phone, address, country, currency_code } = userData;
    
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password_hash, phone, address, country, currency_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [full_name, email, password_hash, phone, address, country, currency_code]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(user_id) {
    const [rows] = await db.execute(
      'SELECT u.*, s.level_name, s.monthly_fee, s.max_devices, s.can_download FROM users u LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id WHERE u.user_id = ?',
      [user_id]
    );
    return rows[0];
  }

  static async updateSubscription(user_id, subscription_id) {
    await db.execute(
      'UPDATE users SET current_subscription_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [subscription_id, user_id]
    );
  }

  static async getAll() {
    const [rows] = await db.execute(
      `SELECT u.*, s.level_name 
       FROM users u 
       LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id`
    );
    return rows;
  }

  // Add the missing update method
  static async update(user_id, updateData) {
    const { full_name, phone, address, country, currency_code } = updateData;
    
    const [result] = await db.execute(
      'UPDATE users SET full_name = ?, phone = ?, address = ?, country = ?, currency_code = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [full_name, phone, address, country, currency_code, user_id]
    );
    
    return result;
  }
}

module.exports = User;