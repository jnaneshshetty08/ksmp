import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  /**
   * Track user event
   */
  async trackEvent(userId: string, event: string, properties: any = {}) {
    try {
      const analyticsEvent = {
        userId,
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          userAgent: properties.userAgent || 'unknown',
          ip: properties.ip || 'unknown'
        }
      };

      // Store in database
      await this.storeAnalyticsEvent(analyticsEvent);

      // Send to external analytics service (optional)
      await this.sendToExternalAnalytics(analyticsEvent);

      console.log(`Analytics event tracked: ${event} for user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return { success: false, error: 'Failed to track event' };
    }
  }

  /**
   * Track session event
   */
  async trackSessionEvent(sessionId: string, event: string, properties: any = {}) {
    try {
      const analyticsEvent = {
        sessionId,
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString()
        }
      };

      await this.storeAnalyticsEvent(analyticsEvent);
      await this.sendToExternalAnalytics(analyticsEvent);

      console.log(`Session analytics event tracked: ${event} for session ${sessionId}`);
      return { success: true };
    } catch (error) {
      console.error('Error tracking session analytics event:', error);
      return { success: false, error: 'Failed to track session event' };
    }
  }

  /**
   * Get user analytics dashboard data
   */
  async getUserDashboardData(userId: string, timeRange: string = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const analytics = await this.getUserAnalytics(userId, startDate);
      
      return {
        success: true,
        data: {
          totalSessions: analytics.totalSessions,
          totalTime: analytics.totalTime,
          assignmentsCompleted: analytics.assignmentsCompleted,
          averageScore: analytics.averageScore,
          engagementScore: analytics.engagementScore,
          progress: analytics.progress,
          recentActivity: analytics.recentActivity
        }
      };
    } catch (error) {
      console.error('Error getting user dashboard data:', error);
      return { success: false, error: 'Failed to get dashboard data' };
    }
  }

  /**
   * Get session analytics
   */
  async getSessionAnalytics(sessionId: string) {
    try {
      const analytics = await this.getSessionData(sessionId);
      
      return {
        success: true,
        data: {
          totalParticipants: analytics.totalParticipants,
          averageAttendance: analytics.averageAttendance,
          engagementMetrics: analytics.engagementMetrics,
          chatActivity: analytics.chatActivity,
          duration: analytics.duration,
          recordingUrl: analytics.recordingUrl
        }
      };
    } catch (error) {
      console.error('Error getting session analytics:', error);
      return { success: false, error: 'Failed to get session analytics' };
    }
  }

  /**
   * Get program analytics
   */
  async getProgramAnalytics(programId: string, timeRange: string = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const analytics = await this.getProgramData(programId, startDate);
      
      return {
        success: true,
        data: {
          totalEnrollments: analytics.totalEnrollments,
          completionRate: analytics.completionRate,
          averageRating: analytics.averageRating,
          revenue: analytics.revenue,
          userEngagement: analytics.userEngagement,
          popularModules: analytics.popularModules,
          retentionRate: analytics.retentionRate
        }
      };
    } catch (error) {
      console.error('Error getting program analytics:', error);
      return { success: false, error: 'Failed to get program analytics' };
    }
  }

  /**
   * Get mentor analytics
   */
  async getMentorAnalytics(mentorId: string, timeRange: string = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const analytics = await this.getMentorData(mentorId, startDate);
      
      return {
        success: true,
        data: {
          totalSessions: analytics.totalSessions,
          totalMentees: analytics.totalMentees,
          averageRating: analytics.averageRating,
          totalHours: analytics.totalHours,
          menteeProgress: analytics.menteeProgress,
          popularTopics: analytics.popularTopics,
          satisfactionScore: analytics.satisfactionScore
        }
      };
    } catch (error) {
      console.error('Error getting mentor analytics:', error);
      return { success: false, error: 'Failed to get mentor analytics' };
    }
  }

  /**
   * Get system-wide analytics
   */
  async getSystemAnalytics(timeRange: string = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      
      const analytics = await this.getSystemData(startDate);
      
      return {
        success: true,
        data: {
          totalUsers: analytics.totalUsers,
          activeUsers: analytics.activeUsers,
          totalSessions: analytics.totalSessions,
          totalRevenue: analytics.totalRevenue,
          userGrowth: analytics.userGrowth,
          sessionAttendance: analytics.sessionAttendance,
          popularPrograms: analytics.popularPrograms,
          systemHealth: analytics.systemHealth
        }
      };
    } catch (error) {
      console.error('Error getting system analytics:', error);
      return { success: false, error: 'Failed to get system analytics' };
    }
  }

  /**
   * Track user login
   */
  async trackUserLogin(userId: string, userAgent: string, ip: string) {
    return await this.trackEvent(userId, 'user_login', {
      userAgent,
      ip,
      loginTime: new Date().toISOString()
    });
  }

  /**
   * Track user logout
   */
  async trackUserLogout(userId: string, sessionDuration: number) {
    return await this.trackEvent(userId, 'user_logout', {
      sessionDuration,
      logoutTime: new Date().toISOString()
    });
  }

  /**
   * Track session join
   */
  async trackSessionJoin(userId: string, sessionId: string) {
    await this.trackEvent(userId, 'session_join', { sessionId });
    await this.trackSessionEvent(sessionId, 'user_joined', { userId });
  }

  /**
   * Track session leave
   */
  async trackSessionLeave(userId: string, sessionId: string, duration: number) {
    await this.trackEvent(userId, 'session_leave', { sessionId, duration });
    await this.trackSessionEvent(sessionId, 'user_left', { userId, duration });
  }

  /**
   * Track assignment submission
   */
  async trackAssignmentSubmission(userId: string, assignmentId: string, score?: number) {
    return await this.trackEvent(userId, 'assignment_submission', {
      assignmentId,
      score,
      submissionTime: new Date().toISOString()
    });
  }

  /**
   * Track payment completion
   */
  async trackPaymentCompletion(userId: string, amount: number, transactionId: string) {
    return await this.trackEvent(userId, 'payment_completion', {
      amount,
      transactionId,
      paymentTime: new Date().toISOString()
    });
  }

  /**
   * Track chat message
   */
  async trackChatMessage(userId: string, sessionId: string, messageLength: number) {
    await this.trackEvent(userId, 'chat_message', { sessionId, messageLength });
    await this.trackSessionEvent(sessionId, 'chat_message', { userId, messageLength });
  }

  /**
   * Store analytics event in database
   */
  private async storeAnalyticsEvent(event: any) {
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId: event.userId,
          sessionId: event.sessionId,
          event: event.event,
          properties: event.properties
        }
      });
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  }

  /**
   * Send to external analytics service
   */
  private async sendToExternalAnalytics(event: any) {
    // This would typically send to services like Mixpanel, Google Analytics, etc.
    // For now, just log it
    console.log('Sending to external analytics:', event);
  }

  /**
   * Get start date based on time range
   */
  private getStartDate(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Get user analytics data
   */
  private async getUserAnalytics(userId: string, startDate: Date) {
    try {
      // Get user's session participation
      const sessions = await prisma.session.findMany({
        where: {
          participants: {
            some: { id: userId }
          },
          createdAt: { gte: startDate }
        },
        include: {
          videoProgress: {
            where: { studentId: userId }
          }
        }
      });

      // Get assignment submissions
      const assignments = await prisma.assignmentSubmission.findMany({
        where: {
          userId,
          submittedAt: { gte: startDate }
        }
      });

      // Get recent activity
      const recentEvents = await prisma.analyticsEvent.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const totalSessions = sessions.length;
      const totalTime = sessions.reduce((sum, session) => {
        const progress = session.videoProgress[0];
        return sum + (progress?.watchedSeconds || 0);
      }, 0) / 60; // Convert to minutes

      const assignmentsCompleted = assignments.length;
      const averageScore = assignments.length > 0 
        ? assignments.reduce((sum, a) => sum + (a.score || 0), 0) / assignments.length 
        : 0;

      const engagementScore = Math.min(100, (totalSessions * 10) + (assignmentsCompleted * 5));
      const progress = Math.min(100, (assignmentsCompleted / 20) * 100); // Assuming 20 total assignments

      return {
        totalSessions,
        totalTime: Math.round(totalTime),
        assignmentsCompleted,
        averageScore: Math.round(averageScore),
        engagementScore: Math.round(engagementScore),
        progress: Math.round(progress),
        recentActivity: recentEvents.map(event => ({
          date: event.createdAt.toISOString().split('T')[0],
          activity: event.event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }))
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      // Return default values on error
      return {
        totalSessions: 0,
        totalTime: 0,
        assignmentsCompleted: 0,
        averageScore: 0,
        engagementScore: 0,
        progress: 0,
        recentActivity: []
      };
    }
  }

  /**
   * Get session data
   */
  private async getSessionData(sessionId: string) {
    // This would typically query your database
    // For now, return mock data
    return {
      totalParticipants: 45,
      averageAttendance: 38,
      engagementMetrics: {
        chatMessages: 156,
        handRaises: 12,
        screenShares: 3
      },
      chatActivity: 89,
      duration: 90, // minutes
      recordingUrl: 'https://example.com/recording.mp4'
    };
  }

  /**
   * Get program data
   */
  private async getProgramData(programId: string, startDate: Date) {
    // This would typically query your database
    // For now, return mock data
    return {
      totalEnrollments: 250,
      completionRate: 85,
      averageRating: 4.7,
      revenue: 12500000, // in paise
      userEngagement: 78,
      popularModules: ['Module 2', 'Module 5', 'Module 8'],
      retentionRate: 92
    };
  }

  /**
   * Get mentor data
   */
  private async getMentorData(mentorId: string, startDate: Date) {
    // This would typically query your database
    // For now, return mock data
    return {
      totalSessions: 45,
      totalMentees: 12,
      averageRating: 4.8,
      totalHours: 180,
      menteeProgress: 88,
      popularTopics: ['Business Model', 'Marketing', 'Fundraising'],
      satisfactionScore: 94
    };
  }

  /**
   * Get system data
   */
  private async getSystemData(startDate: Date) {
    // This would typically query your database
    // For now, return mock data
    return {
      totalUsers: 1250,
      activeUsers: 890,
      totalSessions: 450,
      totalRevenue: 62500000, // in paise
      userGrowth: 15, // percentage
      sessionAttendance: 82,
      popularPrograms: ['KSMP', 'Advanced Entrepreneurship', 'Startup Accelerator'],
      systemHealth: {
        uptime: 99.9,
        responseTime: 150,
        errorRate: 0.1
      }
    };
  }
}
