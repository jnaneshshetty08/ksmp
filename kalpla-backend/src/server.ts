import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketService } from './services/WebSocketService';
import { LiveStreamService } from './services/LiveStreamService';
import { NotificationService } from './services/NotificationService';
import { AnalyticsService } from './services/AnalyticsService';
import videoRoutes from './routes/video';
// import adminRoutes from './routes/admin';
import mentorRoutes from './routes/mentor';
import assignmentRoutes from './routes/assignments';
import studentNoteRoutes from './routes/student-notes';
import mentorProfileRoutes from './routes/mentor-profile';
import communicationRoutes from './routes/communication';
import authRoutes from './routes/auth';
// import liveSessionRoutes from './routes/live-sessions';

// Import route handlers
import { setupHealthRoutes } from './routes/health';
import { setupKalplaRoutes } from './routes/kalpla';
import { setupLiveStreamRoutes } from './routes/live-stream';
import { setupAnalyticsRoutes } from './routes/analytics';
import { setupNotificationRoutes } from './routes/notification-handlers';

dotenv.config();

export function createApp() {
  const app = express();
  const server = createServer(app);
  const PORT = process.env.PORT || 3001;

  // Initialize services
  const webSocketService = new WebSocketService(server);
  const liveStreamService = new LiveStreamService();
  const notificationService = new NotificationService();
  const analyticsService = new AnalyticsService();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }));
  app.use(express.json());

  // Setup routes
  setupHealthRoutes(app);
  setupKalplaRoutes(app);
  setupLiveStreamRoutes(app, liveStreamService, analyticsService);
  setupAnalyticsRoutes(app, analyticsService);
  setupNotificationRoutes(app, notificationService);

  // Authentication routes
  app.use('/api/auth', authRoutes);

  // Video access routes
  app.use('/api/video', videoRoutes);

  // Admin routes
  // app.use('/api/admin', adminRoutes);

  // Mentor routes
  app.use('/api/mentor', mentorRoutes);

  // Assignment routes
  app.use('/api/mentor/assignments', assignmentRoutes);

  // Student notes routes
  app.use('/api/mentor/students', studentNoteRoutes);

  // Mentor profile routes
  app.use('/api/mentor/profile', mentorProfileRoutes);

  // Communication routes
  app.use('/api/mentor/communication', communicationRoutes);

  // Notification routes

  // Live session routes
  // app.use('/api/live-sessions', liveSessionRoutes);

  // WebSocket status endpoint
  app.get('/api/websocket/status', (req, res) => {
    res.json({
      connectedUsers: webSocketService.getConnectedUsersCount(),
      activeSessions: webSocketService.getSessionParticipantsCount('default')
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ 
      success: false, 
      error: 'Endpoint not found',
      path: req.originalUrl
    });
  });

  return { app, server, PORT };
}

export function startServer() {
  const { app, server, PORT } = createApp();
  
  server.listen(PORT, () => {
    console.log(`🚀 Kalpla Backend server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server active`);
    console.log(`📺 Live streaming service ready`);
    console.log(`🔔 Notification service ready`);
    console.log(`📊 Analytics service ready`);
  });
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}