const db = require('../config/database');

class Device {
  static async registerDevice(user_id, device_name, device_token) {
    try {
      // Check if device already exists
      const [existing] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? AND device_token = ?',
        [user_id, device_token]
      );

      if (existing.length > 0) {
        // Update last login for existing device
        await db.execute(
          'UPDATE devices SET last_login = NOW() WHERE device_id = ?',
          [existing[0].device_id]
        );
        return { device_id: existing[0].device_id, isNew: false };
      }

      // Check device limit
      const [devices] = await db.execute(
        'SELECT COUNT(*) as count FROM devices WHERE user_id = ?',
        [user_id]
      );

      if (devices[0].count >= 3) {
        throw new Error('Device limit reached. Maximum 3 devices allowed.');
      }

      // Register new device
      const [result] = await db.execute(
        'INSERT INTO devices (user_id, device_name, device_token, registered_at, last_login) VALUES (?, ?, ?, NOW(), NOW())',
        [user_id, device_name, device_token]
      );

      return { device_id: result.insertId, isNew: true };
    } catch (error) {
      throw error;
    }
  }

  static async getUserDevices(user_id) {
    try {
      const [devices] = await db.execute(
        `SELECT 
          device_id,
          user_id,
          device_name,
          device_token,
          registered_at,
          last_login
         FROM devices 
         WHERE user_id = ? 
         ORDER BY last_login DESC`,
        [user_id]
      );
      return devices;
    } catch (error) {
      throw error;
    }
  }

  static async removeDevice(device_id, user_id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM devices WHERE device_id = ? AND user_id = ?',
        [device_id, user_id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Device not found or access denied');
      }
      
      return { message: 'Device removed successfully' };
    } catch (error) {
      throw error;
    }
  }

  static async getDeviceCount(user_id) {
    try {
      const [result] = await db.execute(
        'SELECT COUNT(*) as count FROM devices WHERE user_id = ?',
        [user_id]
      );
      return result[0].count;
    } catch (error) {
      throw error;
    }
  }

  static async validateDeviceAccess(user_id, device_token) {
    try {
      const [devices] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? AND device_token = ?',
        [user_id, device_token]
      );

      if (devices.length === 0) {
        return { valid: false };
      }

      // Update last login
      await db.execute(
        'UPDATE devices SET last_login = NOW() WHERE device_id = ?',
        [devices[0].device_id]
      );

      return {
        valid: true,
        device: devices[0]
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Device;