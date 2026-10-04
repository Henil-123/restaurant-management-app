const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb } = require('./config/db');
const foodRoutes = require('./routes/foodRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const billRoutes = require('./routes/billRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Restaurant Management Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);

// Global Error Handler
app.use(errorHandler);

// Initialize DB & Start Server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on port http://localhost:${PORT}`);
      console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
  });
