import express from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

export function setupAnalyticsRoutes(app: express.Application, analyticsService: AnalyticsService) {
  // Analytics endpoints
  app.get('/api/analytics/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { timeRange = '30d' } = req.query;
      
      const result = await analyticsService.getUserDashboardData(userId, timeRange as string);
      res.json(result);
    } catch (error) {
      console.error('Error getting user analytics:', error);
      res.status(500).json({ success: false, error: 'Failed to get user analytics' });
    }
  });

  app.get('/api/analytics/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const result = await analyticsService.getSessionAnalytics(sessionId);
      res.json(result);
    } catch (error) {
      console.error('Error getting session analytics:', error);
      res.status(500).json({ success: false, error: 'Failed to get session analytics' });
    }
  });

  app.get('/api/analytics/system', async (req, res) => {
    try {
      const { timeRange = '30d' } = req.query;
      
      const result = await analyticsService.getSystemAnalytics(timeRange as string);
      res.json(result);
    } catch (error) {
      console.error('Error getting system analytics:', error);
      res.status(500).json({ success: false, error: 'Failed to get system analytics' });
    }
  });
}
