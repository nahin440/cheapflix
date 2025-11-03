const db = require('../config/database');

class Download {
  static async create(user_id, movie_id) {
    const [result] = await db.execute(
      'INSERT INTO downloads (user_id, movie_id) VALUES (?, ?)',
      [user_id, movie_id]
    );
    
    return result.insertId;
  }

  static async getUserDownloads(user_id) {
    const [rows] = await db.execute(
      `SELECT d.*, m.title, m.genre, m.duration, m.thumbnail_url 
       FROM downloads d 
       JOIN movies m ON d.movie_id = m.movie_id 
       WHERE d.user_id = ? 
       ORDER BY d.download_date DESC`,
      [user_id]
    );
    return rows;
  }

  static async checkDownloadPermission(user_id) {
    const [rows] = await db.execute(
      `SELECT s.can_download 
       FROM users u 
       JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
       WHERE u.user_id = ?`,
      [user_id]
    );
    
    return rows[0]?.can_download === 1;
  }
}

module.exports = Download;