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

// Serve uploaded files from the correct directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes - with correct relative paths
console.log('🔄 Loading routes...');

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

// Simple 404 handler
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
  console.log(`   http://localhost:${PORT}/api/movies/test`);
  console.log(`   http://localhost:${PORT}/api/movies/1/stream`);
  console.log(`   http://localhost:${PORT}/api/movies/1/thumbnail`);
});