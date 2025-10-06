import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/payments
 * Get all payment transactions
 */
router.get('/payments', requireAdmin, async (req, res) => {
  try {
    // Note: payment model doesn't exist in schema - using enrollment data instead
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        program: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const payments = enrollments.map(enrollment => ({
      id: enrollment.id,
      amount: enrollment.program.price,
      status: enrollment.status,
      createdAt: enrollment.createdAt,
      user: enrollment.user,
      program: enrollment.program,
    }));

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
    });
  }
});

/**
 * GET /api/admin/analytics/revenue
 * Get revenue analytics
 */
router.get('/analytics/revenue', requireAdmin, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate: Date;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Note: payment model doesn't exist in schema - using enrollment data instead
    const enrollments = await prisma.enrollment.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        program: {
          select: {
            price: true,
          },
        },
      },
    });

    const payments = enrollments.map(enrollment => ({
      amount: enrollment.program.price,
      createdAt: enrollment.createdAt,
    }));

    const totalRevenue = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
    const paymentCount = payments.length;
    const averagePayment = paymentCount > 0 ? totalRevenue / paymentCount : 0;

    // Group by date for chart data
    const revenueByDate = payments.reduce((acc: any, payment: any) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        totalRevenue,
        paymentCount,
        averagePayment,
        revenueByDate,
        period,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue analytics',
    });
  }
});

/**
 * GET /api/admin/analytics/overview
 * Get overview analytics for admin dashboard
 */
router.get('/analytics/overview', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalMentors,
      totalSessions,
      totalVideoProgress,
      recentEnrollments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.session.count(),
      prisma.videoProgress.count(),
      prisma.enrollment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    // Get completion statistics
    const completedProgress = await prisma.videoProgress.count({
      where: { completed: true },
    });

    const completionRate = totalVideoProgress > 0 
      ? (completedProgress / totalVideoProgress) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          mentors: totalMentors,
        },
        content: {
          totalSessions,
          totalVideoProgress,
          completionRate: Math.round(completionRate * 100) / 100,
        },
        engagement: {
          recentEnrollments,
          completedProgress,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

/**
 * GET /api/admin/analytics/engagement
 * Get engagement analytics
 */
router.get('/analytics/engagement', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalSessions,
      completedSessions,
      totalVideoProgress,
      completedVideoProgress,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      prisma.session.count(),
      prisma.session.count({
        where: {
          status: 'COMPLETED',
        },
      }),
      prisma.videoProgress.count(),
      prisma.videoProgress.count({
        where: {
          completed: true,
        },
      }),
    ]);

    const sessionCompletionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const videoCompletionRate = totalVideoProgress > 0 ? (completedVideoProgress / totalVideoProgress) * 100 : 0;
    const userEngagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          engagementRate: Math.round(userEngagementRate * 100) / 100,
        },
        sessions: {
          total: totalSessions,
          completed: completedSessions,
          completionRate: Math.round(sessionCompletionRate * 100) / 100,
        },
        videos: {
          total: totalVideoProgress,
          completed: completedVideoProgress,
          completionRate: Math.round(videoCompletionRate * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching engagement analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch engagement analytics',
    });
  }
});

export default router;
