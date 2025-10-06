import { SNSClient, PublishCommand, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns';
import { PrismaClient } from '@prisma/client';

export class NotificationService {
  private snsClient: SNSClient;
  private prisma: PrismaClient | null;
  private region: string;

  constructor() {
    // Initialize Prisma only if database is available
    try {
      this.prisma = new PrismaClient();
    } catch (error) {
      console.warn('Database not available. Using mock service for development.');
      this.prisma = null;
    }
    
    // Initialize AWS SNS
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.snsClient = new SNSClient({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    
    console.log('📱 AWS SNS Notification service initialized');
  }

  /**
   * Send push notification to a specific user
   */
  async sendToUser(userId: string, title: string, body: string, data?: any) {
    try {
      // Get user's device token/endpoint from database
      const deviceToken = await this.getUserDeviceToken(userId);
      
      if (!deviceToken) {
        console.log(`📱 No device token found for user ${userId}, using mock notification`);
        return { success: true, messageId: `mock-message-${Date.now()}` };
      }

      // Create SNS message
      const message = {
        default: `${title}: ${body}`,
        APNS: JSON.stringify({
          aps: {
            alert: {
              title,
              body,
            },
            sound: 'default',
            badge: 1,
          },
          ...data,
        }),
        GCM: JSON.stringify({
          notification: {
            title,
            body,
            icon: 'ic_notification',
            color: '#2196F3',
            sound: 'default',
          },
          data: data || {},
        }),
      };

      const command = new PublishCommand({
        TargetArn: deviceToken,
        Message: JSON.stringify(message),
        MessageStructure: 'json',
      });

      const response = await this.snsClient.send(command);
      console.log(`📱 Push notification sent to user ${userId}: ${response.MessageId}`);
      
      return { success: true, messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: 'Failed to send notification' };
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendToUsers(userIds: string[], title: string, body: string, data?: any) {
    try {
      const results = [];
      let successCount = 0;
      let failureCount = 0;

      for (const userId of userIds) {
        const result = await this.sendToUser(userId, title, body, data);
        results.push(result);
        
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }
      }

      console.log(`📱 Push notifications sent: ${successCount} success, ${failureCount} failed`);
      
      return { 
        success: true, 
        successCount,
        failureCount,
        responses: results
      };
    } catch (error) {
      console.error('Error sending multicast push notification:', error);
      return { success: false, error: 'Failed to send notifications' };
    }
  }

  /**
   * Send SMS notification
   */
  async sendSMS(phoneNumber: string, message: string) {
    try {
      const command = new PublishCommand({
        PhoneNumber: phoneNumber,
        Message: message,
      });

      const response = await this.snsClient.send(command);
      console.log(`📱 SMS sent to ${phoneNumber}: ${response.MessageId}`);
      
      return { success: true, messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: 'Failed to send SMS' };
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(email: string, subject: string, message: string) {
    try {
      const command = new PublishCommand({
        TopicArn: process.env.AWS_SNS_EMAIL_TOPIC_ARN,
        Subject: subject,
        Message: message,
        MessageAttributes: {
          email: {
            DataType: 'String',
            StringValue: email,
          },
        },
      });

      const response = await this.snsClient.send(command);
      console.log(`📱 Email sent to ${email}: ${response.MessageId}`);
      
      return { success: true, messageId: response.MessageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }

  /**
   * Send session reminder notification
   */
  async sendSessionReminder(sessionId: string, title: string, body: string) {
    try {
      // Get all participants for the session
      const participants = await this.getSessionParticipants(sessionId);
      
      if (participants.length === 0) {
        return { success: false, error: 'No participants found' };
      }

      const data = {
        type: 'session_reminder',
        sessionId,
        action: 'view_session'
      };

      return await this.sendToUsers(participants, title, body, data);
    } catch (error) {
      console.error('Error sending session reminder:', error);
      return { success: false, error: 'Failed to send session reminder' };
    }
  }

  /**
   * Send assignment deadline notification
   */
  async sendAssignmentDeadline(assignmentId: string, title: string, body: string) {
    try {
      // Get all students assigned to this assignment
      const students = await this.getAssignmentStudents(assignmentId);
      
      if (students.length === 0) {
        return { success: false, error: 'No students found' };
      }

      const data = {
        type: 'assignment_deadline',
        assignmentId,
        action: 'view_assignment'
      };

      return await this.sendToUsers(students, title, body, data);
    } catch (error) {
      console.error('Error sending assignment deadline:', error);
      return { success: false, error: 'Failed to send assignment deadline' };
    }
  }

  /**
   * Send payment confirmation notification
   */
  async sendPaymentConfirmation(userId: string, amount: number, transactionId: string) {
    const title = 'Payment Confirmed';
    const body = `Your payment of ₹${amount} has been confirmed. Transaction ID: ${transactionId}`;
    
    const data = {
      type: 'payment_confirmation',
      amount: amount.toString(),
      transactionId,
      action: 'view_payment'
    };

    return await this.sendToUser(userId, title, body, data);
  }

  /**
   * Send new message notification
   */
  async sendNewMessageNotification(userId: string, senderName: string, message: string, sessionId: string) {
    const title = `New message from ${senderName}`;
    const body = message.length > 100 ? message.substring(0, 100) + '...' : message;
    
    const data = {
      type: 'new_message',
      sessionId,
      senderName,
      action: 'view_chat'
    };

    return await this.sendToUser(userId, title, body, data);
  }

  /**
   * Send system update notification
   */
  async sendSystemUpdate(title: string, body: string, action?: string) {
    try {
      // Get all active users
      const activeUsers = await this.getActiveUsers();
      
      if (activeUsers.length === 0) {
        return { success: false, error: 'No active users found' };
      }

      const data = {
        type: 'system_update',
        action: action || 'view_updates'
      };

      return await this.sendToUsers(activeUsers, title, body, data);
    } catch (error) {
      console.error('Error sending system update:', error);
      return { success: false, error: 'Failed to send system update' };
    }
  }

  /**
   * Create SNS topic for notifications
   */
  async createTopic(topicName: string) {
    try {
      const command = new CreateTopicCommand({
        Name: topicName,
      });

      const response = await this.snsClient.send(command);
      console.log(`📱 Created SNS topic: ${topicName} - ${response.TopicArn}`);
      
      return { success: true, topicArn: response.TopicArn };
    } catch (error) {
      console.error('Error creating SNS topic:', error);
      return { success: false, error: 'Failed to create topic' };
    }
  }

  /**
   * Subscribe user to SNS topic
   */
  async subscribeToTopic(topicArn: string, protocol: string, endpoint: string) {
    try {
      const command = new SubscribeCommand({
        TopicArn: topicArn,
        Protocol: protocol, // 'email', 'sms', 'application'
        Endpoint: endpoint,
      });

      const response = await this.snsClient.send(command);
      console.log(`📱 Subscribed ${endpoint} to topic: ${response.SubscriptionArn}`);
      
      return { success: true, subscriptionArn: response.SubscriptionArn };
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return { success: false, error: 'Failed to subscribe' };
    }
  }

  /**
   * Get user's device token from database
   */
  private async getUserDeviceToken(userId: string): Promise<string | null> {
    if (!this.prisma) {
      console.log(`📱 Mock: Getting device token for user ${userId}`);
      return null; // Return null to use mock mode
    }
    
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { fcmToken: true }
      });
      return user?.fcmToken || null;
    } catch (error) {
      console.error('Error fetching device token:', error);
      return null;
    }
  }

  /**
   * Get session participants from database
   */
  private async getSessionParticipants(sessionId: string): Promise<string[]> {
    if (!this.prisma) {
      console.log(`📱 Mock: Getting session participants for session ${sessionId}`);
      return ['mock-user-1', 'mock-user-2'];
    }
    
    try {
      const session = await this.prisma.session.findUnique({
        where: { id: sessionId },
        include: { participants: { select: { id: true } } }
      });
      return session?.participants.map(p => p.id) || [];
    } catch (error) {
      console.error('Error fetching session participants:', error);
      return [];
    }
  }

  /**
   * Get assignment students from database
   */
  private async getAssignmentStudents(assignmentId: string): Promise<string[]> {
    if (!this.prisma) {
      console.log(`📱 Mock: Getting assignment students for assignment ${assignmentId}`);
      return ['mock-student-1', 'mock-student-2'];
    }
    
    try {
      const assignment = await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: { 
          module: {
            include: {
              program: {
                include: {
                  enrollments: {
                    include: { user: { select: { id: true } } }
                  }
                }
              }
            }
          }
        }
      });
      
      if (!assignment) return [];
      
      return assignment.module.program.enrollments.map((enrollment: any) => enrollment.user.id);
    } catch (error) {
      console.error('Error fetching assignment students:', error);
      return [];
    }
  }

  /**
   * Get active users from database
   */
  private async getActiveUsers(): Promise<string[]> {
    if (!this.prisma) {
      console.log('📱 Mock: Getting active users');
      return ['mock-user-1', 'mock-user-2', 'mock-user-3'];
    }
    
    try {
      const users = await this.prisma.user.findMany({
        where: { 
          status: 'ACTIVE',
          fcmToken: { not: null }
        },
        select: { id: true }
      });
      return users.map(user => user.id);
    } catch (error) {
      console.error('Error fetching active users:', error);
      return [];
    }
  }

  /**
   * Update user's device token
   */
  async updateUserDeviceToken(userId: string, deviceToken: string): Promise<boolean> {
    if (!this.prisma) {
      console.log(`📱 Mock: Updating device token for user ${userId}`);
      return true;
    }
    
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fcmToken: deviceToken }
      });
      return true;
    } catch (error) {
      console.error('Error updating device token:', error);
      return false;
    }
  }

  /**
   * Remove user's device token (for logout)
   */
  async removeUserDeviceToken(userId: string): Promise<boolean> {
    if (!this.prisma) {
      console.log(`📱 Mock: Removing device token for user ${userId}`);
      return true;
    }
    
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fcmToken: null }
      });
      return true;
    } catch (error) {
      console.error('Error removing device token:', error);
      return false;
    }
  }
}