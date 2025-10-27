import { Application } from 'express'

export async function registerRoutes(app: Application) {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Placeholder API endpoints
  app.get('/api/user', (req, res) => {
    res.json({ message: 'User endpoint - not implemented' })
  })

  app.get('/api/sessions', (req, res) => {
    res.json({ message: 'Sessions endpoint - not implemented' })
  })

  console.log('Routes registered successfully')
}