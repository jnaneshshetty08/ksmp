import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth';
import { VideoAccessService } from '../../services/VideoAccessService';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/students
 * Get all students with their enrollment and progress data
 */
router.get('/students', requireAdmin, async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      include: {
        enrollments: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        videoProgress: {
          include: {
            session: {
              select: {
                id: true,
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
        _count: {
          select: {
            videoProgress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate student statistics
    const studentsWithStats = students.map(student => {
      const totalProgress = student._count.videoProgress;
      const completedProgress = student.videoProgress.filter(p => p.completed).length;
      const completionRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;

      return {
        ...student,
        statistics: {
          totalProgress,
          completedProgress,
          completionRate: Math.round(completionRate * 100) / 100,
        },
      };
    });

    res.json({
      success: true,
      data: studentsWithStats,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
    });
  }
});

/**
 * GET /api/admin/students/:studentId/progress
 * Get detailed progress for a specific student (admin only)
 */
router.get('/students/:studentId/progress', requireAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        enrollmentDate: true,
        enrollments: {
          include: {
            program: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    const progress = await VideoAccessService.getCourseProgress(studentId);

    res.json({
      success: true,
      data: {
        student,
        progress,
      },
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student progress',
    });
  }
});

export default router;
