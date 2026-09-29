// ============================================
// CORS CONFIGURATION MIDDLEWARE
// ============================================

import cors from 'cors';
import config from '../config/index.js';
import logger from '../config/logger.js';

/**
 * Allowed origins
 */
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://amazon-clone.vercel.app',
  'https://amazon-clone-admin.vercel.app',
].filter(Boolean);

/**
 * CORS Options
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-Forwarded-For',
    'X-CSRF-Token',
  ],

  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'X-Total-Count',
    'X-Cache',
    'Set-Cookie',
  ],

  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

/**
 * CORS Middleware
 * Usage: app.use(corsMiddleware)
 */
export const corsMiddleware = cors(corsOptions);

/**
 * Dynamic CORS for multi-tenant (future use)
 */
export const dynamicCors = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
};

export default corsMiddleware;
