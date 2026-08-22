const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const config = require('./config');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev
      'http://localhost:3000',  // Local
      process.env.FRONTEND_URL  // Production
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);

// Root route — friendly response instead of "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    message: 'CommunityHub API is running',
    docs: 'See /api/health for a health check, or /api/issues for the issues endpoint.'
  });
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
