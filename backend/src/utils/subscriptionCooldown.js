const db = require('../config/database');

const subscriptionCooldown = {
  async checkDeviceSwitchCooldown(user_id, newDeviceToken) {
    try {
      // Get user's current subscription
      const [users] = await db.execute(
        `SELECT u.*, s.cooldown_days, s.max_devices 
         FROM users u 
         LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
         WHERE u.user_id = ?`,
        [user_id]
      );

      if (users.length === 0) return true;

      const user = users[0];
      
      // No cooldown for levels 2 and 3
      if (user.cooldown_days === 0) return true;

      // Check if user has existing devices
      const [devices] = await db.execute(
        'SELECT * FROM devices WHERE user_id = ? ORDER BY last_login DESC',
        [user_id]
      );

      if (devices.length === 0) return true;

      // Check if trying to register same device
      const existingDevice = devices.find(device => device.device_token === newDeviceToken);
      if (existingDevice) return true;

      // Check cooldown period for Level 1 users
      const latestDevice = devices[0];
      const lastLogin = new Date(latestDevice.last_login);
      const now = new Date();
      const daysSinceLastLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);

      if (daysSinceLastLogin < user.cooldown_days) {
        const remainingDays = Math.ceil(user.cooldown_days - daysSinceLastLogin);
        throw new Error(`Device switch not allowed. Please wait ${remainingDays} more day(s) before switching devices.`);
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  async enforceDeviceLimits(user_id) {
    try {
      const [users] = await db.execute(
        `SELECT u.*, s.max_devices 
         FROM users u 
         LEFT JOIN subscriptions s ON u.current_subscription_id = s.subscription_id 
         WHERE u.user_id = ?`,
        [user_id]
      );

      if (users.length === 0) return;

      const user = users[0];
      const maxDevices = user.max_devices || 1;

      // Get current devices count
      const [devices] = await db.execute(
        'SELECT COUNT(*) as device_count FROM devices WHERE user_id = ?',
        [user_id]
      );

      if (devices[0].device_count >= maxDevices) {
        // Remove oldest device if at limit
        const [oldDevices] = await db.execute(
          'SELECT device_id FROM devices WHERE user_id = ? ORDER BY last_login ASC LIMIT 1',
          [user_id]
        );

        if (oldDevices.length > 0) {
          await db.execute(
            'DELETE FROM devices WHERE device_id = ?',
            [oldDevices[0].device_id]
          );
          console.log(`Removed oldest device for user ${user_id} due to device limit`);
        }
      }
    } catch (error) {
      console.error('Device limit enforcement error:', error);
    }
  }
};

module.exports = subscriptionCooldown;