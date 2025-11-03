const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users - Get all users
router.get('/', userController.getAllUsers);

// GET /users/:userId/profile - Get user profile
router.get('/:userId/profile', userController.getProfile);

// PUT /users/:userId/profile - Update user profile
router.put('/:userId/profile', userController.updateProfile);

// GET /users/:userId/devices - Get user devices
router.get('/:userId/devices', userController.getDevices);

// DELETE /users/:userId/devices/:deviceId - Remove user device
router.delete('/:userId/devices/:deviceId', userController.removeDevice);

// GET /users/:userId/downloads - Get user downloads
router.get('/:userId/downloads', userController.getDownloads);

// GET /users/:userId/payments - Get user payments
router.get('/:userId/payments', userController.getPayments);

module.exports = router;