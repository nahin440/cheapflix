// this is src/models/Device.js

const db = require('../config/database');

class Device {
  static async register(user_id, device_name, device_token) {
    try {
      console.log('Device.register called with:', { user_id, device_name, device_token });

      // Check if device already exists for this user
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
        console.log('Device login updated:', existing[0].device_id);
        return {
          device_id: existing[0].device_id,
          message: 'Device login updated'
        };
      }

      // Get user's subscription to check device limits
      const [userRows] = await db.execute(
        'SELECT current_subscription_id FROM users WHERE user_id = ?',
        [user_id]
      );
      
      const subscription_id = userRows[0]?.current_subscription_id || 1;
      let max_devices = 1;
      
      // Level 3 allows 3 devices, others allow 1
      if (subscription_id === 3) {
        max_devices = 3;
      }

      // Check current device count
      const [deviceCountRows] = await db.execute(
        'SELECT COUNT(*) as count FROM devices WHERE user_id = ?',
        [user_id]
      );
      
      const currentDeviceCount = deviceCountRows[0].count;
      console.log(`User ${user_id} has ${currentDeviceCount} devices, limit is ${max_devices}`);

      // Check if device limit exceeded
      if (currentDeviceCount >= max_devices) {
        // For Level 1 subscription, check cooldown
        if (subscription_id === 1) {
          // Get the most recent device
          const [recentDevices] = await db.execute(
            'SELECT * FROM devices WHERE user_id = ? ORDER BY last_login DESC LIMIT 1',
            [user_id]
          );
          
          if (recentDevices.length > 0) {
            const lastLogin = new Date(recentDevices[0].last_login);
            const now = new Date();
            const daysSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
            
            if (daysSinceLastLogin < 7) {
              throw new Error(`Level 1 subscription: Cannot switch devices. Wait ${Math.ceil(7 - daysSinceLastLogin)} more days.`);
            }
          }
        }
        
        // Remove oldest device to make room
        const [oldestDevices] = await db.execute(
          'SELECT device_id FROM devices WHERE user_id = ? ORDER BY last_login ASC LIMIT 1',
          [user_id]
        );
        
        if (oldestDevices.length > 0) {
          await db.execute(
            'DELETE FROM devices WHERE device_id = ?',
            [oldestDevices[0].device_id]
          );
          console.log('Removed oldest device:', oldestDevices[0].device_id);
        }
      }

      // Register new device
      const [result] = await db.execute(
        'INSERT INTO devices (user_id, device_name, device_token) VALUES (?, ?, ?)',
        [user_id, device_name, device_token]
      );
      
      console.log('New device registered:', result.insertId);
      
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
}

module.exports = Device;