import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireMentorOrAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/videos
 * Get all video sessions with progress statistics
 */
router.get('/videos', requireMentorOrAdmin, async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        module: {
          select: {
            title: true,
            order: true,
          },
        },
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        videoProgress: {
          select: {
            studentId: true,
            watchedSeconds: true,
            completed: true,
            lastWatched: true,
          },
        },
        _count: {
          select: {
            videoProgress: true,
          },
        },
      },
      orderBy: [
        { module: { order: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    // Calculate statistics for each session
    const sessionsWithStats = sessions.map(session => {
      const totalStudents = session._count.videoProgress;
      const completedStudents = session.videoProgress.filter(p => p.completed).length;
      const avgProgress = totalStudents > 0 
        ? session.videoProgress.reduce((sum, p) => sum + p.watchedSeconds, 0) / totalStudents
        : 0;

      return {
        ...session,
        statistics: {
          totalStudents,
          completedStudents,
          completionRate: totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0,
          averageProgress: Math.round(avgProgress),
        },
      };
    });

    res.json({
      success: true,
      data: sessionsWithStats,
    });
  } catch (error) {
    console.error('Error fetching video sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video sessions',
    });
  }
});

/**
 * POST /api/admin/videos/:sessionId/assign
 * Assign a video to a session (mentor/admin only)
 */
router.post('/videos/:sessionId/assign', requireMentorOrAdmin, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { videoS3Key, duration } = req.body;

    if (!videoS3Key || !duration) {
      return res.status(400).json({
        success: false,
        error: 'videoS3Key and duration are required',
      });
    }

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        videoS3Key,
        duration: parseInt(duration),
        status: 'COMPLETED',
      },
      include: {
        module: {
          select: {
            title: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Video assigned successfully',
      data: session,
    });
  } catch (error) {
    console.error('Error assigning video:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign video',
    });
  }
});

export default router;
