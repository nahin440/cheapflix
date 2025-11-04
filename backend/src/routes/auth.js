// auth.js - Updated to use your authController
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth router is working!' });
});

console.log('✅ Auth routes loaded!');

module.exports = router;
















// // src/controllers/authController.js
// const User = require('../models/User');
// const Device = require('../models/Device');

// exports.login = async (req, res) => {
//   try {
//     const { email, password, device_name, device_token } = req.body;

//     console.log('Login attempt for:', email);
//     console.log('Device info:', { device_name, device_token });

//     // Find user by email
//     const user = await User.findByEmail(email);
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Check password (simple comparison for demo)
//     if (user.password_hash !== password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Register device if provided
//     if (device_name && device_token) {
//       try {
//         console.log('Registering device for user:', user.user_id);
//         const deviceResult = await Device.register(user.user_id, device_name, device_token);
//         console.log('Device registration result:', deviceResult);
//       } catch (deviceError) {
//         console.error('Device registration error:', deviceError);
//         // If device limit exceeded, return error
//         if (deviceError.message.includes('limit') || deviceError.message.includes('maximum') || deviceError.message.includes('cooldown')) {
//           return res.status(400).json({
//             success: false,
//             message: deviceError.message
//           });
//         }
//         // For other device errors, continue with login but log the error
//       }
//     }

//     // Prepare user data for response (remove password_hash)
//     const userData = {
//       user_id: user.user_id,
//       full_name: user.full_name,
//       email: user.email,
//       phone: user.phone,
//       address: user.address,
//       country: user.country,
//       currency_code: user.currency_code,
//       current_subscription_id: user.current_subscription_id,
//       created_at: user.created_at
//     };

//     console.log('Login successful for user:', user.user_id);

//     res.json({
//       success: true,
//       user: userData,
//       token: 'demo-token-' + Date.now()
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(400).json({
//       success: false,
//       message: error.message || 'Login failed'
//     });
//   }
// };

// exports.register = async (req, res) => {
//   try {
//     const { full_name, email, password, phone, address, country, currency_code } = req.body;

//     console.log('Registration attempt for:', email);

//     // Check if user already exists
//     const existingUser = await User.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create new user
//     const user = await User.create({
//       full_name,
//       email,
//       password_hash: password, // In real app, hash this password
//       phone,
//       address,
//       country,
//       currency_code
//     });

//     console.log('User created:', user.user_id);

//     // Prepare user data for response
//     const userData = {
//       user_id: user.user_id,
//       full_name: user.full_name,
//       email: user.email,
//       phone: user.phone,
//       address: user.address,
//       country: user.country,
//       currency_code: user.currency_code,
//       current_subscription_id: user.current_subscription_id,
//       created_at: user.created_at
//     };

//     res.json({
//       success: true,
//       user: userData,
//       message: 'Registration successful'
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(400).json({
//       success: false,
//       message: error.message || 'Registration failed'
//     });
//   }
// };