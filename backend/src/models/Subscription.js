// models/Subscription.js - FIXED FOR YOUR DATABASE
const db = require('../config/database');

class Subscription {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM subscriptions ORDER BY subscription_id');
    return rows;
  }

  static async findById(subscription_id) {
    const [rows] = await db.execute(
      'SELECT * FROM subscriptions WHERE subscription_id = ?',
      [subscription_id]
    );
    return rows[0];
  }
}

module.exports = Subscription;