import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireMentor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/mentor/students/:studentId/notes
 * Get all notes for a specific student
 */
router.get('/:studentId/notes', requireMentor, async (req, res) => {
  try {
    const { studentId } = req.params;
    const mentorId = req.mentorId;

    // Verify the mentor has access to this student
    const hasAccess = await prisma.user.findFirst({
      where: {
        id: studentId,
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

    const notes = await prisma.studentNote.findMany({
      where: {
        mentorId,
        studentId,
      },
      include: {
        student: {
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
    });

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching student notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student notes',
    });
  }
});

/**
 * POST /api/mentor/students/:studentId/notes
 * Create a new note for a student
 */
router.post('/:studentId/notes', requireMentor, async (req, res) => {
  try {
    const { studentId } = req.params;
    const mentorId = req.mentorId;
    const { note, category } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    if (!note) {
      return res.status(400).json({
        success: false,
        error: 'Note content is required',
      });
    }

    // Verify the mentor has access to this student
    const hasAccess = await prisma.user.findFirst({
      where: {
        id: studentId,
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

    const studentNote = await prisma.studentNote.create({
      data: {
        mentorId,
        studentId,
        note,
        category: category || null,
      },
      include: {
        student: {
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
      message: 'Note created successfully',
      data: studentNote,
    });
  } catch (error) {
    console.error('Error creating student note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create student note',
    });
  }
});

/**
 * PUT /api/mentor/students/:studentId/notes/:noteId
 * Update a student note
 */
router.put('/:studentId/notes/:noteId', requireMentor, async (req, res) => {
  try {
    const { studentId, noteId } = req.params;
    const mentorId = req.mentorId;
    const { note, category } = req.body;

    // Verify the note belongs to this mentor and student
    const existingNote = await prisma.studentNote.findFirst({
      where: {
        id: noteId,
        mentorId,
        studentId,
      },
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Note not found or access denied',
      });
    }

    const updateData: any = {};
    if (note) updateData.note = note;
    if (category !== undefined) updateData.category = category;

    const updatedNote = await prisma.studentNote.update({
      where: { id: noteId },
      data: updateData,
      include: {
        student: {
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
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    console.error('Error updating student note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student note',
    });
  }
});

/**
 * DELETE /api/mentor/students/:studentId/notes/:noteId
 * Delete a student note
 */
router.delete('/:studentId/notes/:noteId', requireMentor, async (req, res) => {
  try {
    const { studentId, noteId } = req.params;
    const mentorId = req.mentorId;

    // Verify the note belongs to this mentor and student
    const existingNote = await prisma.studentNote.findFirst({
      where: {
        id: noteId,
        mentorId,
        studentId,
      },
    });

    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Note not found or access denied',
      });
    }

    await prisma.studentNote.delete({
      where: { id: noteId },
    });

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student note',
    });
  }
});

/**
 * GET /api/mentor/notes
 * Get all notes created by the mentor
 */
router.get('/', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { category, studentId } = req.query;

    const whereClause: any = { mentorId };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (studentId) {
      whereClause.studentId = studentId;
    }

    const notes = await prisma.studentNote.findMany({
      where: whereClause,
      include: {
        student: {
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
    });

    res.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching mentor notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor notes',
    });
  }
});

export default router;
