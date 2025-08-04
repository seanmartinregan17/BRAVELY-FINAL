import { Express } from 'express';
import cors from 'cors';

export async function registerRoutes(app: Express): Promise<void> {
  // Enable CORS for all routes
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || 'https://your-frontend-domain.vercel.app',
        // Add your actual Vercel domain here
      ]
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Bravely API Server',
      version: '1.0.0',
      status: 'running'
    });
  });

  // API routes
  app.get('/api/sessions', (req, res) => {
    // TODO: Implement sessions endpoint
    res.json({ sessions: [] });
  });

  app.post('/api/sessions', (req, res) => {
    // TODO: Implement create session endpoint
    res.json({ message: 'Session created', data: req.body });
  });

  app.get('/api/progress', (req, res) => {
    // TODO: Implement progress endpoint
    res.json({ progress: {} });
  });

  app.get('/api/user/profile', (req, res) => {
    // TODO: Implement user profile endpoint
    res.json({ user: { id: '1', name: 'Demo User' } });
  });

  // Catch all handler for undefined routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ 
      message: 'API route not found',
      path: req.path,
      method: req.method
    });
  });

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  });
}