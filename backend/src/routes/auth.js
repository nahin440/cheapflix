// auth.js - Updated to use your authController
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import your actual controller

// Use your actual controller methods
router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth router is working!' });
});

console.log('✅ Auth routes loaded!');

module.exports = router;