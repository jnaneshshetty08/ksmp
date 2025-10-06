import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireMentor } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/mentor/profile
 * Get mentor profile information
 */
router.get('/', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    const profile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      // Create a default profile if none exists
      const newProfile = await prisma.mentorProfile.create({
        data: {
          userId: mentorId,
          bio: '',
          expertise: [],
          socialLinks: {},
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });

      return res.json({
        success: true,
        data: newProfile,
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor profile',
    });
  }
});

/**
 * PUT /api/mentor/profile
 * Update mentor profile information
 */
router.put('/', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const {
      bio,
      designation,
      expertise,
      socialLinks,
      yearsExperience,
      certifications,
      profilePicture,
    } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    // Check if profile exists
    const existingProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.mentorProfile.update({
        where: { userId: mentorId },
        data: {
          bio: bio || existingProfile.bio,
          designation: designation || existingProfile.designation,
          expertise: expertise || existingProfile.expertise,
          socialLinks: socialLinks || existingProfile.socialLinks,
          yearsExperience: yearsExperience || existingProfile.yearsExperience,
          certifications: certifications || existingProfile.certifications,
          profilePicture: profilePicture || existingProfile.profilePicture,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });
    } else {
      // Create new profile
      profile = await prisma.mentorProfile.create({
        data: {
          userId: mentorId,
          bio: bio || '',
          designation: designation || '',
          expertise: expertise || [],
          socialLinks: socialLinks || {},
          yearsExperience: yearsExperience || 0,
          certifications: certifications || {},
          profilePicture: profilePicture || '',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error updating mentor profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mentor profile',
    });
  }
});

/**
 * GET /api/mentor/availability
 * Get mentor availability schedule
 */
router.get('/availability', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;

    const availability = await prisma.mentorAvailability.findMany({
      where: { mentorId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error('Error fetching mentor availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mentor availability',
    });
  }
});

/**
 * POST /api/mentor/availability
 * Create new availability slot
 */
router.post('/availability', requireMentor, async (req, res) => {
  try {
    const mentorId = req.mentorId;
    const { dayOfWeek, startTime, endTime, sessionType } = req.body;

    if (!mentorId) {
      return res.status(401).json({
        success: false,
        error: 'Mentor authentication required',
      });
    }

    if (!dayOfWeek || !startTime || !endTime || !sessionType) {
      return res.status(400).json({
        success: false,
        error: 'dayOfWeek, startTime, endTime, and sessionType are required',
      });
    }

    // Validate day of week (0-6)
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({
        success: false,
        error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)',
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        error: 'Time must be in HH:MM format',
      });
    }

    // Check for overlapping availability
    const overlapping = await prisma.mentorAvailability.findFirst({
      where: {
        mentorId,
        dayOfWeek,
        isActive: true,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        error: 'This time slot overlaps with existing availability',
      });
    }

    const availability = await prisma.mentorAvailability.create({
      data: {
        mentorId,
        dayOfWeek,
        startTime,
        endTime,
        sessionType,
      },
    });

    res.json({
      success: true,
      message: 'Availability slot created successfully',
      data: availability,
    });
  } catch (error) {
    console.error('Error creating availability slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create availability slot',
    });
  }
});

/**
 * PUT /api/mentor/availability/:id
 * Update availability slot
 */
router.put('/availability/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;
    const { dayOfWeek, startTime, endTime, sessionType, isActive } = req.body;

    // Verify the availability belongs to this mentor
    const existingAvailability = await prisma.mentorAvailability.findFirst({
      where: { id, mentorId },
    });

    if (!existingAvailability) {
      return res.status(404).json({
        success: false,
        error: 'Availability slot not found or access denied',
      });
    }

    const updateData: any = {};
    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (sessionType) updateData.sessionType = sessionType;
    if (isActive !== undefined) updateData.isActive = isActive;

    const availability = await prisma.mentorAvailability.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Availability slot updated successfully',
      data: availability,
    });
  } catch (error) {
    console.error('Error updating availability slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update availability slot',
    });
  }
});

/**
 * DELETE /api/mentor/availability/:id
 * Delete availability slot
 */
router.delete('/availability/:id', requireMentor, async (req, res) => {
  try {
    const { id } = req.params;
    const mentorId = req.mentorId;

    // Verify the availability belongs to this mentor
    const existingAvailability = await prisma.mentorAvailability.findFirst({
      where: { id, mentorId },
    });

    if (!existingAvailability) {
      return res.status(404).json({
        success: false,
        error: 'Availability slot not found or access denied',
      });
    }

    await prisma.mentorAvailability.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Availability slot deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete availability slot',
    });
  }
});

export default router;
