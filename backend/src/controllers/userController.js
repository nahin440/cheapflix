const User = require('../models/User');
const Device = require('../models/Device');
const Download = require('../models/Download');
const Payment = require('../models/Payment');

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json({ 
        success: true,
        users 
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching users' 
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user_id = req.params.userId;
      const user = await User.findById(user_id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      res.json({ 
        success: true,
        user 
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching profile' 
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const user_id = req.params.userId;
      const { full_name, phone, address, country, currency_code } = req.body;

      // Validate required fields
      if (!full_name) {
        return res.status(400).json({
          success: false,
          message: 'Full name is required'
        });
      }

      await User.update(user_id, { full_name, phone, address, country, currency_code });

      res.json({ 
        success: true,
        message: 'Profile updated successfully' 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error updating profile' 
      });
    }
  },

  async getDevices(req, res) {
    try {
      const user_id = req.params.userId;
      const devices = await Device.getUserDevices(user_id);
      
      res.json({ 
        success: true,
        devices 
      });
    } catch (error) {
      console.error('Get devices error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching devices' 
      });
    }
  },

  async removeDevice(req, res) {
    try {
      const { userId, deviceId } = req.params;
      
      await Device.removeDevice(deviceId, userId);
      
      res.json({ 
        success: true,
        message: 'Device removed successfully' 
      });
    } catch (error) {
      console.error('Remove device error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error removing device' 
      });
    }
  },

  async getDownloads(req, res) {
    try {
      const user_id = req.params.userId;
      const downloads = await Download.getUserDownloads(user_id);
      
      res.json({ 
        success: true,
        downloads 
      });
    } catch (error) {
      console.error('Get downloads error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching downloads' 
      });
    }
  },

  async getPayments(req, res) {
    try {
      const user_id = req.params.userId;
      const payments = await Payment.getUserPayments(user_id);
      
      res.json({ 
        success: true,
        payments 
      });
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching payments' 
      });
    }
  }
};

module.exports = userController;