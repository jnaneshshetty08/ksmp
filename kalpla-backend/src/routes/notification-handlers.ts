import express from 'express';
import { NotificationService } from '../services/NotificationService';

export function setupNotificationRoutes(app: express.Application, notificationService: NotificationService) {
  // Notification endpoints
  app.post('/api/notifications/send', async (req, res) => {
    try {
      const { userId, title, body, data } = req.body;
      
      const result = await notificationService.sendToUser(userId, title, body, data);
      res.json(result);
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ success: false, error: 'Failed to send notification' });
    }
  });

  app.post('/api/notifications/session/:sessionId/reminder', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { title, body } = req.body;
      
      const result = await notificationService.sendSessionReminder(sessionId, title, body);
      res.json(result);
    } catch (error) {
      console.error('Error sending session reminder:', error);
      res.status(500).json({ success: false, error: 'Failed to send session reminder' });
    }
  });

  // Device Token management endpoints
  app.post('/api/notifications/device-token', async (req, res) => {
    try {
      const { userId, deviceToken } = req.body;
      
      if (!userId || !deviceToken) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId and deviceToken are required' 
        });
      }
      
      const result = await notificationService.updateUserDeviceToken(userId, deviceToken);
      
      if (result) {
        res.json({ success: true, message: 'Device token updated successfully' });
      } else {
        res.status(500).json({ success: false, error: 'Failed to update device token' });
      }
    } catch (error) {
      console.error('Error updating device token:', error);
      res.status(500).json({ success: false, error: 'Failed to update device token' });
    }
  });

  app.delete('/api/notifications/device-token/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const result = await notificationService.removeUserDeviceToken(userId);
      
      if (result) {
        res.json({ success: true, message: 'Device token removed successfully' });
      } else {
        res.status(500).json({ success: false, error: 'Failed to remove device token' });
      }
    } catch (error) {
      console.error('Error removing device token:', error);
      res.status(500).json({ success: false, error: 'Failed to remove device token' });
    }
  });

  // Send notification to multiple users
  app.post('/api/notifications/send-multiple', async (req, res) => {
    try {
      const { userIds, title, body, data } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'userIds array is required' 
        });
      }
      
      const result = await notificationService.sendToUsers(userIds, title, body, data);
      res.json(result);
    } catch (error) {
      console.error('Error sending notifications:', error);
      res.status(500).json({ success: false, error: 'Failed to send notifications' });
    }
  });

  // Send assignment deadline notification
  app.post('/api/notifications/assignment/:assignmentId/deadline', async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { title, body } = req.body;
      
      const result = await notificationService.sendAssignmentDeadline(assignmentId, title, body);
      res.json(result);
    } catch (error) {
      console.error('Error sending assignment deadline:', error);
      res.status(500).json({ success: false, error: 'Failed to send assignment deadline' });
    }
  });

  // Send payment confirmation notification
  app.post('/api/notifications/payment-confirmation', async (req, res) => {
    try {
      const { userId, amount, transactionId } = req.body;
      
      if (!userId || !amount || !transactionId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId, amount, and transactionId are required' 
        });
      }
      
      const result = await notificationService.sendPaymentConfirmation(userId, amount, transactionId);
      res.json(result);
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      res.status(500).json({ success: false, error: 'Failed to send payment confirmation' });
    }
  });

  // Send new message notification
  app.post('/api/notifications/new-message', async (req, res) => {
    try {
      const { userId, senderName, message, sessionId } = req.body;
      
      if (!userId || !senderName || !message || !sessionId) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId, senderName, message, and sessionId are required' 
        });
      }
      
      const result = await notificationService.sendNewMessageNotification(userId, senderName, message, sessionId);
      res.json(result);
    } catch (error) {
      console.error('Error sending new message notification:', error);
      res.status(500).json({ success: false, error: 'Failed to send new message notification' });
    }
  });

  // Send system update notification
  app.post('/api/notifications/system-update', async (req, res) => {
    try {
      const { title, body, action } = req.body;
      
      if (!title || !body) {
        return res.status(400).json({ 
          success: false, 
          error: 'title and body are required' 
        });
      }
      
      const result = await notificationService.sendSystemUpdate(title, body, action);
      res.json(result);
    } catch (error) {
      console.error('Error sending system update:', error);
      res.status(500).json({ success: false, error: 'Failed to send system update' });
    }
  });

  // Test email notification
  app.post('/api/notifications/test-email', async (req, res) => {
    try {
      const { email, subject, message } = req.body;
      
      if (!email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'email, subject, and message are required' 
        });
      }
      
      const result = await notificationService.sendEmail(email, subject, message);
      res.json(result);
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({ success: false, error: 'Failed to send test email' });
    }
  });

  // Test SMS notification
  app.post('/api/notifications/test-sms', async (req, res) => {
    try {
      const { phoneNumber, message } = req.body;
      
      if (!phoneNumber || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'phoneNumber and message are required' 
        });
      }
      
      const result = await notificationService.sendSMS(phoneNumber, message);
      res.json(result);
    } catch (error) {
      console.error('Error sending test SMS:', error);
      res.status(500).json({ success: false, error: 'Failed to send test SMS' });
    }
  });

  // Get notification service status
  app.get('/api/notifications/status', async (req, res) => {
    try {
      res.json({
        success: true,
        service: 'AWS SNS',
        region: process.env.AWS_REGION || 'us-east-1',
        topics: {
          email: process.env.AWS_SNS_EMAIL_TOPIC_ARN ? 'configured' : 'not configured',
          push: process.env.AWS_SNS_PUSH_TOPIC_ARN ? 'configured' : 'not configured',
          sms: process.env.AWS_SNS_SMS_TOPIC_ARN ? 'configured' : 'not configured'
        },
        features: [
          'Push Notifications',
          'Email Notifications', 
          'SMS Notifications',
          'Session Reminders',
          'Assignment Deadlines',
          'Payment Confirmations',
          'System Updates'
        ]
      });
    } catch (error) {
      console.error('Error getting notification status:', error);
      res.status(500).json({ success: false, error: 'Failed to get notification status' });
    }
  });

  // Get user notification preferences
  app.get('/api/notifications/preferences/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Mock preferences for now - in production, this would come from database
      const preferences = {
        userId,
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        sessionReminders: true,
        assignmentDeadlines: true,
        paymentConfirmations: true,
        systemUpdates: true,
        marketingEmails: false,
        weeklyDigest: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({ success: true, preferences });
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      res.status(500).json({ success: false, error: 'Failed to get notification preferences' });
    }
  });

  // Update user notification preferences
  app.put('/api/notifications/preferences/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = req.body;
      
      // Mock update for now - in production, this would update database
      console.log(`📱 Updating notification preferences for user ${userId}:`, preferences);
      
      res.json({ 
        success: true, 
        message: 'Notification preferences updated successfully',
        preferences: {
          ...preferences,
          userId,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({ success: false, error: 'Failed to update notification preferences' });
    }
  });

  // Send notification with user preferences check
  app.post('/api/notifications/send-with-preferences', async (req, res) => {
    try {
      const { userId, title, body, data, type } = req.body;
      
      if (!userId || !title || !body) {
        return res.status(400).json({ 
          success: false, 
          error: 'userId, title, and body are required' 
        });
      }
      
      // Mock preference check - in production, check user preferences
      const userPreferences = {
        pushNotifications: true,
        emailNotifications: true,
        smsNotifications: false
      };
      
      const results = [];
      
      // Send push notification if enabled
      if (userPreferences.pushNotifications) {
        const pushResult = await notificationService.sendToUser(userId, title, body, data);
        results.push({ type: 'push', result: pushResult });
      }
      
      // Send email if enabled and type requires it
      if (userPreferences.emailNotifications && ['payment_confirmation', 'system_update'].includes(type)) {
        const emailResult = await notificationService.sendEmail(
          'user@example.com', // In production, get from user profile
          title,
          body
        );
        results.push({ type: 'email', result: emailResult });
      }
      
      res.json({ 
        success: true, 
        message: 'Notifications sent based on user preferences',
        results 
      });
    } catch (error) {
      console.error('Error sending notifications with preferences:', error);
      res.status(500).json({ success: false, error: 'Failed to send notifications' });
    }
  });
}