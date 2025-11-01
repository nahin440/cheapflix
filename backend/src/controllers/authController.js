const User = require('../models/User');
const Device = require('../models/Device');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res) {
    try {
      const { full_name, email, password, phone, address, country, currency_code } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user_id = await User.create({
        full_name,
        email,
        password_hash,
        phone,
        address,
        country,
        currency_code: currency_code || 'GBP'
      });

      res.status(201).json({ 
        message: 'User registered successfully', 
        user_id 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },

  async login(req, res) {
    try {
      const { email, password, device_name, device_token } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Register device if provided
      if (device_token) {
        try {
          await Device.register(user.user_id, device_name || 'Unknown Device', device_token);
        } catch (deviceError) {
          return res.status(400).json({ message: deviceError.message });
        }
      }

      // Get user with subscription info
      const userWithSubscription = await User.findById(user.user_id);

      res.json({
        message: 'Login successful',
        user: {
          user_id: userWithSubscription.user_id,
          full_name: userWithSubscription.full_name,
          email: userWithSubscription.email,
          current_subscription: userWithSubscription.level_name,
          can_download: userWithSubscription.can_download,
          max_devices: userWithSubscription.max_devices
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  }
};

module.exports = authController;