import express from 'express';
import { LiveStreamService } from '../services/LiveStreamService';
import { AnalyticsService } from '../services/AnalyticsService';

export function setupLiveStreamRoutes(
  app: express.Application, 
  liveStreamService: LiveStreamService, 
  analyticsService: AnalyticsService
) {
  // Live streaming endpoints
  app.post('/api/sessions/:sessionId/stream/start', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { mentorId, title } = req.body;
      
      const result = await liveStreamService.createChannel(mentorId, sessionId, title);
      
      if (result.success) {
        // Track analytics
        await analyticsService.trackSessionEvent(sessionId, 'stream_started', { mentorId });
        
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      res.status(500).json({ success: false, error: 'Failed to start stream' });
    }
  });

  app.post('/api/sessions/:sessionId/stream/end', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { channelArn } = req.body;
      
      const result = await liveStreamService.deleteChannel(channelArn);
      
      if (result.success) {
        // Track analytics
        await analyticsService.trackSessionEvent(sessionId, 'stream_ended', { channelArn });
        
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error ending stream:', error);
      res.status(500).json({ success: false, error: 'Failed to end stream' });
    }
  });
}
