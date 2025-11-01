const db = require('../config/database');
const subscriptionCooldown = require('../utils/subscriptionCooldown');

class Device {
  static async register(user_id, device_name, device_token) {
    try {
      // Check device switch cooldown
      await subscriptionCooldown.checkDeviceSwitchCooldown(user_id, device_token);

      // Check if device already exists
      const [existing] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? AND device_token = ?',
        [user_id, device_token]
      );

      if (existing.length > 0) {
        // Update last login for existing device
        await db.execute(
          'UPDATE devices SET last_login = CURRENT_TIMESTAMP WHERE device_id = ?',
          [existing[0].device_id]
        );
        return {
          device_id: existing[0].device_id,
          message: 'Device login updated'
        };
      }

      // Enforce device limits (may remove oldest device)
      await subscriptionCooldown.enforceDeviceLimits(user_id);

      // Register new device
      const [result] = await db.execute(
        'INSERT INTO devices (user_id, device_name, device_token) VALUES (?, ?, ?)',
        [user_id, device_name, device_token]
      );
      
      return {
        device_id: result.insertId,
        message: 'Device registered successfully'
      };
    } catch (error) {
      console.error('Device registration error:', error);
      throw error;
    }
  }

  static async getUserDevices(user_id) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? ORDER BY last_login DESC',
        [user_id]
      );
      return rows;
    } catch (error) {
      console.error('Get user devices error:', error);
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
      console.error('Remove device error:', error);
      throw error;
    }
  }

  static async updateLastLogin(device_id) {
    try {
      await db.execute(
        'UPDATE devices SET last_login = CURRENT_TIMESTAMP WHERE device_id = ?',
        [device_id]
      );
    } catch (error) {
      console.error('Update last login error:', error);
      throw error;
    }
  }

  static async getDeviceCount(user_id) {
    try {
      const [rows] = await db.execute(
        'SELECT COUNT(*) as device_count FROM devices WHERE user_id = ?',
        [user_id]
      );
      return rows[0].device_count;
    } catch (error) {
      console.error('Get device count error:', error);
      throw error;
    }
  }

  static async getDeviceByToken(device_token) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM devices WHERE device_token = ?',
        [device_token]
      );
      return rows[0];
    } catch (error) {
      console.error('Get device by token error:', error);
      throw error;
    }
  }

  static async cleanupOldDevices(user_id, keep_count = 1) {
    try {
      // Get devices beyond the keep count, ordered by oldest login
      const [rows] = await db.execute(
        `SELECT device_id FROM devices 
         WHERE user_id = ? 
         ORDER BY last_login ASC 
         LIMIT 100 OFFSET ?`,
        [user_id, keep_count]
      );

      // Remove old devices
      for (const device of rows) {
        await this.removeDevice(device.device_id, user_id);
      }

      return { removed: rows.length };
    } catch (error) {
      console.error('Cleanup old devices error:', error);
      throw error;
    }
  }

  static async validateDeviceAccess(user_id, device_token) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? AND device_token = ?',
        [user_id, device_token]
      );

      if (rows.length === 0) {
        return {
          valid: false,
          message: 'Device not registered or access denied'
        };
      }

      // Update last login on validation
      await this.updateLastLogin(rows[0].device_id);

      return {
        valid: true,
        device: rows[0]
      };
    } catch (error) {
      console.error('Validate device access error:', error);
      throw error;
    }
  }

  static async getUserSubscriptionDeviceInfo(user_id) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          u.user_id,
          s.max_devices,
          s.cooldown_days,
          COUNT(d.device_id) as current_devices,
          (SELECT device_token FROM devices WHERE user_id = u.user_id ORDER BY last_login DESC LIMIT 1) as latest_device
         FROM users u
         LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id
         LEFT JOIN devices d ON u.user_id = d.user_id
         WHERE u.user_id = ?
         GROUP BY u.user_id, s.max_devices, s.cooldown_days`,
        [user_id]
      );

      if (rows.length === 0) {
        throw new Error('User not found');
      }

      return rows[0];
    } catch (error) {
      console.error('Get user subscription device info error:', error);
      throw error;
    }
  }

  static async forceLogoutAllDevices(user_id) {
    try {
      const [result] = await db.execute(
        'DELETE FROM devices WHERE user_id = ?',
        [user_id]
      );
      
      return {
        removed: result.affectedRows,
        message: `Logged out from ${result.affectedRows} devices`
      };
    } catch (error) {
      console.error('Force logout all devices error:', error);
      throw error;
    }
  }

  static async getDeviceActivity(user_id, days = 30) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          device_id,
          device_name,
          device_token,
          registered_at,
          last_login,
          DATEDIFF(CURRENT_TIMESTAMP, last_login) as days_since_login
         FROM devices 
         WHERE user_id = ? AND last_login >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)
         ORDER BY last_login DESC`,
        [user_id, days]
      );
      
      return rows;
    } catch (error) {
      console.error('Get device activity error:', error);
      throw error;
    }
  }
}

module.exports = Device;