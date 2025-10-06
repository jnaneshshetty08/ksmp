import { Router } from 'express';
import { LiveStreamService } from '../services/LiveStreamService';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const liveStreamService = new LiveStreamService();
const prisma = new PrismaClient();

/**
 * Create a new live session
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { mentorId, sessionId, title, description, scheduledAt, duration, maxParticipants } = req.body;
    const userId = req.user?.id;

    // Verify user is admin or mentor
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'MENTOR') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create IVS channel
    const channelResult = await liveStreamService.createChannel(mentorId, sessionId, title);
    if (!channelResult.success || !channelResult.channel) {
      return res.status(500).json({ error: channelResult.error || 'Failed to create IVS channel' });
    }

    // Create IVS stage for interactive features
    const stageResult = await liveStreamService.createStage(sessionId, title);
    if (!stageResult.success || !stageResult.stage) {
      return res.status(500).json({ error: stageResult.error || 'Failed to create IVS stage' });
    }

    // Save to database
    const liveSession = await prisma.liveSession.create({
      data: {
        id: sessionId,
        title,
        description,
        mentorId,
        scheduledAt: new Date(scheduledAt),
        duration,
        maxParticipants,
        status: 'SCHEDULED',
        meetingUrl: channelResult.channel.playbackUrl || '',
        meetingId: sessionId,
        channelArn: channelResult.channel.arn,
        stageArn: stageResult.stage.arn,
        streamKey: channelResult.channel.streamKey,
        isRecorded: true,
        chatEnabled: true,
        screenEnabled: true,
        breakoutRoomsEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      session: liveSession,
      channel: channelResult.channel,
      stage: stageResult.stage
    });
  } catch (error) {
    console.error('Error creating live session:', error);
    res.status(500).json({ error: 'Failed to create live session' });
  }
});

/**
 * Get all live sessions
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, mentorId, limit = 50, offset = 0 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (mentorId) where.mentorId = mentorId;

    const sessions = await prisma.liveSession.findMany({
      where,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { scheduledAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

/**
 * Get a specific live session
 */
router.get('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error fetching live session:', error);
    res.status(500).json({ error: 'Failed to fetch live session' });
  }
});

/**
 * Start a live session
 */
router.post('/:sessionId/start', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify user is admin or the mentor of this session
    if (req.user?.role !== 'ADMIN' && session.mentorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update session status
    const updatedSession = await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        status: 'LIVE',
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error('Error starting live session:', error);
    res.status(500).json({ error: 'Failed to start live session' });
  }
});

/**
 * End a live session
 */
router.post('/:sessionId/end', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify user is admin or the mentor of this session
    if (req.user?.role !== 'ADMIN' && session.mentorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update session status
    const updatedSession = await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error('Error ending live session:', error);
    res.status(500).json({ error: 'Failed to end live session' });
  }
});

/**
 * Join a live session
 */
router.post('/:sessionId/join', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if session is live or scheduled
    if (session.status !== 'LIVE' && session.status !== 'SCHEDULED') {
      return res.status(400).json({ error: 'Session is not available for joining' });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.liveSessionParticipant.findFirst({
      where: {
        sessionId,
        studentId: userId
      }
    });

    if (existingParticipant) {
      return res.json({
        success: true,
        participant: existingParticipant,
        session
      });
    }

    // Add participant
    const participant = await prisma.liveSessionParticipant.create({
      data: {
        sessionId,
        studentId: userId,
        status: 'INVITED',
        joinedAt: new Date()
      }
    });

    res.json({
      success: true,
      participant,
      session
    });
  } catch (error) {
    console.error('Error joining live session:', error);
    res.status(500).json({ error: 'Failed to join live session' });
  }
});

/**
 * Leave a live session
 */
router.post('/:sessionId/leave', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const participant = await prisma.liveSessionParticipant.findFirst({
      where: {
        sessionId,
        studentId: userId
      }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    // Update participant status
    const updatedParticipant = await prisma.liveSessionParticipant.update({
      where: { id: participant.id },
      data: {
        status: 'LEFT',
        leftAt: new Date()
      }
    });

    res.json({
      success: true,
      participant: updatedParticipant
    });
  } catch (error) {
    console.error('Error leaving live session:', error);
    res.status(500).json({ error: 'Failed to leave live session' });
  }
});

/**
 * Delete a live session
 */
router.delete('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    const session = await prisma.liveSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify user is admin or the mentor of this session
    if (req.user?.role !== 'ADMIN' && session.mentorId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete IVS resources
    if (session.channelArn) {
      await liveStreamService.deleteChannel(session.channelArn);
    }
    if (session.stageArn) {
      await liveStreamService.deleteStage(session.stageArn);
    }

    // Delete from database
    await prisma.liveSession.delete({
      where: { id: sessionId }
    });

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting live session:', error);
    res.status(500).json({ error: 'Failed to delete live session' });
  }
});

export default router;
