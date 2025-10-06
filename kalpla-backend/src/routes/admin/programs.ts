import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/admin/programs
 * Get all programs with their modules and sessions
 */
router.get('/programs', requireAdmin, async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      include: {
        modules: {
          include: {
            sessions: {
              include: {
                creator: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                _count: {
                  select: {
                    videoProgress: true,
                  },
                },
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch programs',
    });
  }
});

/**
 * POST /api/admin/programs
 * Create a new program
 */
router.post('/programs', requireAdmin, async (req, res) => {
  try {
    const { name, description, duration, price, status = 'draft' } = req.body;

    if (!name || !description || !duration || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, duration, and price are required',
      });
    }

    const program = await prisma.program.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
      },
      include: {
        modules: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Program created successfully',
      data: program,
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create program',
    });
  }
});

/**
 * GET /api/admin/modules
 * Get all modules with their sessions
 */
router.get('/modules', requireAdmin, async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        sessions: {
          include: {
            creator: {
              select: {
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                videoProgress: true,
              },
            },
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch modules',
    });
  }
});

/**
 * POST /api/admin/modules
 * Create a new module
 */
router.post('/modules', requireAdmin, async (req, res) => {
  try {
    const { title, description, order, programId } = req.body;

    if (!title || !description || !order || !programId) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, order, and programId are required',
      });
    }

    const module = await prisma.module.create({
      data: {
        title,
        description,
        order: parseInt(order),
        programId,
        duration: 4, // Default duration in weeks
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        sessions: true,
      },
    });

    res.json({
      success: true,
      message: 'Module created successfully',
      data: module,
    });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create module',
    });
  }
});

/**
 * POST /api/admin/sessions
 * Create a new session
 */
router.post('/sessions', requireAdmin, async (req, res) => {
  try {
    const { title, description, orderIndex, moduleId, creatorId } = req.body;

    if (!title || !description || !orderIndex || !moduleId || !creatorId) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, orderIndex, moduleId, and creatorId are required',
      });
    }

    const session = await prisma.session.create({
      data: {
        title,
        description,
        orderIndex: parseInt(orderIndex),
        moduleId,
        creatorId,
        status: 'SCHEDULED',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        creator: {
          select: {
            name: true,
            email: true,
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

export default router;
