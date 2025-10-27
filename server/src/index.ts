import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from './routes';

const app = express();

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Initialize routes
let routesInitialized = false;
let routePromise: Promise<void> | null = null;

async function initializeRoutes() {
  if (!routesInitialized && !routePromise) {
    routePromise = registerRoutes(app).then(() => {
      routesInitialized = true;
    });
  }
  return routePromise;
}

// For Railway deployment (traditional Express server)
if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
  const PORT = process.env.PORT || 3000;
  
  initializeRoutes().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'localhost'}`);
    });
  }).catch((error) => {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  });
}

// For Vercel serverless deployment
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeRoutes();
    
    // Handle the request with Express
    app(req as any, res as any);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}