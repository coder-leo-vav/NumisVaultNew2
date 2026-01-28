require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import database configuration
const { pool } = require('./config/db');

// Import routes
const coinRoutes = require('./routes/coinRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const countryRoutes = require('./routes/countryRoutes');
const denominationRoutes = require('./routes/denominationRoutes');
const materialRoutes = require('./routes/materialRoutes');
const conditionRoutes = require('./routes/conditionRoutes');
const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT || 5000;
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/coins', coinRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/denominations', denominationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});