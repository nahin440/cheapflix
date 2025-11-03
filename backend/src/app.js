const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
console.log('🔄 Loading routes...');

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

// SIMPLE DEVICE ROUTES - No authentication, no database
app.get('/api/devices/test', (req, res) => {
  console.log('✅ /api/devices/test called');
  res.json({ 
    success: true, 
    message: 'Device routes are working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/devices', (req, res) => {
  console.log('✅ /api/devices called');
  res.json({
    success: true,
    devices: [
      {
        device_id: 1,
        device_name: 'Desktop Computer',
        device_token: 'device_desktop_123',
        registered_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      },
      {
        device_id: 2,
        device_name: 'Mobile Phone',
        device_token: 'device_mobile_456',
        registered_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/devices/info', (req, res) => {
  console.log('✅ /api/devices/info called');
  res.json({
    success: true,
    current_devices: 2,
    max_devices: 3,
    can_add_more: true
  });
});

app.delete('/api/devices/:device_id', (req, res) => {
  console.log('✅ DELETE /api/devices called for device:', req.params.device_id);
  res.json({
    success: true,
    message: 'Device removed successfully'
  });
});

// Load other routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes failed:', error.message);
}

try {
  const usersRoutes = require('./routes/users');
  app.use('/api/users', usersRoutes);
  console.log('✅ Users routes loaded');
} catch (error) {
  console.log('❌ Users routes failed:', error.message);
}

try {
  const moviesRoutes = require('./routes/movies');
  app.use('/api/movies', moviesRoutes);
  console.log('✅ Movies routes loaded');
} catch (error) {
  console.log('❌ Movies routes failed:', error.message);
}

try {
  const subscriptionsRoutes = require('./routes/subscriptions');
  app.use('/api/subscriptions', subscriptionsRoutes);
  console.log('✅ Subscriptions routes loaded');
} catch (error) {
  console.log('❌ Subscriptions routes failed:', error.message);
}

try {
  const paymentsRoutes = require('./routes/payments');
  app.use('/api/payments', paymentsRoutes);
  console.log('✅ Payments routes loaded');
} catch (error) {
  console.log('❌ Payments routes failed:', error.message);
}

try {
  const adminRoutes = require('./routes/admin');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.log('❌ Admin routes failed:', error.message);
}

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'CheapFlix API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found: ' + req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🔍 Test these URLs in your browser:');
  console.log(`   http://localhost:${PORT}/api/test`);
  console.log(`   http://localhost:${PORT}/api/devices/test`);
  console.log(`   http://localhost:${PORT}/api/devices`);
  console.log(`   http://localhost:${PORT}/api/devices/info`);
});