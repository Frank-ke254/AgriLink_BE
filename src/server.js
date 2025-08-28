import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import supplierRoutes from './routes/supplierRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import listingRoutes from './routes/listingRoutes.js';

dotenv.config();

const app = express();

// Core
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Security
app.use(helmet());
app.use(hpp());

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// Rate limiting (apply to all API routes)
app.use('/api', apiLimiter);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// Routes
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/farmers', farmerRoutes);
app.use('/api/v1/listings', listingRoutes);

// 404 + Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});