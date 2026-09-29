import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/index.js';
import corsMiddleware from './middleware/cors.js';
import requestLogger from './middleware/logger.js';
import { sanitizeAll, preventInjection } from './middleware/sanitize.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Security Headers & CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabled in dev for flexibility with CDNs
}));
app.use(corsMiddleware);

// 2. Global Rate Limiting
app.use(generalLimiter);

// 3. Request Logging
app.use(requestLogger);

// 4. Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Compression
app.use(compression());

// 6. Input Sanitization & Anti-Injection
app.use(sanitizeAll);
app.use(preventInjection);

// 7. Initialize Passport OAuth


// 8. Static File Serving (Uploads & Local Assets)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 9. API Routes Root Mount
app.use('/api', routes);

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 10. Root Welcome / Health Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Amazon Clone REST API',
    version: '1.0.0',
    status: 'running',
    environment: config.env,
    documentation: '/api/docs',
    timestamp: new Date().toISOString(),
  });
});

// 11. 404 & Global Error Handling Middleware (Must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
