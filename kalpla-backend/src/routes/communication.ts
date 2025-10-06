import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireMentor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/mentor/messages
 * Get all messages for the mentor
 */
router.get('/messages', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { studentId, limit = 50, offset = 0 } = req.query;

    const whereClause: any = {
      OR: [
        { senderId: mentorId },
        { recipientId: mentorId }
      ]
    };

    if (studentId) {
      whereClause.AND = [
        {
          OR: [
            { senderId: studentId, recipientId: mentorId },
            { senderId: mentorId, recipientId: studentId }
          ]
        }
      ];
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

/**
 * POST /api/mentor/messages
 * Send a new message
 */
router.post('/messages', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { recipientId, content, type = 'text', attachments } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        error: 'recipientId and content are required',
      });
    }

    // Verify the recipient is a student that the mentor has access to
    const hasAccess = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: 'STUDENT',
        videoProgress: {
          some: {
            session: {
              creatorId: mentorId,
            },
          },
        },
      },
    });

    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        error: 'Student not found or access denied',
      });
    }

    const message = await prisma.message.create({
      data: {
        senderId: mentorId,
        recipientId,
        content,
        type,
        attachments: attachments || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipient: {
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
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
});

/**
 * GET /api/mentor/announcements
 * Get all announcements created by the mentor
 */
router.get('/announcements', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { limit = 50, offset = 0 } = req.query;

    const announcements = await prisma.announcement.findMany({
      where: { creatorId: mentorId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            recipients: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch announcements',
    });
  }
});

/**
 * POST /api/mentor/announcements
 * Create a new announcement
 */
router.post('/announcements', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { title, content, targetAudience, targetIds, scheduledAt } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'title and content are required',
      });
    }

    // Get target students based on audience type
    let targetStudentIds: string[] = [];

    if (targetAudience === 'all') {
      // Get all students enrolled in mentor's sessions
      const students = await prisma.user.findMany({
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
        select: { id: true },
      });
      targetStudentIds = students.map(s => s.id);
    } else if (targetAudience === 'specific' && targetIds) {
      // Verify the mentor has access to these students
      const students = await prisma.user.findMany({
        where: {
          id: { in: targetIds },
          role: 'STUDENT',
          videoProgress: {
            some: {
              session: {
                creatorId: mentorId,
              },
            },
          },
        },
        select: { id: true },
      });
      targetStudentIds = students.map(s => s.id);
    }

    const announcement = await prisma.announcement.create({
      data: {
        creatorId: mentorId,
        title,
        content,
        targetAudience,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        isPublished: !scheduledAt, // Auto-publish if not scheduled
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create announcement recipients
    if (targetStudentIds.length > 0) {
      await prisma.announcementRecipient.createMany({
        data: targetStudentIds.map(studentId => ({
          announcementId: announcement.id,
          studentId,
        })),
      });
    }

    res.json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement,
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create announcement',
    });
  }
});

/**
 * GET /api/mentor/announcements/:id
 * Get a specific announcement
 */
router.get('/announcements/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    const announcement = await prisma.announcement.findFirst({
      where: {
        id,
        creatorId: mentorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found or access denied',
      });
    }

    res.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch announcement',
    });
  }
});

/**
 * PUT /api/mentor/announcements/:id
 * Update an announcement
 */
router.put('/announcements/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;
    const { title, content, targetAudience, targetIds, scheduledAt, isPublished } = req.body;

    // Verify the announcement belongs to this mentor
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, creatorId: mentorId },
    });

    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found or access denied',
      });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (targetAudience) updateData.targetAudience = targetAudience;
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
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
      message: 'Announcement updated successfully',
      data: announcement,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update announcement',
    });
  }
});

/**
 * DELETE /api/mentor/announcements/:id
 * Delete an announcement
 */
router.delete('/announcements/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    // Verify the announcement belongs to this mentor
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, creatorId: mentorId },
    });

    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        error: 'Announcement not found or access denied',
      });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete announcement',
    });
  }
});

export default router;
