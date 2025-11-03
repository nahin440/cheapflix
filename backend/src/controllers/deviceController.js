const Device = require('../models/Device');
const User = require('../models/User');

const deviceController = {
  async getUserDevices(req, res) {
    try {
      const user_id = req.user.user_id;
      console.log('Fetching devices for user:', user_id);
      
      const devices = await Device.getUserDevices(user_id);
      
      console.log('Found devices:', devices);
      
      res.json({
        success: true,
        devices: devices
      });
    } catch (error) {
      console.error('Get user devices error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch devices'
      });
    }
  },

  async removeDevice(req, res) {
    try {
      const user_id = req.user.user_id;
      const { device_id } = req.params;

      console.log(`Removing device ${device_id} for user ${user_id}`);
      
      await Device.removeDevice(device_id, user_id);
      
      res.json({
        success: true,
        message: 'Device removed successfully'
      });
    } catch (error) {
      console.error('Remove device error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to remove device'
      });
    }
  },

  async getDeviceInfo(req, res) {
    try {
      const user_id = req.user.user_id;
      console.log('Getting device info for user:', user_id);
      
      const deviceCount = await Device.getDeviceCount(user_id);
      const user = await User.findById(user_id);
      
      // Get max devices from subscription or default to 1
      const maxDevices = user?.max_devices || 1;
      
      console.log(`User ${user_id}: ${deviceCount}/${maxDevices} devices`);
      
      res.json({
        success: true,
        current_devices: deviceCount,
        max_devices: maxDevices,
        can_add_more: deviceCount < maxDevices,
        subscription_level: user?.level_name || 'No Subscription'
      });
    } catch (error) {
      console.error('Get device info error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch device info'
      });
    }
  }
};

module.exports = deviceController;