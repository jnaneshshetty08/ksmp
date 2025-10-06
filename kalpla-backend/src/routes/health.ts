import express from 'express';

export function setupHealthRoutes(app: express.Application) {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Kalpla Backend Server is running!',
      timestamp: new Date().toISOString(),
      services: {
        websocket: 'active',
        livestream: 'active',
        notifications: 'active',
        analytics: 'active'
      }
    });
  });
}
