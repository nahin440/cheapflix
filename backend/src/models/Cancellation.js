const db = require('../config/database');

class Cancellation {
  static async requestCancellation(user_id, cancellation_date) {
    const [result] = await db.execute(
      'INSERT INTO cancellation_requests (user_id, requested_at, effective_date) VALUES (?, CURRENT_TIMESTAMP, ?)',
      [user_id, cancellation_date]
    );
    
    return result.insertId;
  }

  static async getCancellationRequest(user_id) {
    const [rows] = await db.execute(
      'SELECT * FROM cancellation_requests WHERE user_id = ? ORDER BY requested_at DESC LIMIT 1',
      [user_id]
    );
    return rows[0];
  }

  static async cancelUserSubscription(user_id) {
    await db.execute(
      'UPDATE users SET current_subscription_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user_id]
    );
    
    // Remove all devices
    await db.execute(
      'DELETE FROM devices WHERE user_id = ?',
      [user_id]
    );
  }

  static async processScheduledCancellations() {
    const today = new Date().toISOString().split('T')[0];
    
    const [cancellations] = await db.execute(
      'SELECT * FROM cancellation_requests WHERE effective_date <= ? AND processed = 0',
      [today]
    );

    for (const cancellation of cancellations) {
      await this.cancelUserSubscription(cancellation.user_id);
      
      // Mark as processed
      await db.execute(
        'UPDATE cancellation_requests SET processed = 1 WHERE request_id = ?',
        [cancellation.request_id]
      );
      
      console.log(`Processed cancellation for user ${cancellation.user_id}`);
    }
  }
}

module.exports = Cancellation;