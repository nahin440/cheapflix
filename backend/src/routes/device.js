const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

// All device routes require authentication
router.use(authMiddleware);

// Device routes - now using real database
router.get('/', deviceController.getUserDevices);
router.get('/info', deviceController.getDeviceInfo);
router.delete('/:device_id', deviceController.removeDevice);

module.exports = router;