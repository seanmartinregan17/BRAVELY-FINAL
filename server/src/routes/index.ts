import { Express } from 'express';
import cors from 'cors';

export async function registerRoutes(app: Express): Promise<void> {
  // Enable CORS for all routes
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.vercel.app'] 
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.get('/api/sessions', (req, res) => {
    // TODO: Implement sessions endpoint
    res.json({ sessions: [] });
  });

  app.post('/api/sessions', (req, res) => {
    // TODO: Implement create session endpoint
    res.json({ message: 'Session created' });
  });

  app.get('/api/progress', (req, res) => {
    // TODO: Implement progress endpoint
    res.json({ progress: {} });
  });

  // Catch all handler
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}