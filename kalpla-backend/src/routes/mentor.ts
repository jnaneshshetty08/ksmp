import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireMentor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/mentor/sessions
 * Get sessions created by the mentor
 */
router.get('/sessions', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    const sessions = await prisma.session.findMany({
      where: { creatorId: mentorId },
      include: {
        module: {
          select: {
            title: true,
            order: true,
          },
        },
        videoProgress: {
          select: {
            studentId: true,
            watchedSeconds: true,
            completed: true,
            lastWatched: true,
            student: {
              select: {
                name: true,
                email: true,
              },
            },
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
    console.error('Error fetching mentor sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
    });
  }
});

/**
 * POST /api/mentor/sessions
 * Create a new session
 */
router.post('/sessions', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { moduleId, title, description, startTime, endTime, maxParticipants = 100 } = req.body;

    if (!moduleId || !title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'moduleId, title, startTime, and endTime are required',
      });
    }

    // Get the next order index for this module
    const lastSession = await prisma.session.findFirst({
      where: { moduleId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const orderIndex = (lastSession?.orderIndex || 0) + 1;

    const session = await prisma.session.create({
      data: {
        moduleId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxParticipants,
        orderIndex,
        creatorId: mentorId!,
      },
      include: {
        module: {
          select: {
            title: true,
            order: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Session created successfully',
      data: session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create session',
    });
  }
});

/**
 * PUT /api/mentor/sessions/:sessionId
 * Update a session
 */
router.put('/sessions/:sessionId', requireMentor, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const mentorId = req.mentorId;
    const { title, description, startTime, endTime, maxParticipants, videoS3Key, duration } = req.body;

    // Verify the session belongs to this mentor
    const existingSession = await prisma.session.findFirst({
      where: { id: sessionId, creatorId: mentorId },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or access denied',
      });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (maxParticipants) updateData.maxParticipants = maxParticipants;
    if (videoS3Key) updateData.videoS3Key = videoS3Key;
    if (duration) updateData.duration = parseInt(duration);

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        module: {
          select: {
            title: true,
            order: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update session',
    });
  }
});

/**
 * GET /api/mentor/students
 * Get students enrolled in sessions created by this mentor
 */
router.get('/students', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    // Get all sessions created by this mentor
    const mentorSessions = await prisma.session.findMany({
      where: { creatorId: mentorId },
      select: { id: true },
    });

    const sessionIds = mentorSessions.map(s => s.id);

    // Get students who have progress in these sessions
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        videoProgress: {
          some: {
            sessionId: {
              in: sessionIds,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        enrollmentDate: true,
        videoProgress: {
          where: {
            sessionId: {
              in: sessionIds,
            },
          },
          select: {
            sessionId: true,
            watchedSeconds: true,
            completed: true,
            lastWatched: true,
            session: {
              select: {
                title: true,
                module: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate statistics for each student
    const studentsWithStats = students.map(student => {
      const totalSessions = student.videoProgress.length;
      const completedSessions = student.videoProgress.filter(p => p.completed).length;
      const totalWatchedSeconds = student.videoProgress.reduce((sum, p) => sum + p.watchedSeconds, 0);
      const lastWatched = student.videoProgress
        .filter(p => p.lastWatched)
        .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())[0]?.lastWatched;

      return {
        ...student,
        statistics: {
          totalSessions,
          completedSessions,
          completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
          totalWatchedSeconds,
          lastWatched,
        },
      };
    });

    res.json({
      success: true,
      data: studentsWithStats,
    });
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
    });
  }
});

/**
 * GET /api/mentor/analytics
 * Get analytics for mentor's sessions
 */
router.get('/analytics', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    const [
      totalSessions,
      totalStudents,
      totalVideoProgress,
      completedProgress,
    ] = await Promise.all([
      prisma.session.count({ where: { creatorId: mentorId } }),
      prisma.user.count({
        where: {
          role: 'STUDENT',
          videoProgress: {
            some: {
              session: {
                creatorId: mentorId,
              },
            },
          },
        },
      }),
      prisma.videoProgress.count({
        where: {
          session: {
            creatorId: mentorId,
          },
        },
      }),
      prisma.videoProgress.count({
        where: {
          session: {
            creatorId: mentorId,
          },
          completed: true,
        },
      }),
    ]);

    const completionRate = totalVideoProgress > 0 
      ? (completedProgress / totalVideoProgress) * 100 
      : 0;

    // Get recent activity
    const recentActivity = await prisma.videoProgress.findMany({
      where: {
        session: {
          creatorId: mentorId,
        },
        lastWatched: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        session: {
          select: {
            title: true,
            module: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastWatched: 'desc',
      },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalSessions,
          totalStudents,
          totalVideoProgress,
          completedProgress,
          completionRate: Math.round(completionRate * 100) / 100,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Error fetching mentor analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

export default router;
