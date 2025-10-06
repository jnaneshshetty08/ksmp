import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/mentors
 * Get all mentors with their statistics
 */
router.get('/mentors', requireAdmin, async (req, res) => {
  try {
    const mentors = await prisma.user.findMany({
      where: {
        role: 'MENTOR',
      },
      include: {
        sessions: {
          include: {
            videoProgress: {
              select: {
                studentId: true,
              },
            },
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate mentor statistics
    const mentorsWithStats = mentors.map(mentor => {
      const totalSessions = mentor._count.sessions;
      const totalStudents = new Set(
        mentor.sessions.flatMap(session => 
          session.videoProgress?.map((progress: any) => progress.studentId) || []
        )
      ).size;
      
      const completedSessions = mentor.sessions.filter(session => 
        session.status === 'COMPLETED'
      ).length;
      
      const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      return {
        ...mentor,
        statistics: {
          totalSessions,
          totalStudents,
          completionRate: Math.round(completionRate * 100) / 100,
        },
      };
    });

    res.json({
      success: true,
      data: mentorsWithStats,
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentors',
    });
  }
});

/**
 * GET /api/admin/mentors/applications
 * Get mentor applications
 */
router.get('/mentors/applications', requireAdmin, async (req, res) => {
  try {
    // Note: mentorApplication model doesn't exist in schema - returning empty for now
    const applications: any[] = [];

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching mentor applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor applications',
    });
  }
});

/**
 * PUT /api/admin/mentors/applications/:applicationId
 * Update mentor application status
 */
router.put('/mentors/applications/:applicationId', requireAdmin, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, rating } = req.body;
    const reviewerId = req.user?.id;

    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    // Note: mentorApplication model doesn't exist in schema - returning error for now
    return res.status(400).json({
      success: false,
      error: 'Mentor application feature not implemented',
    });
    
  } catch (error) {
    console.error('Error updating mentor application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mentor application',
    });
  }
});

export default router;
