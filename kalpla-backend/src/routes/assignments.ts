import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireMentor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/mentor/assignments
 * Get all assignments created by the mentor
 */
router.get('/', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    const assignments = await prisma.assignment.findMany({
      where: { mentorId },
      include: {
        module: {
          select: {
            title: true,
            order: true,
            program: {
              select: {
                name: true,
              },
            },
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics for each assignment
    const assignmentsWithStats = assignments.map(assignment => {
      const totalSubmissions = assignment._count.submissions;
      const gradedSubmissions = assignment.submissions.filter(s => s.status === 'GRADED').length;
      const pendingSubmissions = assignment.submissions.filter(s => s.status === 'SUBMITTED').length;
      
      const averageScore = totalSubmissions > 0 
        ? assignment.submissions
            .filter(s => s.score !== null)
            .reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions
        : 0;

      return {
        ...assignment,
        statistics: {
          totalSubmissions,
          gradedSubmissions,
          pendingSubmissions,
          averageScore: Math.round(averageScore * 100) / 100,
        },
      };
    });

    res.json({
      success: true,
      data: assignmentsWithStats,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments',
    });
  }
});

/**
 * POST /api/mentor/assignments
 * Create a new assignment
 */
router.post('/', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const {
      moduleId,
      title,
      description,
      type,
      maxScore,
      dueDate,
      fileTypes,
      gradingRubric,
    } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    if (!moduleId || !title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        error: 'moduleId, title, description, and dueDate are required',
      });
    }

    // Verify the module exists and mentor has access
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        program: {
          enrollments: {
            some: {
              user: {
                sessionsCreated: {
                  some: {
                    creatorId: mentorId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found or access denied',
      });
    }

    const assignment = await prisma.assignment.create({
      data: {
        moduleId,
        mentorId,
        title,
        description,
        type: type || 'SUBMISSION',
        maxScore: maxScore || 100,
        dueDate: new Date(dueDate),
        fileTypes: fileTypes || [],
        gradingRubric: gradingRubric || null,
      },
      include: {
        module: {
          select: {
            title: true,
            order: true,
            program: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create assignment',
    });
  }
});

/**
 * GET /api/mentor/assignments/:id
 * Get a specific assignment with submissions
 */
router.get('/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    const assignment = await prisma.assignment.findFirst({
      where: {
        id,
        mentorId,
      },
      include: {
        module: {
          select: {
            title: true,
            order: true,
            program: {
              select: {
                name: true,
              },
            },
          },
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment',
    });
  }
});

/**
 * PUT /api/mentor/assignments/:id
 * Update an assignment
 */
router.put('/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;
    const {
      title,
      description,
      type,
      maxScore,
      dueDate,
      fileTypes,
      gradingRubric,
      isActive,
    } = req.body;

    // Verify the assignment belongs to this mentor
    const existingAssignment = await prisma.assignment.findFirst({
      where: { id, mentorId },
    });

    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (maxScore) updateData.maxScore = maxScore;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (fileTypes) updateData.fileTypes = fileTypes;
    if (gradingRubric) updateData.gradingRubric = gradingRubric;
    if (isActive !== undefined) updateData.isActive = isActive;

    const assignment = await prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        module: {
          select: {
            title: true,
            order: true,
            program: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update assignment',
    });
  }
});

/**
 * DELETE /api/mentor/assignments/:id
 * Delete an assignment
 */
router.delete('/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    // Verify the assignment belongs to this mentor
    const existingAssignment = await prisma.assignment.findFirst({
      where: { id, mentorId },
    });

    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    await prisma.assignment.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete assignment',
    });
  }
});

/**
 * GET /api/mentor/assignments/:id/submissions
 * Get all submissions for an assignment
 */
router.get('/:id/submissions', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    // Verify the assignment belongs to this mentor
    const assignment = await prisma.assignment.findFirst({
      where: { id, mentorId },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
    });
  }
});

/**
 * POST /api/mentor/assignments/:id/submissions/:submissionId/grade
 * Grade a submission
 */
router.post('/:id/submissions/:submissionId/grade', requireMentor, async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    const mentorId = req.mentorId;
    const { score, feedback, audioFeedback } = req.body;

    // Verify the assignment belongs to this mentor
    const assignment = await prisma.assignment.findFirst({
      where: { id, mentorId },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    // Verify the submission exists for this assignment
    const submission = await prisma.assignmentSubmission.findFirst({
      where: {
        id: submissionId,
        assignmentId: id,
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    const updateData: any = {
      gradedAt: new Date(),
      status: 'GRADED',
    };

    if (score !== undefined) updateData.score = score;
    if (feedback) updateData.feedback = feedback;
    if (audioFeedback) updateData.audioFeedback = audioFeedback;

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Submission graded successfully',
      data: updatedSubmission,
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to grade submission',
    });
  }
});

/**
 * PUT /api/mentor/assignments/:id/submissions/:submissionId
 * Update a submission (for returning to student)
 */
router.put('/:id/submissions/:submissionId', requireMentor, async (req, res) => {
  try {
    const { id, submissionId } = req.params;
    const mentorId = req.mentorId;
    const { status, feedback, audioFeedback } = req.body;

    // Verify the assignment belongs to this mentor
    const assignment = await prisma.assignment.findFirst({
      where: { id, mentorId },
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found or access denied',
      });
    }

    // Verify the submission exists for this assignment
    const submission = await prisma.assignmentSubmission.findFirst({
      where: {
        id: submissionId,
        assignmentId: id,
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (feedback) updateData.feedback = feedback;
    if (audioFeedback) updateData.audioFeedback = audioFeedback;

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: updatedSubmission,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update submission',
    });
  }
});

export default router;
