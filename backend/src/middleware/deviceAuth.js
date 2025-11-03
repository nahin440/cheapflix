const Device = require('../models/Device');

const deviceAuth = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const device_token = req.headers['device-token'];

    if (!user_id || !device_token) {
      return res.status(401).json({
        error: 'Device authentication required'
      });
    }

    const validation = await Device.validateDeviceAccess(user_id, device_token);
    
    if (!validation.valid) {
      return res.status(403).json({
        error: 'Device not authorized. Please login again.',
        code: 'DEVICE_UNAUTHORIZED'
      });
    }

    req.device = validation.device;
    next();
  } catch (error) {
    console.error('Device auth error:', error);
    res.status(500).json({ error: 'Device authentication failed' });
  }
};

module.exports = deviceAuth;