const User = require('../models/User');
const Device = require('../models/Device');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    try {
      const { full_name, email, password, phone, address, country, currency_code, device_token, device_name } = req.body;

      console.log('Registration request for:', email);

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'User already exists with this email' 
        });
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

      console.log('User created with ID:', user_id);

      // Register device if token provided
      let deviceWarning = null;
      if (device_token) {
        try {
          await Device.registerDevice(user_id, device_name || 'Unknown Device', device_token);
          console.log('Device registered successfully');
        } catch (deviceError) {
          deviceWarning = deviceError.message;
          console.warn('Device registration warning:', deviceWarning);
        }
      }

      // Get complete user info
      const newUser = await User.findById(user_id);

      // Generate JWT token
      const token = jwt.sign(
        { user_id: newUser.user_id, email: newUser.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      const response = {
        success: true,
        message: 'User registered successfully',
        token: token,
        user: {
          user_id: newUser.user_id,
          full_name: newUser.full_name,
          email: newUser.email,
          current_subscription: newUser.level_name || 'No Subscription',
          max_devices: newUser.max_devices || 1,
          can_download: newUser.can_download || false
        }
      };

      // Add device warning if any
      if (deviceWarning) {
        response.device_warning = deviceWarning;
      }

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error registering user: ' + error.message
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password, device_name, device_token } = req.body;

      console.log('Login attempt for:', email);

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }

      // Register device if token provided
      let deviceWarning = null;
      if (device_token) {
        try {
          await Device.registerDevice(user.user_id, device_name || 'Unknown Device', device_token);
          console.log('Device registered/updated for login');
        } catch (deviceError) {
          deviceWarning = deviceError.message;
          console.warn('Device registration warning:', deviceWarning);
        }
      }

      // Get complete user info
      const userWithSubscription = await User.findById(user.user_id);

      // Generate JWT token
      const token = jwt.sign(
        { user_id: userWithSubscription.user_id, email: userWithSubscription.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
      );

      const response = {
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          user_id: userWithSubscription.user_id,
          full_name: userWithSubscription.full_name,
          email: userWithSubscription.email,
          current_subscription: userWithSubscription.level_name || 'No Subscription',
          max_devices: userWithSubscription.max_devices || 1,
          can_download: userWithSubscription.can_download || false
        }
      };

      // Add device warning if any
      if (deviceWarning) {
        response.device_warning = deviceWarning;
      }

      console.log('Login successful for user:', userWithSubscription.user_id);
      res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error during login: ' + error.message
      });
    }
  }
};

module.exports = authController;